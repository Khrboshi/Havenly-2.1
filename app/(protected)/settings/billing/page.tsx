"use client";

import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function BillingPage() {
  const { session } = useSupabase();
  const { loading, error, planType, credits, renewalDate } = useUserPlan();

  const userEmail = session?.user?.email ?? "Unknown user";

  const readablePlan =
    planType === "PREMIUM"
      ? "Premium"
      : planType === "TRIAL"
      ? "Trial"
      : "Free";

  const planDescription =
    planType === "PREMIUM"
      ? "You have full access to Havenly Premium with deeper insights and supportive reflection tools."
      : planType === "TRIAL"
      ? "You’re in a trial period with access to most Premium features."
      : "You’re currently using the Free plan with core journaling and light reflections.";

  return (
    <div className="min-h-screen w-full bg-slate-950 px-6 py-10 text-white">
      <h1 className="mb-6 text-3xl font-bold">Billing & Subscription</h1>

      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        {/* Current plan card */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">Your current plan</h2>

          {loading ? (
            <div className="h-20 animate-pulse rounded-xl bg-slate-800/60" />
          ) : error ? (
            <p className="text-sm text-red-400">
              We couldn’t load your plan details. You’re currently treated as on the Free plan.
            </p>
          ) : (
            <>
              <p className="text-sm text-slate-300">
                <span className="font-medium">{readablePlan}</span> · {planDescription}
              </p>

              <dl className="mt-3 grid grid-cols-1 gap-3 text-sm text-slate-200 sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">Account</dt>
                  <dd className="mt-1 break-all text-slate-100">{userEmail}</dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">Credits</dt>
                  <dd className="mt-1">{typeof credits === "number" ? credits : 0}</dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">Renewal</dt>
                  <dd className="mt-1">
                    {renewalDate ||
                      (planType === "FREE" ? "No renewal for Free plan" : "Not set")}
                  </dd>
                </div>
              </dl>
            </>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {planType === "PREMIUM" || planType === "TRIAL" ? (
              <>
                <Link
                  href="/premium"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Open Premium hub
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
                >
                  Back to dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/upgrade"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Upgrade to Premium
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
                >
                  Stay on Free for now
                </Link>
              </>
            )}
          </div>
        </section>

        {/* How billing works / philosophy */}
        <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-200">
          <h2 className="text-lg font-semibold text-white">How billing works</h2>

          <p className="text-slate-300">
            Havenly uses a simple subscription model designed to keep your reflective space
            calm, private, and completely free of ads. Premium is optional and adds deeper
            insights, emotional timelines, and a higher monthly credit balance.
          </p>

          <p className="text-slate-300">
            As Havenly continues to grow, this page will show additional subscription details
            including renewal status, invoices, and receipts. For now, you can freely move
            between Free and Premium depending on what feels most supportive to you.
          </p>

          <p className="text-slate-400">
            You can cancel Premium at any time, and your journal entries always remain yours.
          </p>
        </section>
      </div>

      {/* Usage / history */}
      <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Usage & history</h2>
        <p className="mb-4 max-w-lg text-sm text-white/70">
          Review how your credits have been used across reflections and tools.
        </p>

        <Link
          href="/settings/transactions"
          className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          View transaction history →
        </Link>
      </div>
    </div>
  );
}
