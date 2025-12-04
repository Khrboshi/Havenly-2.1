// app/components/useCredits.ts
"use client";

import { useState } from "react";

interface UseCreditsResult {
  using: boolean;
  lastError: string | null;
  lastSuccessMessage: string | null;
  useCredits: (opts: {
    amount: number;
    feature?: string;
    description?: string;
  }) => Promise<{
    success: boolean;
    credits?: number;
    error?: string;
    message?: string;
  }>;
}

export function useCredits(): UseCreditsResult {
  const [using, setUsing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSuccessMessage, setLastSuccessMessage] =
    useState<string | null>(null);

  async function useCredits(opts: {
    amount: number;
    feature?: string;
    description?: string;
  }) {
    setUsing(true);
    setLastError(null);
    setLastSuccessMessage(null);

    try {
      const res = await fetch("/api/user/credits/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(opts),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg =
          data?.message ||
          data?.error ||
          "Failed to use credits. Please try again.";
        setLastError(errMsg);
        return {
          success: false,
          error: errMsg,
          credits: data?.credits,
        };
      }

      if (typeof data.message === "string") {
        setLastSuccessMessage(data.message);
      }

      return {
        success: true,
        credits: data?.credits,
        message: data?.message,
      };
    } catch (err) {
      console.error("useCredits hook error:", err);
      const fallback =
        "Unexpected error while using credits. Please try again.";
      setLastError(fallback);
      return { success: false, error: fallback };
    } finally {
      setUsing(false);
    }
  }

  return { using, lastError, lastSuccessMessage, useCredits };
}
