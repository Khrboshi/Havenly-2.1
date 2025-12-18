// lib/creditRules.ts
import { SupabaseClient } from "@supabase/supabase-js";

const FREE_MONTHLY_CREDITS = 3;
const TRIAL_CREDITS = 10;

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

type CreditsRow = {
  plan_type: PlanType;
  credits_remaining: number;
  updated_at: string | null;
};

async function getCreditsRow(params: {
  supabase: SupabaseClient;
  userId: string;
}): Promise<CreditsRow | null> {
  const { supabase, userId } = params;

  const { data, error } = await supabase
    .from("user_credits")
    .select("plan_type, credits_remaining, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    plan_type: data.plan_type ?? "FREE",
    credits_remaining:
      typeof data.credits_remaining === "number"
        ? data.credits_remaining
        : 0,
    updated_at: data.updated_at ?? null,
  };
}

async function ensureCreditRowExists(params: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = params;

  const row = await getCreditsRow({ supabase, userId });
  if (row) return;

  const now = new Date().toISOString();

  await supabase.from("user_credits").upsert(
    {
      user_id: userId,
      plan_type: "FREE",
      credits_remaining: FREE_MONTHLY_CREDITS,
      updated_at: now,
    },
    { onConflict: "user_id" }
  );
}

function isSameUtcMonth(aIso: string, now: Date) {
  const a = new Date(aIso);
  return (
    a.getUTCFullYear() === now.getUTCFullYear() &&
    a.getUTCMonth() === now.getUTCMonth()
  );
}

/**
 * Monthly reset (FREE + TRIAL only)
 */
async function ensureCreditsFresh(params: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = params;

  await ensureCreditRowExists({ supabase, userId });

  const row = await getCreditsRow({ supabase, userId });
  if (!row) return;

  if (row.plan_type === "PREMIUM") return;

  const now = new Date();

  if (!row.updated_at || !isSameUtcMonth(row.updated_at, now)) {
    const reset =
      row.plan_type === "TRIAL"
        ? TRIAL_CREDITS
        : FREE_MONTHLY_CREDITS;

    await supabase
      .from("user_credits")
      .update({
        credits_remaining: reset,
        updated_at: now.toISOString(),
      })
      .eq("user_id", userId);
  }
}

/**
 * Optional atomic RPC
 */
async function tryConsumeViaRpc(params: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = params;

  const { data, error } = await supabase.rpc(
    "consume_free_credit",
    { uid: userId }
  );

  if (error) return null;

  return typeof data === "number" ? data : null;
}

/**
 * 🔒 SINGLE SOURCE OF TRUTH
 */
export async function decrementCreditIfAllowed(params: {
  supabase: SupabaseClient;
  userId: string;
  feature: string;
}): Promise<{ ok: boolean; remaining?: number; reason?: string }> {
  const { supabase, userId } = params;

  await ensureCreditsFresh({ supabase, userId });

  const row = await getCreditsRow({ supabase, userId });
  if (!row) return { ok: false, reason: "credits_unavailable" };

  if (row.plan_type === "PREMIUM") {
    return { ok: true };
  }

  // Try atomic RPC first
  const rpcRemaining = await tryConsumeViaRpc({ supabase, userId });
  if (typeof rpcRemaining === "number") {
    if (rpcRemaining < 0) return { ok: false, reason: "limit_reached" };
    return { ok: true, remaining: rpcRemaining };
  }

  // Fallback decrement
  if (row.credits_remaining <= 0) {
    return { ok: false, reason: "limit_reached" };
  }

  const remaining = row.credits_remaining - 1;

  await supabase
    .from("user_credits")
    .update({
      credits_remaining: remaining,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  return { ok: true, remaining };
}
