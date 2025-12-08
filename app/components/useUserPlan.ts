// app/components/useUserPlan.ts
"use client";

import { useEffect, useState } from "react";

export type PlanType = "FREE" | "PREMIUM" | "TRIAL" | null;

interface UserPlanState {
  loading: boolean;
  error: string | null;

  // Legacy field (some components read `plan`)
  plan: PlanType;

  // Preferred explicit field
  planType: PlanType;

  // Extra info used by some pages (Billing, Premium hub, etc.)
  credits: number | null;
  renewalDate: string | null;
}

/**
 * Client hook to read the current user's plan from /api/user/plan.
 * Keeps shape compatible with existing pages, but simplifies logic.
 */
export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<UserPlanState>({
    loading: true,
    error: null,
    plan: null,
    planType: null,
    credits: null,
    renewalDate: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchPlan() {
      try {
        const res = await fetch("/api/user/plan", { cache: "no-store" });

        if (!res.ok) {
          if (cancelled) return;
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "Unable to load plan information.",
            plan: "FREE",
            planType: "FREE",
            credits: 0,
            renewalDate: null,
          }));
          return;
        }

        const data = await res.json();

        if (cancelled) return;

        // Defensive parsing: accept different shapes but normalize to our state.
        const serverPlanType =
          (data.planType as PlanType | undefined) ??
          (typeof data.plan === "string"
            ? (data.plan.toUpperCase() as PlanType)
            : null);

        const normalizedPlan: PlanType =
          serverPlanType === "PREMIUM" ||
          serverPlanType === "TRIAL" ||
          serverPlanType === "FREE"
            ? serverPlanType
            : "FREE";

        const credits =
          typeof data.credits === "number" ? data.credits : 0;

        const renewalDate =
          typeof data.renewalDate === "string" ? data.renewalDate : null;

        setState({
          loading: false,
          error: null,
          plan: normalizedPlan,
          planType: normalizedPlan,
          credits,
          renewalDate,
        });
      } catch (err) {
        console.error("useUserPlan error:", err);
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Unable to load plan information.",
          plan: "FREE",
          planType: "FREE",
          credits: 0,
          renewalDate: null,
        }));
      }
    }

    fetchPlan();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
