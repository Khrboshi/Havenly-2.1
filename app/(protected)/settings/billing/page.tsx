"use client";

import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function BillingPage() {
  const { session } = useSupabase();
  const { plan, credits } = useUserPlan();

  const planLabel = plan ?? "free";
  const userEmail = session?.user?.email || "Unknown user";

  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-slate-200">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Billing</h1>
      <p className="text-slate-400 mb-10">
        Manage your plan, payments, and invoices.
      </p>

      {/* CURRENT PLAN */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">
          Current plan
        </h2>

        <div className="text-sm space-y-2 text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Plan</span>
            <span className="font-medium capitalize">{planLabel}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Credits</span>
            <span className="font-medium">{credits ?? 0}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Billing email</span>
            <span className="font-medium">{userEmail}</span>
          </div>
        </div>

        <div className="mt-6">
          {planLabel === "free" ? (
            <Link
              href="/upgrade"
              className="inline-block rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-300 transition"
            >
              Upgrade plan
            </Link>
          ) : (
            <button
              disabled
              className="inline-block rounded-full bg-slate-700 px-5 py-2 text-sm opacity-60 cursor-not-allowed"
            >
              Managing Premium (coming soon)
            </button>
          )}
        </div>
      </section>

      {/* INVOICES PLACEHOLDER */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">Invoices</h2>
        <p className="text-sm text-slate-400">
          Billing history will appear here when paid plans are live.
        </p>
      </section>

      {/* PAYMENT METHOD PLACEHOLDER */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold text-white mb-3">
          Payment methods
        </h2>
        <p className="text-sm text-slate-400">
          Add or update your payment methods once Havenly Plus subscriptions
          become available.
        </p>
      </section>

      {/* NAVIGATION */}
      <div className="mt-10">
        <Link
          href="/settings"
          className="rounded-full bg-slate-800 px-5 py-2 text-sm hover:bg-slate-700"
        >
          ← Back to Settings
        </Link>
      </div>
    </div>
  );
}
