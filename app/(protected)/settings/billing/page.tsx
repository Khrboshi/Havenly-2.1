"use client";

import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function BillingPage() {
  const { session } = useSupabase();
  const { loading, error, planType, credits } = useUserPlan();

  const userEmail = session?.user?.email ?? "Unknown user";

  return (
    <div className="min-h-screen w-full px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>

      <p className="text-white/70 mb-4 max-w-xl">
        Manage your Havenly subscription and track your available credits.
      </p>

      {/* User Email */}
      <div className="mb-6 rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur">
        <p className="text-sm text-white/60">Signed in as</p>
        <p className="text-lg font-semibold">{userEmail}</p>
      </div>

      {/* Plan status */}
      <div className="mb-6 rounded-xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold mb-2">Current Plan</h2>

        {loading ? (
          <p className="text-white/50">Loading plan information...</p>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <>
            <p className="text-lg font-medium">
              {planType === "PREMIUM"
                ? "Premium"
                : planType === "TRIAL"
                ? "Trial"
                : "Free"}
            </p>

            <p className="text-sm text-white/60 mt-1">
              Credits: {credits ?? 0}
            </p>

            {planType !== "PREMIUM" && (
              <Link
                href="/upgrade"
                className="inline-block mt-4 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Upgrade to Premium
              </Link>
            )}
          </>
        )}
      </div>

      {/* Transaction history link */}
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold mb-2">Credit Transactions</h2>
        <p className="text-white/70 mb-4 max-w-lg text-sm">
          Review how your credits have been used across tools and reflections.
        </p>

        <Link
          href="/settings/transactions"
          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
        >
          View transaction history →
        </Link>
      </div>
    </div>
  );
}
