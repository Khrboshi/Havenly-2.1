"use client";

import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
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
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Transactions
      </h1>
      <p className="text-sm text-slate-400 mb-8">
        A simple overview of your current plan and credits. A more detailed
        transaction history view will be added here later, but nothing is
        blocked or required for you to keep using Havenly today.
      </p>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Account
            </p>
            <p className="text-sm font-semibold text-slate-100 truncate">
              {email}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {loading ? "Checking plan..." : `${readablePlan} plan`}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-950/40 p-3">
            <p className="text-xs text-slate-400 mb-1">Plan</p>
            <p className="text-sm font-semibold text-slate-100">
              {readablePlan}
            </p>
          </div>
          <div className="rounded-xl bg-slate-950/40 p-3">
            <p className="text-xs text-slate-400 mb-1">Available credits</p>
            <p className="text-sm font-semibold text-slate-100">
              {typeof credits === "number" ? credits : "—"}
            </p>
          </div>
          <div className="rounded-xl bg-slate-950/40 p-3">
            <p className="text-xs text-slate-400 mb-1">Status</p>
            <p className="text-sm font-semibold text-slate-100">
              {loading ? "Loading..." : "Active"}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          When a full transaction ledger is introduced, it will appear here –
          including upgrades, renewals, and credit usage – so you can always
          see how your Premium benefits are being applied.
        </p>
      </section>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Link
          href="/settings/billing"
          className="text-sm text-emerald-300 hover:text-emerald-200"
        >
          ← Back to Billing
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-slate-300 hover:text-white"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
