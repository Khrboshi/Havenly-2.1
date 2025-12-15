"use client";

import { useEffect, useState } from "react";

export type PlanType = "FREE" | "PREMIUM" | "TRIAL" | null;

interface UserPlanState {
  loading: boolean;
  error: string | null;

  // Legacy field (backwards compatibility)
  plan: PlanType;

  // Preferred explicit field
  planType: PlanType;

  // Additional fields used by Billing, Premium hub, etc.
  credits: number | null;
  renewalDate: string | null;
}

/**
 * Unified user plan hook.
 * Fetches the current user's plan from /api/user/plan.
 * Normalizes all values into a consistent state object.
 * Fully compatible with existing components and Premium gating.
 */
export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<UserPlanState>({
    loading: true,
    error: null,
    plan: null,
    planType: null,
    credits: null,
    renewalDate: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadPlan() {
      try {
        const res = await fetch("/api/user/plan", {
          cache: "no-store",
        });

        if (!res.ok) {
          if (!cancelled) {
            setState({
              loading: false,
              error: "Unable to load plan information.",
              plan: "FREE",
              planType: "FREE",
              credits: 0,
              renewalDate: null,
            });
          }
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        const serverPlanType: PlanType =
          (typeof data.planType === "string"
            ? (data.planType.toUpperCase() as PlanType)
            : null) ??
          (typeof data.plan === "string"
            ? (data.plan.toUpperCase() as PlanType)
            : null) ??
          "FREE";

        const normalized: PlanType =
          serverPlanType === "PREMIUM" ||
          serverPlanType === "TRIAL" ||
          serverPlanType === "FREE"
            ? serverPlanType
            : "FREE";

        const credits = typeof data.credits === "number" ? data.credits : 0;

        const renewalDate =
          typeof data.renewalDate === "string" ? data.renewalDate : null;

        setState({
          loading: false,
          error: null,
          plan: normalized,
          planType: normalized,
          credits,
          renewalDate,
        });
      } catch (err) {
        console.error("useUserPlan error:", err);
        if (!cancelled) {
          setState({
            loading: false,
            error: "Unable to load plan information.",
            plan: "FREE",
            planType: "FREE",
            credits: 0,
            renewalDate: null,
          });
        }
      }
    }

    loadPlan();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
