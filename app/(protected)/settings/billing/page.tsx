// app/(protected)/settings/billing/page.tsx
"use client";

import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function BillingPage() {
  const { session } = useSupabase();
  const { loading, error, planType, credits } = useUserPlan();

  const userEmail = session?.user?.email ?? "Unknown user";

  const planLabel =
    planType === "PREMIUM"
      ? "Premium"
      : planType === "TRIAL"
      ? "Trial"
      : "Free";

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & plan</h1>
          <p className="text-sm text-white/70 max-w-xl">
            See your current Havenly plan, available credits, and options to
            upgrade when you are ready.
          </p>
        </div>

        {/* Loading / error states */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4 text-sm text-slate-200">
            Checking your plan and credits…
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-500/50 bg-red-950/40 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Main card */}
        {!loading && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">
                  Account
                </p>
                <p className="mt-1 text-sm text-white/80">{userEmail}</p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Current plan
                </p>
                <p className="text-sm font-semibold">
                  {planLabel}{" "}
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    (Havenly 2.1)
                  </span>
                </p>
                {typeof credits === "number" && (
                  <p className="text-xs text-slate-300">
                    Credits:{" "}
                    <span className="font-medium text-emerald-300">
                      {credits}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="h-px bg-slate-800" />

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold mb-2">What you have now</h2>
                <ul className="space-y-2 text-sm text-white/75">
                  <li>• Private journaling with gentle AI reflections.</li>
                  <li>• No ads, feeds, or streak pressure.</li>
                  <li>• Your data stays tied to your account only.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-semibold mb-2">
                  What Premium adds
                </h2>
                <ul className="space-y-2 text-sm text-white/75 mb-3">
                  <li>• Deeper AI reflections over time.</li>
                  <li>• Patterns & mood timelines across entries.</li>
                  <li>• Advanced wellbeing tools in the Tools section.</li>
                </ul>

                {planType === "PREMIUM" ? (
                  <p className="text-xs text-emerald-300">
                    You’re already on Premium. Thank you for supporting
                    Havenly.
                  </p>
                ) : (
                  <Link
                    href="/upgrade"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                  >
                    View Premium options
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Footer note */}
        <p className="text-xs text-slate-500">
          Need help with billing or your plan? You can reach out via the
          support channel linked in the app.
        </p>
      </div>
    </div>
  );
}
