"use client";

import { useCallback, useEffect, useState } from "react";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

type PlanResponse = {
  planType: PlanType;
  plan?: PlanType;
  credits: number;
  renewalDate: string | null;
};

const LS_KEY = "hvn_plan_cache_v1";

function safeParsePlan(raw: string | null): PlanResponse | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as Partial<PlanResponse>;
    const planType =
      (obj.planType || obj.plan || "FREE") as PlanType;
    const credits = typeof obj.credits === "number" ? obj.credits : 0;
    const renewalDate =
      typeof obj.renewalDate === "string" ? obj.renewalDate : null;

    return { planType, plan: planType, credits, renewalDate };
  } catch {
    return null;
  }
}

export function useUserPlan() {
  const [planType, setPlanType] = useState<PlanType>("FREE");
  const [credits, setCredits] = useState<number>(0);
  const [renewalDate, setRenewalDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const applyPlan = useCallback((data: PlanResponse) => {
    const resolvedPlan = (data.planType || data.plan || "FREE") as PlanType;

    setPlanType(resolvedPlan);
    setCredits(typeof data.credits === "number" ? data.credits : 0);
    setRenewalDate(data.renewalDate ?? null);
  }, []);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/user/plan", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        // If offline or server error, fall back to cached plan if available
        const cached = safeParsePlan(
          typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null
        );
        if (cached) {
          applyPlan(cached);
          return;
        }

        setError(`Failed to load plan (${res.status})`);
        return;
      }

      const data: PlanResponse = await res.json();
      const normalized: PlanResponse = {
        planType: (data.planType || data.plan || "FREE") as PlanType,
        plan: (data.planType || data.plan || "FREE") as PlanType,
        credits: typeof data.credits === "number" ? data.credits : 0,
        renewalDate: data.renewalDate ?? null,
      };

      applyPlan(normalized);

      // Persist last-known plan for offline UX
      if (typeof window !== "undefined") {
        localStorage.setItem(LS_KEY, JSON.stringify(normalized));
      }
    } catch (err) {
      // Do not spam console when offline; just use cached plan if possible
      const cached = safeParsePlan(
        typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null
      );
      if (cached) {
        applyPlan(cached);
        return;
      }

      setError("Unable to load plan information");
    } finally {
      setLoading(false);
    }
  }, [applyPlan]);

  useEffect(() => {
    // Hydrate immediately from cache for faster UI + offline
    const cached = safeParsePlan(
      typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null
    );
    if (cached) applyPlan(cached);

    fetchPlan();
  }, [applyPlan, fetchPlan]);

  return {
    // ✅ canonical
    planType,

    // ✅ backward compatibility (DO NOT REMOVE)
    plan: planType,

    credits,
    renewalDate,
    loading,
    error,
    refresh: fetchPlan,
  };
}
