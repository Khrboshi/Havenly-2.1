"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useUserPlan } from "@/app/components/useUserPlan";

interface RequirePremiumProps {
  children: ReactNode;
}

export default function RequirePremium({ children }: RequirePremiumProps) {
  const { loading, planType } = useUserPlan();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span>Checking your plan…</span>
        </div>
      </div>
    );
  }

  const isPremium = planType === "PREMIUM" || planType === "TRIAL";

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
          <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Premium feature
          </span>

          <h1 className="mt-4 text-2xl font-semibold">
            This space is part of Havenly Premium.
          </h1>

          <p className="mt-3 text-sm text-slate-200">
            Premium gives you deeper reflections, timelines, and a higher credit balance.
            No pressure to upgrade — move at your own pace.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-slate-100">
            <li className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              <span>Deeper AI reflections.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              <span>Timelines and recurring themes.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              <span>Higher monthly credit balance.</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/upgrade"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Explore Premium
            </Link>
            <Link
              href="/journal"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
            >
              Continue journaling free
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Your writing remains private and never used for advertising.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
