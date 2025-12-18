"use client";

import { useCallback, useEffect, useState } from "react";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

type PlanResponse = {
  planType: PlanType;
  plan?: PlanType; // backward compatibility
  credits: number;
  renewalDate: string | null;
};

export function useUserPlan() {
  const [planType, setPlanType] = useState<PlanType>("FREE");
  const [credits, setCredits] = useState<number>(0);
  const [renewalDate, setRenewalDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/user/plan", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Failed to fetch plan:", res.status);
        return;
      }

      const data: PlanResponse = await res.json();

      setPlanType(data.planType || data.plan || "FREE");
      setCredits(typeof data.credits === "number" ? data.credits : 0);
      setRenewalDate(data.renewalDate ?? null);
    } catch (err) {
      console.error("useUserPlan error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return {
    planType,
    credits,
    renewalDate,
    loading,
    refresh: fetchPlan,
  };
}
