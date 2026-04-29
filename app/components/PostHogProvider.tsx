"use client";

/**
 * app/components/PostHogProvider.tsx
 *
 * Initialises PostHog analytics on the client.
 * No-ops silently if NEXT_PUBLIC_POSTHOG_KEY is not set (safe for local dev).
 * Uses localStorage persistence so queued events survive client-side navigation.
 * Autocapture is disabled to respect user privacy — only explicit track() calls fire.
 */
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// Tracks page views on client-side navigation
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;
    let url = window.origin + pathname;
    if (searchParams?.toString()) url += `?${searchParams.toString()}`;
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}

// Initialise PostHog once on the client
function PostHogInit() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
    if (!key) return; // silently no-op if key not set (local dev without env var)

    posthog.init(key, {
      api_host: host,
      person_profiles: "always",
      capture_pageview: false,            // we handle pageviews manually above
      capture_pageleave: true,
      autocapture: false,                 // privacy: no automatic click tracking
      persistence: "localStorage",       // survives client-side navigation; stores only anon ID, no PII
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
  }, []);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogInit />
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
