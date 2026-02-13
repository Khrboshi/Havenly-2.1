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
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Settings</h1>
      <p className="text-slate-400 mb-10">
        Manage your account, preferences, and subscription.
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-1">Account</h2>
        <p className="text-slate-400 text-sm mb-4">{userEmail}</p>

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

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold mb-2">Plan</h2>
        <p className="text-slate-400 text-sm mb-4">
          Current plan: <span className="text-slate-200">{plan ?? "Free"}</span>
          {typeof credits === "number" ? (
            <>
              {" "}
              — credits: <span className="text-slate-200">{credits}</span>
            </>
          ) : null}
        </p>

        <Link
          href="/upgrade"
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          Manage subscription →
        </Link>
      </div>
    </div>
  );
}
