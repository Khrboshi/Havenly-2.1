// app/upgrade/page.tsx
"use client";

import Link from "next/link";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function UpgradePage() {
  const { planType } = useUserPlan();

  return (
    <div className="min-h-screen px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-4">Upgrade Your Experience</h1>

      <p className="text-white/70 max-w-xl mb-8">
        Unlock deeper insights, advanced tools, unlimited reflections, and
        richer mental-wellbeing support with Havenly Premium.
      </p>

      <div className="rounded-xl border border-white/10 p-6 bg-slate-900/50 backdrop-blur max-w-md">
        <h2 className="text-xl font-semibold mb-4">Premium Plan</h2>
        <p className="text-white/70 mb-4">
          Upgrade now to unlock all Premium features.
        </p>

        <Link
          href="/api/user/plan/update?plan=premium"
          className="block w-full px-4 py-3 rounded-full bg-emerald-500 text-slate-950 font-semibold text-center hover:bg-emerald-400"
        >
          Upgrade to Premium
        </Link>

        {planType !== "FREE" && (
          <p className="text-emerald-400 mt-4 text-sm">
            You already have an active plan.
          </p>
        )}
      </div>
    </div>
  );
}
