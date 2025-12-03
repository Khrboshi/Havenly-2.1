"use client";

import { useEffect } from "react";

export default function SessionHeartbeat() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/auth/refresh").catch(() => {});
    }, 30000); // 30 sec

    return () => clearInterval(interval);
  }, []);

  return null;
}
