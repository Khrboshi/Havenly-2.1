// lib/creditRules.ts
import { SupabaseClient } from "@supabase/supabase-js";

const FREE_MONTHLY_CREDITS = 3;
const TRIAL_MONTHLY_CREDITS = 10;

export type PlanType = "FREE" | "TRIAL" | "PREMIUM";

type CreditsRow = {
  user_id: string;
  plan_type: PlanType;
  credits: number;
  updated_at: string | null;
};

function normalizePlan(v: unknown): PlanType {
  const p = String(v ?? "FREE").toUpperCase();
  if (p === "PREMIUM" || p === "TRIAL") return p as PlanType;
  return "FREE";
}

function isSameUtcMonth(aIso: string, b: Date) {
  const a = new Date(aIso);
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth()
  );
}

async function getCreditsRow(params: {
  supabase: SupabaseClient;
  userId: string;
}): Promise<{ row: CreditsRow | null; err: any | null }> {
  const { supabase, userId } = params;

  const { data, error } = await supabase
    .from("user_credits")
    .select("user_id, plan_type, credits, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { row: null, err: error };
  if (!data) return { row: null, err: null };

  const r: any = data;

  return {
    row: {
      user_id: String(r.user_id),
      plan_type: normalizePlan(r.plan_type),
      credits: typeof r.credits === "number" ? r.credits : 0,
      updated_at: typeof r.updated_at === "string" ? r.updated_at : null,
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
      plan_type: "FREE",
      credits: FREE_MONTHLY_CREDITS,
      updated_at: nowIso,
    } as any,
    { onConflict: "user_id" }
  );
}

/**
 * ✅ Monthly reset using ONLY updated_at (UTC month).
 * - FREE: if updated_at is missing or from a previous UTC month => reset to 3.
 * - TRIAL/PREMIUM: credits are not enforced here.
 *
 * SAFE to call multiple times.
 */
export async function ensureCreditsFresh(params: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = params;

  await ensureCreditRowExists({ supabase, userId });

  const { row, err } = await getCreditsRow({ supabase, userId });
  if (err || !row) return;

  if (row.plan_type === "PREMIUM" || row.plan_type === "TRIAL") return;

  const now = new Date();

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
 * SINGLE SOURCE OF TRUTH:
 * - Ensures monthly reset + row provisioning
 * - Enforces only for FREE users
 * - TRIAL/PREMIUM bypass
 */
export async function decrementCreditIfAllowed(params: {
  supabase: SupabaseClient;
  userId: string;
  feature: string;
}): Promise<{ ok: boolean; remaining?: number; reason?: string }> {
  const { supabase, userId } = params;

  await ensureCreditsFresh({ supabase, userId });

  const { row, err } = await getCreditsRow({ supabase, userId });
  if (err || !row) return { ok: false, reason: "credits_unavailable" };

  if (row.plan_type === "PREMIUM" || row.plan_type === "TRIAL") {
    return { ok: true };
  }

  if (row.credits <= 0) return { ok: false, reason: "limit_reached" };

  const remaining = row.credits - 1;

  await supabase
    .from("user_credits")
    .update({ credits: remaining, updated_at: new Date().toISOString() } as any)
    .eq("user_id", userId);

  return { ok: true, remaining };
}

/**
 * Helper for plan updates (billing page).
 * Keeps logic centralized and schema-consistent.
 */
export async function setUserPlan(params: {
  supabase: SupabaseClient;
  userId: string;
  planType: PlanType;
}) {
  const { supabase, userId, planType } = params;

  const nowIso = new Date().toISOString();

  const credits =
    planType === "PREMIUM"
      ? 9999
      : planType === "TRIAL"
      ? TRIAL_MONTHLY_CREDITS
      : FREE_MONTHLY_CREDITS;

  await supabase.from("user_credits").upsert(
    {
      user_id: userId,
      plan_type: planType,
      credits,
      updated_at: nowIso,
    } as any,
    { onConflict: "user_id" }
  );
}
