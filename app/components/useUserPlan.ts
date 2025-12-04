// app/components/useUserPlan.ts
"use client";

import { useEffect, useState } from "react";

export type PlanType = "FREE" | "PREMIUM" | "TRIAL" | null;

interface UserPlanState {
  loading: boolean;
  error: string | null;

  // legacy compatibility
  plan: PlanType;

  // new improved value
  planType: PlanType;

  credits: number | null;
}

export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<UserPlanState>({
    loading: true,
    error: null,
    plan: null,
    planType: null,
    credits: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchPlan() {
      try {
        const res = await fetch("/api/user/credits", {
          method: "GET",
        });

        if (res.status === 401) {
          if (!cancelled) {
            setState({
              loading: false,
              error: null,
              plan: "FREE",
              planType: "FREE",
              credits: null,
            });
          }
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load plan info");
        }

        const data = await res.json();
        const planValue: PlanType = data.planType ?? "FREE";

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            plan: planValue,        // legacy field
            planType: planValue,    // new field
            credits:
              typeof data.credits === "number" ? data.credits : null,
          });
        }
      } catch (err) {
        console.error("useUserPlan error:", err);

        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "Could not load plan info",
            plan: "FREE",
            planType: "FREE",
          }));
        }
      }
    }

    fetchPlan();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
