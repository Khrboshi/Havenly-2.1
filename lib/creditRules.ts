// lib/creditRules.ts

export type PlanType = "FREE" | "PREMIUM" | "TRIAL";

export const PLAN_CREDIT_ALLOWANCES: Record<PlanType, number> = {
  FREE: 20,          // Free users: 20 reflections/month
  PREMIUM: 300,      // Premium users: high allowance
  TRIAL: 300,        // Trial behaves same as premium
};

/**
 * Computes the next monthly renewal date based on the user’s current renewal date.
 * If no renewal date exists, the reset starts today.
 */
export function computeNextRenewalDate(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return next.toISOString();
}
