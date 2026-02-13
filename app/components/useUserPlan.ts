"use client";

import { useEffect, useState } from "react";

type PlanType = "FREE" | "PREMIUM" | "TRIAL";

type PlanState = {
  loading: boolean;
  planType: PlanType;
  credits: number;
};

let cachedPlan: PlanState | null = null;

export function useUserPlan() {
  const [state, setState] = useState<PlanState>(
    cachedPlan || {
      loading: true,
      planType: "FREE",
      credits: 0,
    }
  );

  useEffect(() => {
    if (cachedPlan) return;

    let cancelled = false;

    async function load() {
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

        const next: PlanState = {
          loading: false,
          planType: normalizedPlan,
          credits: typeof data?.credits === "number" ? data.credits : 0,
        };

        cachedPlan = next;

        if (!cancelled) setState(next);
      } catch {
        const fallback: PlanState = {
          loading: false,
          planType: "FREE",
          credits: 0,
        };

        cachedPlan = fallback;
        if (!cancelled) setState(fallback);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
