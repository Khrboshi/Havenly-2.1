"use client";

import { useEffect, useState, useCallback } from "react";

type PlanType = "FREE" | "PREMIUM" | "TRIAL";

type PlanStateInternal = {
  loading: boolean;
  planType: PlanType;
  credits: number;
};

type PlanState = PlanStateInternal & {
  plan: "free" | "premium" | "trial";
  refresh: () => Promise<void>;
};

let cachedData: PlanStateInternal | null = null;

export function useUserPlan(): PlanState {
  const [state, setState] = useState<PlanStateInternal>(
    cachedData || {
      loading: true,
      planType: "FREE",
      credits: 0,
    }
  );

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/user/plan", {
        credentials: "include",
      });

      const data = await res.json();

      const normalizedPlan: PlanType =
        data?.plan === "premium"
          ? "PREMIUM"
          : data?.plan === "trial"
          ? "TRIAL"
          : "FREE";

      const next: PlanStateInternal = {
        loading: false,
        planType: normalizedPlan,
        credits: typeof data?.credits === "number" ? data.credits : 0,
      };

      cachedData = next;
      setState(next);
    } catch {
      const fallback: PlanStateInternal = {
        loading: false,
        planType: "FREE",
        credits: 0,
      };

      cachedData = fallback;
      setState(fallback);
    }
  }, []);

  useEffect(() => {
    if (cachedData) return;
    load();
  }, [load]);

  const lowercasePlan =
    state.planType === "PREMIUM"
      ? "premium"
      : state.planType === "TRIAL"
      ? "trial"
      : "free";

  return {
    ...state,
    plan: lowercasePlan,
    refresh: load,
  };
}
