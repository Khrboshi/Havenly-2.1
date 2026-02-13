"use client";

import Link from "next/link";
import { useSupabase } from "@/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function TransactionsPage() {
  const { session } = useSupabase();
  const { planType, credits, loading } = useUserPlan();

  const email = session?.user?.email ?? "Unknown user";

  const readablePlan =
    planType === "PREMIUM"
      ? "Premium"
      : planType === "TRIAL"
      ? "Trial"
      : "Free";

  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-slate-200">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Transactions
          </h1>
          <p className="text-slate-400 text-sm">{email}</p>
        </div>

        <Link
          href="/settings"
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          Back
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold mb-2">Subscription</h2>

        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : (
          <p className="text-slate-400">
            Plan: <span className="text-slate-200">{readablePlan}</span>
            {planType !== "PREMIUM" ? (
              <>
                {" "}
                — credits:{" "}
                <span className="text-slate-200">{credits ?? 0}</span>
              </>
            ) : null}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/upgrade"
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400"
          >
            Upgrade
          </Link>

          <Link
            href="/dashboard"
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
