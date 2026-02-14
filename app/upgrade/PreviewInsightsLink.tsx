"use client";

import Link from "next/link";
import { track } from "@/app/components/telemetry";

export default function PreviewInsightsLink() {
  return (
    <Link
      href="/insights/preview"
      onClick={() => track("upgrade_preview_clicked")}
      className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-900/60"
    >
      Preview Premium insights
    </Link>
  );
}
