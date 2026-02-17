"use client";

import { useEffect } from "react";

export default function DeepLinkBootstrap() {
  useEffect(() => {
    // Handle deep links when app opens from external URL
    const current = window.location.href;

    if (current.includes("/auth/callback")) {
      // Let Next.js handle normally — this ensures PWA resumes correctly
      window.dispatchEvent(new Event("deep-link-opened"));
    }
  }, []);

  return null;
}
