"use client";

import { useEffect } from "react";

type Props = {
  source?: string;
};

const SESSION_KEY = "hvn_upgrade_intent_sent_v2";

export default function UpgradeIntentTracker({ source }: Props) {
  useEffect(() => {
    const src = source || "unknown";
    const path =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : "";

    const key = `${SESSION_KEY}:${src}:${path}`;

    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(key)) return;
      if (typeof window !== "undefined") sessionStorage.setItem(key, "1");
    } catch {
      // ignore storage failures
    }

    fetch("/api/telemetry/upgrade-intent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ source: src, path }),
    }).catch(() => {});
  }, [source]);

  return null;
}
