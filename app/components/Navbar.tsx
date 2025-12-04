"use client";

import SiteHeader from "./SiteHeader";
import { useCredits } from "./useCredits";

export default function Navbar() {
  const { loading, error, planType, isPremium, credits } = useCredits();

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
      <SiteHeader />

      {/* Credits / plan bar */}
      <div className="border-t border-slate-800 bg-slate-900/70">
        <div className="mx-auto max-w-6xl px-4 py-1.5 flex items-center justify-end gap-3 text-[11px] text-slate-300">
          {loading ? (
            <span className="text-slate-500">Loading plan…</span>
          ) : error ? (
            <span className="text-red-400">{error}</span>
          ) : !planType ? (
            <span className="text-slate-500">
              Not signed in
            </span>
          ) : isPremium ? (
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-0.5 text-emerald-300">
              Premium · Unlimited access
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-0.5 text-slate-200">
              Plan: {planType} · Credits: {credits ?? 0}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
