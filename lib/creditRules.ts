// lib/creditRules.ts

import { createServerSupabase } from "@/lib/supabase/server";

export type PlanType = "FREE" | "PREMIUM" | "TRIAL";

export const PLAN_CREDIT_ALLOWANCES: Record<PlanType, number> = {
  FREE: 20,      // Free users: 20 reflections per period
  PREMIUM: 300,  // Premium users
  TRIAL: 300,    // Trial behaves like premium
};

/**
 * Computes the next monthly renewal date.
 * If no renewal date exists, start from today.
 */
export function computeNextRenewalDate(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return next.toISOString();
}

/**
 * Atomically decrements a user's credit if allowed.
 * This is the ONLY place credits are consumed.
 *
 * Returns:
 * - { ok: true, remaining }
 * - { ok: false, reason }
 */
export async function decrementCreditIfAllowed(userId: string): Promise<{
  ok: boolean;
  remaining?: number;
  reason?: string;
}> {
  const supabase = createServerSupabase();

  // Read current plan + credits
  const { data: plan, error } = await supabase
    .from("user_plans")
    .select("plan_type, credits")
    .eq("user_id", userId)
    .single();

  if (error || !plan) {
    return { ok: false, reason: "Unable to verify credits" };
  }

  // Premium & Trial never decrement
  if (plan.plan_type === "PREMIUM" || plan.plan_type === "TRIAL") {
    return { ok: true };
  }

  if (plan.credits <= 0) {
    return { ok: false, reason: "No credits remaining" };
  }

  // Atomic decrement
  const { error: updateError } = await supabase
    .from("user_plans")
    .update({ credits: plan.credits - 1 })
    .eq("user_id", userId)
    .eq("credits", plan.credits); // prevents race conditions

  if (updateError) {
    return { ok: false, reason: "Credit update failed" };
  }

  return {
    ok: true,
    remaining: plan.credits - 1,
  };
}
