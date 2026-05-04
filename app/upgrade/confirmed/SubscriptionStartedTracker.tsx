/**
 * app/upgrade/confirmed/SubscriptionStartedTracker.tsx
 *
 * Invisible client component — fires the subscription_started PostHog event
 * once when the upgrade/confirmed page mounts.
 *
 * The parent page (page.tsx) is a Server Component, so it cannot call track()
 * directly. This thin wrapper is the standard Next.js pattern for adding
 * client-side side effects to a server-rendered page.
 *
 * Fires exactly once per page load (useEffect with empty deps).
 * No UI rendered — returns null.
 */
"use client";

import { useEffect } from "react";
import { track } from "@/app/components/telemetry";

export default function SubscriptionStartedTracker() {
  useEffect(() => {
    track("subscription_started", { plan: "PREMIUM" });
  }, []);

  return null;
}
