/**
 * Central credit rules for all plans.
 * This is the SINGLE source of truth.
 */

export type PlanType = "FREE" | "TRIAL" | "PREMIUM";

export const CreditRules = {
  FREE: {
    monthly: 3,
    unlimited: false,
  },
  TRIAL: {
    monthly: 10,
    unlimited: false,
  },
  PREMIUM: {
    monthly: Infinity,
    unlimited: true,
  },
} as const;

/**
 * Utility: get starting credits for a plan
 */
export function creditsForPlan(plan: PlanType): number {
  if (plan === "PREMIUM") return 9999;
  return CreditRules[plan].monthly;
}
