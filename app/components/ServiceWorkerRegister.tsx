"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __havenly_sw_registered?: boolean;
  }
}

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Prevent double registration across mounts/navigation
    if (window.__havenly_sw_registered) return;
    window.__havenly_sw_registered = true;

    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // Intentionally swallow to avoid breaking UI on unsupported browsers
    });
  }, []);

  return null;
}
