"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  source?: string;
};

const SESSION_KEY = "hvn_upgrade_intent_sent_v1";

export default function UpgradeIntentTracker({ source }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams?.get("from") || source || "unknown";
    const key = `${SESSION_KEY}:${from}:${pathname}`;

    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(key)) return;
      if (typeof window !== "undefined") sessionStorage.setItem(key, "1");
    } catch {
      // ignore storage failures
    }

    fetch("/api/telemetry/upgrade-intent", { method: "POST" }).catch(() => {});
  }, [pathname, searchParams, source]);

  return null;
}
