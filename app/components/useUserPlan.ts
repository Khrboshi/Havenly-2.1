"use client";

import { useEffect, useState, useCallback } from "react";

export type PlanType = "FREE" | "ESSENTIAL" | "PREMIUM";

export interface UserPlanState {
  loading: boolean;
  authenticated: boolean;
  planType: PlanType;
  plan: "free" | "essential" | "premium";
  premium: boolean;
  essential: boolean;
  credits: number;
  renewalDate: string | null;
  error?: string;
}

/**
 * Reads the user's plan + credits from /api/user/plan.
 * Always falls back to a FREE plan so the UI never breaks.
 */
export function useUserPlan(): UserPlanState & { refresh: () => Promise<void> } {
  const [state, setState] = useState<UserPlanState>({
    loading: true,
    authenticated: false,
    planType: "FREE",
    plan: "free",
    premium: false,
    essential: false,
    credits: 0,
    renewalDate: null,
  });

  const load = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const res = await fetch("/api/user/plan", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      setState({
        loading: false,
        authenticated: Boolean(data.authenticated),
        planType: (data.planType as PlanType) || "FREE",
        plan: (data.plan as "free" | "essential" | "premium") || "free",
        premium: Boolean(data.premium),
        essential: Boolean(data.essential),
        credits: Number.isFinite(data.credits) ? Number(data.credits) : 0,
        renewalDate: data.renewalDate ?? null,
      });
    } catch (err) {
      console.error("useUserPlan error:", err);
      setState({
        loading: false,
        authenticated: false,
        planType: "FREE",
        plan: "free",
        premium: false,
        essential: false,
        credits: 0,
        renewalDate: null,
        error: "Unable to load plan information.",
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  return { ...state, refresh };
}
