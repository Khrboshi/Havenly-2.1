// app/components/Navbar.tsx
"use client";

import SiteHeader from "./SiteHeader";
import { useUserPlan } from "./useUserPlan";

export default function Navbar() {
  const { loading, planType, credits } = useUserPlan();

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
      {/* Main nav (logo + links + Upgrade button) */}
      <SiteHeader />

      {/* Slim status bar under the main header */}
      <div className="border-t border-slate-800/70 bg-slate-950/80 text-[11px] text-slate-400 px-4 sm:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {loading ? (
            <span>Checking account…</span>
          ) : planType ? (
            <>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {planType === "PREMIUM" ? "Premium plan" : "Free plan"}
              </span>
              {typeof credits === "number" && (
                <span className="text-slate-300">
                  · Credits: <span className="font-medium">{credits}</span>
                </span>
              )}
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              <span>Not signed in</span>
            </>
          )}
        </div>

        <div className="hidden sm:block">
          <span className="text-slate-500">
            Havenly 2.1 · Calm, private journaling with gentle AI reflections
          </span>
        </div>
      </div>
    </header>
  );
}
