"use client";

import { useEffect, useState } from "react";

type PlanState = {
  loading: boolean;
  planType: "free" | "premium";
  credits: number;
};

let cachedPlan: PlanState | null = null;

export function useUserPlan() {
  const [state, setState] = useState<PlanState>(
    cachedPlan || {
      loading: true,
      planType: "free",
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

        const next: PlanState = {
          loading: false,
          planType: data?.plan === "premium" ? "premium" : "free",
          credits: typeof data?.credits === "number" ? data.credits : 0,
        };

        cachedPlan = next;

        if (!cancelled) setState(next);
      } catch {
        const fallback: PlanState = {
          loading: false,
          planType: "free",
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
