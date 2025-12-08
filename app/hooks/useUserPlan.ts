"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "../components/SupabaseSessionProvider";

/**
 * Minimal, safe fallback hook for displaying the user’s plan.
 * If your backend exposes /api/user/plan, it will read from there.
 * Otherwise, it gracefully defaults to "free".
 */
export function useUserPlan() {
  const { session } = useSupabase();
  const [plan, setPlan] = useState<"free" | "premium">("free");

  useEffect(() => {
    async function loadPlan() {
      if (!session?.user) {
        setPlan("free");
        return;
      }

      try {
        const res = await fetch("/api/user/plan", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.plan === "premium") {
            setPlan("premium");
            return;
          }
        }
      } catch {
        // Ignore errors, fallback to free
      }

      setPlan("free");
    }

    loadPlan();
  }, [session]);

  return { plan };
}
