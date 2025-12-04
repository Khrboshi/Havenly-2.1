// app/components/useUserPlan.ts
"use client";

import { useEffect, useState } from "react";

export type PlanType = "FREE" | "PREMIUM" | "TRIAL" | null;

interface UserPlanState {
  loading: boolean;
  error: string | null;
  planType: PlanType;
  credits: number | null;
}

export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<UserPlanState>({
    loading: true,
    error: null,
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

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            planType: data.planType ?? "FREE",
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
