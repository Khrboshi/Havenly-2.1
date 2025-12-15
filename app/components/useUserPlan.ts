"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type PlanType = "FREE" | "PREMIUM" | "TRIAL" | null;

interface UserPlanState {
  loading: boolean;
  error: string | null;

  // Legacy field (backwards compatibility)
  plan: PlanType;

  // Preferred explicit field
  planType: PlanType;

  // Monetization fields
  credits: number | null;
  renewalDate: string | null;

  // Helpers
  isPremium: boolean;
  refresh: () => Promise<void>;
}

/**
 * Unified user plan hook.
 * Backwards compatible + monetization-safe.
 */
export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<Omit<UserPlanState, "isPremium" | "refresh">>({
    loading: true,
    error: null,
    plan: null,
    planType: null,
    credits: null,
    renewalDate: null,
  });

  const loadPlan = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true }));

      const res = await fetch("/api/user/premium", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Plan fetch failed");
      }

      const data = await res.json();

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

      setState({
        loading: false,
        error: null,
        plan: normalized,
        planType: normalized,
        credits: typeof data.credits === "number" ? data.credits : 0,
        renewalDate: typeof data.renewalDate === "string" ? data.renewalDate : null,
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
    let cancelled = false;
    if (!cancelled) loadPlan();
    return () => {
      cancelled = true;
    };
  }, [loadPlan]);

  const isPremium = useMemo(
    () => state.planType === "PREMIUM",
    [state.planType]
  );

  return {
    ...state,
    isPremium,
    refresh: loadPlan,
  };
}
