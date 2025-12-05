"use client";

/*
  Havenly Billing – Soft Blue Calm (v2.0)
  ----------------------------------------
  - Matches Landing / Upgrade / Premium emotional tone
  - Uses soft blue palette instead of emerald
  - Gentle, supportive writing style
  - No breaking changes, fully safe
*/

import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function BillingPage() {
  const { session } = useSupabase();
  const { loading, error, planType, credits } = useUserPlan();

  const userEmail = session?.user?.email ?? "Unknown user";

  return (
    <main className="min-h-screen w-full bg-[#050816] px-6 py-10 text-gray-100">
      
      {/* ================= HEADER ================= */}
      <div className="mx-auto max-w-4xl mb-10 space-y-2">
        <h1 className="text-3xl font-semibold text-gray-50">
          Billing & Subscription
        </h1>
        <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
          Manage your plan, review your credits, and adjust your subscription settings.
          Havenly keeps things simple—no hidden fees, no surprise changes.
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* ================= USER EMAIL ================= */}
        <section className="rounded-2xl border border-gray-700/40 bg-[#0B1020]/70 backdrop-blur p-6">
          <h2 className="text-lg font-semibold text-gray-50 mb-3">Account</h2>

          <p className="text-xs text-gray-400 mb-1">Signed in as</p>
          <p className="text-base font-medium text-gray-100">{userEmail}</p>
        </section>

        {/* ================= CURRENT PLAN ================= */}
        <section className="rounded-2xl border border-gray-700/40 bg-[#0B1020]/70 backdrop-blur p-6">
          <h2 className="text-lg font-semibold text-gray-50 mb-4">Current Plan</h2>

          {loading ? (
            <p classnName="text-gray-400 text-sm">Loading plan information…</p>
          ) : error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : (
            <>
              <p className="text-xl font-semibold text-gray-100">
                {planType === "PREMIUM"
                  ? "Premium"
                  : planType === "TRIAL"
                  ? "Trial"
                  : "Free"}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Credits available: {credits ?? 0}
              </p>

              {planType !== "PREMIUM" && (
                <Link
                  href="/upgrade"
                  className="inline-block mt-5 rounded-full bg-[#7AB3FF] px-5 py-2 text-sm font-semibold text-[#050816] hover:bg-[#6aa6f5]"
                >
                  Upgrade to Premium
                </Link>
              )}

              {planType === "PREMIUM" && (
                <Link
                  href="/upgrade"
                  className="inline-block mt-5 rounded-full border border-gray-600 px-5 py-2 text-sm text-gray-200 hover:bg-gray-800/60"
                >
                  View Premium details
                </Link>
              )}
            </>
          )}
        </section>

        {/* ================= CREDIT TRANSACTIONS ================= */}
        <section className="rounded-2xl border border-gray-700/40 bg-[#0B1020]/70 backdrop-blur p-6">
          <h2 className="text-lg font-semibold text-gray-50 mb-2">
            Credit Transactions
          </h2>

          <p className="text-gray-300 text-sm max-w-lg mb-4">
            See how your credits were used across reflections and supportive tools.
            Premium members often gain deeper insights from reviewing this section.
          </p>

          <Link
            href="/settings/transactions"
            className="text-[#7AB3FF] hover:text-[#adcfff] text-sm font-medium"
          >
            View transaction history →
          </Link>
        </section>
      </div>
    </main>
  );
}
