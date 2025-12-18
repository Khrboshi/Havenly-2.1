// lib/creditRules.ts
import { SupabaseClient } from "@supabase/supabase-js";

const FREE_MONTHLY_CREDITS = 3;

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

/**
 * Pull plan type from user_plans (fallback to profiles if needed).
 * This keeps "plan" separate from "credits" which live in user_credits.
 */
async function getPlanTypeForUser(params: {
  supabase: SupabaseClient;
  userId: string;
}): Promise<PlanType> {
  const { supabase, userId } = params;

  // 1) user_plans
  try {
    const { data, error } = await supabase
      .from("user_plans")
      .select("plan_type")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data?.plan_type) {
      const p = String(data.plan_type).toUpperCase();
      return (p === "PREMIUM" || p === "TRIAL") ? (p as PlanType) : "FREE";
    }
  } catch {
    // ignore
  }

  // 2) profiles (legacy fallback)
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("plan_type")
      .eq("id", userId)
      .maybeSingle();

    if (!error && data?.plan_type) {
      const p = String(data.plan_type).toUpperCase();
      return (p === "PREMIUM" || p === "TRIAL") ? (p as PlanType) : "FREE";
    }
  } catch {
    // ignore
  }

  return "FREE";
}

type CreditsRow = {
  credits: number;
  updated_at: string | null;
};

async function getCreditsRow(params: {
  supabase: SupabaseClient;
  userId: string;
}): Promise<{ row: CreditsRow | null; err: any | null }> {
  const { supabase, userId } = params;

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { row: null, err: error };
  if (!data) return { row: null, err: null };

  return {
    row: {
      credits: typeof (data as any).credits === "number" ? (data as any).credits : 0,
      updated_at: typeof (data as any).updated_at === "string" ? (data as any).updated_at : null,
    },
    err: null,
  };
}

async function ensureCreditRowExists(params: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = params;

  const { row, err } = await getCreditsRow({ supabase, userId });
  if (err) return; // do not block
  if (row) return;

  const nowIso = new Date().toISOString();

  await supabase.from("user_credits").upsert(
    {
      user_id: userId,
      credits: FREE_MONTHLY_CREDITS,
      updated_at: nowIso,
    } as any,
    { onConflict: "user_id" }
  );
}

function isSameUtcMonth(aIso: string, b: Date) {
  const a = new Date(aIso);
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();
}

/**
 * ✅ Monthly reset using ONLY updated_at (since renewal_date does not exist in your schema).
 * - If user is FREE and updated_at is from a previous UTC month => reset to 3
 * - PREMIUM/TRIAL => unlimited (credits not enforced)
 */
export async function ensureCreditsFresh(params: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = params;

  await ensureCreditRowExists({ supabase, userId });

  const planType = await getPlanTypeForUser({ supabase, userId });
  if (planType === "PREMIUM" || planType === "TRIAL") return;

  const { row, err } = await getCreditsRow({ supabase, userId });
  if (err || !row) return;

  const now = new Date();

  // If updated_at is missing or from a prior month => reset credits
  if (!row.updated_at || !isSameUtcMonth(row.updated_at, now)) {
    await supabase
      .from("user_credits")
      .update({
        credits: FREE_MONTHLY_CREDITS,
        updated_at: now.toISOString(),
      } as any)
      .eq("user_id", userId);
  }
}

/**
 * Attempts atomic consumption via SQL function if present:
 *   public.consume_free_credit(uid uuid) returns integer
 * Returns:
 *   >=0 remaining credits
 *   -1 means limit reached (no decrement occurred)
 */
async function tryConsumeViaRpc(params: {
  supabase: SupabaseClient;
  userId: string;
}): Promise<{ ok: boolean; remaining?: number; notInstalled?: boolean }> {
  const { supabase, userId } = params;

  const { data, error } = await supabase.rpc("consume_free_credit" as any, {
    uid: userId,
  } as any);

  if (error) {
    const msg = String((error as any)?.message || "").toLowerCase();
    if (msg.includes("function") && msg.includes("does not exist")) {
      return { ok: false, notInstalled: true };
    }
    return { ok: false };
  }

  const n = typeof data === "number" ? data : Number(data);
  if (!Number.isFinite(n)) return { ok: false };

  if (n === -1) return { ok: false, remaining: 0 }; // limit reached
  return { ok: true, remaining: n };
}

/**
 * SINGLE SOURCE OF TRUTH
 * - Ensures monthly reset + row provisioning
 * - Enforces only for FREE users
 * - PREMIUM/TRIAL bypass
 */
export async function decrementCreditIfAllowed(params: {
  supabase: SupabaseClient;
  userId: string;
  feature: string;
}): Promise<{ ok: boolean; remaining?: number; reason?: string }> {
  const { supabase, userId } = params;

  await ensureCreditsFresh({ supabase, userId });

  const planType = await getPlanTypeForUser({ supabase, userId });
  if (planType === "PREMIUM" || planType === "TRIAL") {
    return { ok: true };
  }

  // Prefer atomic RPC (if installed)
  const rpc = await tryConsumeViaRpc({ supabase, userId });
  if (rpc.ok) return { ok: true, remaining: rpc.remaining };
  if (!rpc.notInstalled && rpc.remaining === 0) return { ok: false, reason: "limit_reached" };

  // Fallback (non-atomic): select then update
  const { row, err } = await getCreditsRow({ supabase, userId });
  if (err || !row) return { ok: false, reason: "credits_unavailable" };

  if (row.credits <= 0) return { ok: false, reason: "limit_reached" };

  const remaining = row.credits - 1;

  await supabase
    .from("user_credits")
    .update({ credits: remaining, updated_at: new Date().toISOString() } as any)
    .eq("user_id", userId);

  return { ok: true, remaining };
}
