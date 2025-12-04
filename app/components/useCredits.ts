"use client";

import { useEffect, useState } from "react";

type CreditsState = {
  loading: boolean;
  error: string | null;
  planType: string | null;
  isPremium: boolean;
  credits: number | "UNLIMITED" | null;
};

export function useCredits() {
  const [state, setState] = useState<CreditsState>({
    loading: true,
    error: null,
    planType: null,
    isPremium: false,
    credits: null,
  });

  async function loadCredits() {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));

      const res = await fetch("/api/user/credits", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        // Not logged in
        setState({
          loading: false,
          error: null,
          planType: null,
          isPremium: false,
          credits: null,
        });
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setState((s) => ({
          ...s,
          loading: false,
          error: data?.error || "Failed to load credits.",
        }));
        return;
      }

      const data = await res.json();

      setState({
        loading: false,
        error: null,
        planType: data.planType || null,
        isPremium: Boolean(data.isPremium),
        credits: data.credits ?? null,
      });
    } catch (err: any) {
      console.error("useCredits error:", err);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Unexpected error while loading credits.",
      }));
    }
  }

  useEffect(() => {
    loadCredits();
  }, []);

  return {
    ...state,
    reloadCredits: loadCredits,
  };
}
