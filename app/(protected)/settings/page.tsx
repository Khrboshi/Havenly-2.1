"use client";

import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function SettingsPage() {
  const { session } = useSupabase();
  const { plan, credits } = useUserPlan();

  const userEmail = session?.user?.email || "Unknown user";

  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-slate-200">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Settings</h1>
      <p className="text-slate-400 mb-10">
        Manage your account, preferences, and plan.
      </p>

      {/* ACCOUNT SECTION */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">
          Account details
        </h2>

        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Email</span>
            <span className="font-medium">{userEmail}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current plan</span>
            <span className="font-medium capitalize">{plan ?? "free"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Credits</span>
            <span className="font-medium">{credits ?? 0}</span>
          </div>
        </div>
      </section>

      {/* PREFERENCES SECTION */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">
          Preferences
        </h2>

        <p className="text-sm text-slate-400 mb-4">
          Personalization options will be added soon — such as themes, journaling
          reminders, and data export settings.
        </p>
      </section>

      {/* BILLING SECTION (only a link for now) */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">Billing</h2>

        <p className="text-sm text-slate-400 mb-4">
          If you upgrade in the future, you’ll manage payment methods and invoices here.
        </p>

        <Link
          href="/settings/billing"
          className="inline-block rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-300 transition"
        >
          Go to billing
        </Link>
      </section>

      {/* SECURITY SECTION */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Security</h2>

        <p className="text-sm text-slate-400 mb-5">
          Havenly uses passwordless authentication via secure magic links.
        </p>

        <Link
          href="/logout"
          className="inline-block rounded-full bg-slate-800 px-5 py-2 text-sm hover:bg-slate-700"
        >
          Log out
        </Link>
      </section>
    </div>
  );
}
