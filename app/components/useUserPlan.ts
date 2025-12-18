"use client";

import { useCallback, useEffect, useState } from "react";

export type PlanType = "FREE" | "PREMIUM" | "TRIAL" | null;

export interface UserPlanState {
  loading: boolean;
  error: string | null;

  // Legacy compatibility
  plan: PlanType;

  // Canonical field
  planType: PlanType;

  credits: number | null;
  renewalDate: string | null;

  // Derived helpers (required by JournalEntryClient)
  isPremium: boolean;

  // Future-safe (used by some clients)
  refresh: () => void;
}

/**
 * Unified user plan hook.
 * Backwards compatible with all existing consumers.
 */
export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<Omit<UserPlanState, "isPremium" | "refresh">>(
    {
      loading: true,
      error: null,
      plan: null,
      planType: null,
      credits: null,
      renewalDate: null,
    }
  );

  const loadPlan = useCallback(async () => {
    try {
      const res = await fetch("/api/user/plan", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Plan fetch failed");
      }

      const data = await res.json();

      const normalizedPlan: PlanType =
        typeof data.planType === "string"
          ? (data.planType.toUpperCase() as PlanType)
          : typeof data.plan === "string"
          ? (data.plan.toUpperCase() as PlanType)
          : "FREE";

      setState({
        loading: false,
        error: null,
        plan: normalizedPlan,
        planType: normalizedPlan,
        credits: typeof data.credits === "number" ? data.credits : 0,
        renewalDate:
          typeof data.renewalDate === "string" ? data.renewalDate : null,
      });
    } catch (err) {
      console.error("useUserPlan error:", err);

      setState({
        loading: false,
        error: "Unable to load plan information.",
        plan: "FREE",
        planType: "FREE",
        credits: 0,
        renewalDate: null,
      });
    }
  }, []);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const isPremium =
    state.planType === "PREMIUM" || state.planType === "TRIAL";

  return {
    ...state,
    isPremium,
    refresh: loadPlan,
  };
}
