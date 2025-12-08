"use client";

import { useEffect, useState } from "react";
import { useSupabaseSession } from "../components/SupabaseSessionProvider";

/**
 * Minimal, safe fallback hook for displaying the user’s plan.
 * If your database has a `user_plans` table, this hook will read from it.
 * If not, it gracefully defaults to "free".
 */

export function useUserPlan() {
  const session = useSupabaseSession();
  const [plan, setPlan] = useState<"free" | "premium">("free");

  useEffect(() => {
    async function loadPlan() {
      if (!session?.user) {
        setPlan("free");
        return;
      }

      // Try reading from the database (optional enhancement)
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
        // ignore — fallback
      }

      // Fallback for now until premium is implemented:
      setPlan("free");
    }

    loadPlan();
  }, [session]);

  return { plan };
}
