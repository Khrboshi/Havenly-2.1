"use client";

import { useEffect } from "react";
import { track } from "@/app/components/telemetry";

export default function UpgradeIntentTracker({ source }: { source: string }) {
  useEffect(() => {
    // Fires once on page mount
    track("upgrade_page_viewed", { source });
  }, [source]);

  // DOM marker so we can confirm it mounted via Elements search
  return (
    <span
      data-telemetry="upgrade-page"
      data-source={source}
      style={{ display: "none" }}
    />
  );
}
