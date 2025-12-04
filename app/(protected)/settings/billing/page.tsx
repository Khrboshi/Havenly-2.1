"use client";

import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function BillingPage() {
  const { session } = useSupabase();
  const { plan, credits } = useUserPlan();

  const userEmail = session?.user?.email ?? "Unknown user";
  const planLabel = plan ?? "free";

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-slate-950">
      <h1 className="text-3xl font-bold mb-6">Billing & Plan</h1>

      {/* User info */}
      <div className="mb-8 rounded-xl border border-white/10 bg-slate-900/60 p-6">
        <p className="text-sm text-white/70">
          Signed in as:{" "}
          <span className="font-semibold text-white">{userEmail}</span>
        </p>
        <p className="mt-2 text-sm text-white/70">
          Current plan:{" "}
          <span className="font-semibold text-emerald-300">
            {planLabel.toUpperCase()}
          </span>
        </p>
        <p className="mt-1 text-sm text-white/70">
          Credits:{" "}
          <span className="font-semibold text-emerald-300">
            {credits ?? 0}
          </span>
        </p>
      </div>

      {/* Plan management */}
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold mb-3">Manage Plan</h2>
          <p className="text-sm text-white/70 mb-4">
            Upgrade or manage your subscription to unlock deeper AI reflections,
            emotional patterns, and advanced wellbeing tools.
          </p>

          <Link
            href="/upgrade"
            className="inline-block rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Go to Upgrade Page
          </Link>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold mb-3">Billing History</h2>
          <p className="text-sm text-white/70">
            Billing history and invoices will be added soon.
          </p>
        </div>
      </div>
    </div>
  );
}
