"use client";

import { useEffect } from "react";

type Props = {
  source?: string;
};

const SESSION_KEY = "hvn_upgrade_intent_sent_v1";

export default function UpgradeIntentTracker({ source }: Props) {
  useEffect(() => {
    const key = `${SESSION_KEY}:${source || "unknown"}`;

    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(key)) return;
      if (typeof window !== "undefined") sessionStorage.setItem(key, "1");
    } catch {
      // ignore storage failures
    }

    fetch("/api/telemetry/upgrade-intent", { method: "POST" }).catch(() => {});
  }, [source]);

  return null;
}
