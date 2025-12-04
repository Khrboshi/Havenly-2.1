// app/components/useUserPlan.ts
"use client";

import { useEffect, useState } from "react";

export type PlanType = "FREE" | "PREMIUM" | "TRIAL" | null;

interface UserPlanState {
  loading: boolean;
  error: string | null;

  // Legacy fields required by older pages
  plan: PlanType;

  // New field used by updated layout/pages
  planType: PlanType;

  credits: number | null;

  // Required by premium/page.tsx
  renewalDate: string | null;
}

export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<UserPlanState>({
    loading: true,
    error: null,
    plan: null,
    planType: null,
    credits: null,
    renewalDate: null, // added default
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchPlan() {
      try {
        const res = await fetch("/api/user/credits", { method: "GET" });

        // Not logged in → treat as FREE
        if (res.status === 401) {
          if (!cancelled) {
            setState({
              loading: false,
              error: null,
              plan: "FREE",
              planType: "FREE",
              credits: 0,
              renewalDate: null,
            });
          }
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load plan info");
        }

        const data = await res.json();

        const planValue: PlanType = data.planType ?? "FREE";
        const renewal =
          typeof data.renewalDate === "string" ? data.renewalDate : null;

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            plan: planValue,
            planType: planValue,
            credits:
              typeof data.credits === "number" ? data.credits : 0,
            renewalDate: renewal,
          });
        }
      } catch (err) {
        console.error("useUserPlan error:", err);

        if (!cancelled) {
          setState({
            loading: false,
            error: "Could not load plan info",
            plan: "FREE",
            planType: "FREE",
            credits: 0,
            renewalDate: null,
          });
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
