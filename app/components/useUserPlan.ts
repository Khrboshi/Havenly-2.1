"use client";

import { useEffect, useState } from "react";

type PlanState = {
  loading: boolean;
  plan: "free" | "premium";
};

let cachedPlan: PlanState | null = null;

export function useUserPlan() {
  const [state, setState] = useState<PlanState>(
    cachedPlan || { loading: true, plan: "free" }
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
          plan: data?.plan === "premium" ? "premium" : "free",
        };

        cachedPlan = next;

        if (!cancelled) setState(next);
      } catch {
        const fallback: PlanState = { loading: false, plan: "free" };
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
