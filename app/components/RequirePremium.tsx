// app/components/RequirePremium.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useUserPlan } from "./useUserPlan";

interface RequirePremiumProps {
  children: ReactNode;
}

export default function RequirePremium({ children }: RequirePremiumProps) {
  const { loading, planType } = useUserPlan();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-950 text-slate-200">
        <p className="text-sm text-slate-300">Checking your plan…</p>
      </div>
    );
  }

  if (!planType || planType === "FREE") {
    return (
      <div className="min-h-[60vh] bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-xl">
          <h1 className="text-xl font-semibold mb-2">
            Premium tools need a Premium plan
          </h1>
          <p className="text-sm text-slate-300 mb-5">
            Advanced tools like mood breakdown and AI suggestions are part of{" "}
            <span className="font-medium text-emerald-300">
              Havenly Premium
            </span>
            . Upgrade to unlock them, or keep using the free journal anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/upgrade"
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              See Premium benefits
            </Link>
            <Link
              href="/journal"
              className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              Continue journaling free
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
