// lib/creditRules.ts

import { SupabaseClient } from "@supabase/supabase-js";

export type PlanType = "FREE" | "PREMIUM" | "TRIAL";

export const PLAN_CREDIT_ALLOWANCES: Record<PlanType, number> = {
  FREE: 20,
  PREMIUM: 300,
  TRIAL: 300,
};

/**
 * Computes the next monthly renewal date.
 */
export function computeNextRenewalDate(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return next.toISOString();
}

/**
 * 🔒 SINGLE SOURCE OF TRUTH — CREDIT ENFORCEMENT
 *
 * Called ONLY from server routes.
 * Client never decides credit usage.
 */
export async function decrementCreditIfAllowed({
  supabase,
  userId,
  feature,
}: {
  supabase: SupabaseClient;
  userId: string;
  feature: "ai_reflection";
}): Promise<{
  ok: boolean;
  remaining?: number;
  reason?: string;
}> {
  // Load user plan
  const { data: plan, error } = await supabase
    .from("user_plans")
    .select("plan_type, credits")
    .eq("user_id", userId)
    .single();

  if (error || !plan) {
    return { ok: false, reason: "Unable to verify credits" };
  }

  // Premium / Trial = unlimited
  if (plan.plan_type === "PREMIUM" || plan.plan_type === "TRIAL") {
    return { ok: true };
  }

  // Free plan enforcement
  if (plan.credits <= 0) {
    return { ok: false, reason: "No credits remaining" };
  }

  // Atomic decrement (race-safe)
  const { error: updateError } = await supabase
    .from("user_plans")
    .update({ credits: plan.credits - 1 })
    .eq("user_id", userId)
    .eq("credits", plan.credits);

  if (updateError) {
    return { ok: false, reason: "Credit update failed" };
  }

  return {
    ok: true,
    remaining: plan.credits - 1,
  };
}
