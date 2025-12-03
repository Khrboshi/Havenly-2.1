// app/components/auth/SessionHeartbeat.tsx
"use client";

import { useEffect } from "react";

export default function SessionHeartbeat() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/auth/refresh").catch(() => {});
    }, 30_000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}
