"use client";

import Link from "next/link";
import { useSupabase } from "@/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function SettingsPage() {
  const { session } = useSupabase();
  const { plan, credits } = useUserPlan();

  const userEmail = session?.user?.email || "Unknown user";

  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-slate-200">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mb-10 text-slate-400">
        Manage your account, preferences, and subscription.
      </p>

      {/* Account */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-1 text-lg font-semibold">Account</h2>
        <p className="mb-4 text-sm text-slate-400">{userEmail}</p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/settings/transactions"
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            Transactions
          </Link>

          <Link
            href="/upgrade"
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400"
          >
            Upgrade
          </Link>
        </div>
      </div>

      {/* Plan */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-2 text-lg font-semibold">Plan</h2>
        <p className="mb-4 text-sm text-slate-400">
          Current plan: <span className="text-slate-200">{plan ?? "Free"}</span>
          {typeof credits === "number" ? (
            <>
              {" "}
              — credits: <span className="text-slate-200">{credits}</span>
            </>
          ) : null}
        </p>

        <Link href="/upgrade" className="text-sm text-emerald-400 hover:text-emerald-300">
          Manage subscription →
        </Link>
      </div>

      {/* Install (discoverable entry point for iPhone Safari users) */}
      <section className="mt-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-100">Install Havenly</p>
              <p className="mt-1 text-xs text-slate-400">
                Add to Home Screen for a faster, app-like experience (works best on iPhone Safari).
              </p>
            </div>

            <Link
              href="/install"
              className="shrink-0 rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Install
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
