"use client";

import { useEffect, useState, useCallback } from "react";

type PlanType = "FREE" | "PREMIUM" | "TRIAL";

type PlanState = {
  loading: boolean;
  planType: PlanType;
  credits: number;
  refresh: () => Promise<void>;
};

let cachedData: Omit<PlanState, "refresh"> | null = null;

export function useUserPlan(): PlanState {
  const [state, setState] = useState<Omit<PlanState, "refresh">>(
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

      const next = {
        loading: false,
        planType: normalizedPlan,
        credits: typeof data?.credits === "number" ? data.credits : 0,
      };

      cachedData = next;
      setState(next);
    } catch {
      const fallback = {
        loading: false,
        planType: "FREE" as PlanType,
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

  return {
    ...state,
    refresh: load,
  };
}
