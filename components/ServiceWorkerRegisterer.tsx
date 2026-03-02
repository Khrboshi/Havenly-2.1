"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegisterer() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
      } catch {
        // silent
      }
    };

    window.requestAnimationFrame(() => register());
  }, []);

  return null;
}
