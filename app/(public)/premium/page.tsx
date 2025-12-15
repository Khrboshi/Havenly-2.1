"use client";

import RequirePremium from "@/app/components/RequirePremium";
import Link from "next/link";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function PremiumPage() {
  const { credits, renewalDate, planType } = useUserPlan();

  const readablePlan =
    planType === "PREMIUM"
      ? "Premium"
      : planType === "TRIAL"
      ? "Trial"
      : "Free";

  return (
    <RequirePremium>
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl space-y-8">
          <header>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
              Havenly Premium
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Your deeper reflection space
            </h1>

            <p className="mt-3 max-w-xl text-sm text-white/70">
              A supportive, gentle space to explore how your days have been unfolding.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold">Your plan</h2>

              <p className="mt-2 text-sm text-slate-200">
                You’re on the{" "}
                <span className="font-medium text-emerald-300">{readablePlan}</span>{" "}
                plan.
              </p>

              <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Credits available
                  </dt>
                  <dd className="mt-1 text-slate-50">
                    {typeof credits === "number" ? credits : 0}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Next renewal
                  </dt>
                  <dd className="mt-1 text-slate-50">
                    {renewalDate || "Not set"}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/journal/new"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Write a new entry
                </Link>

                <Link
                  href="/insights"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
                >
                  View insights
                </Link>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-200">
              <h3 className="text-base font-semibold text-white">
                What Premium gives you
              </h3>

              <ul className="mt-3 space-y-2">
                <li>• Deeper reflections on your entries.</li>
                <li>• Emotional timelines and themes.</li>
                <li>• Higher monthly credit balance.</li>
                <li>• Early access to new tools.</li>
              </ul>

              <Link
                href="/settings/billing"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-white"
              >
                Manage subscription
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-white/80">
            <h3 className="text-base font-semibold text-white">
              A calmer, more supportive experience
            </h3>

            <p className="mt-3 leading-relaxed">
              Premium gives you deeper clarity, not pressure. Use what feels helpful.
            </p>

            <p className="mt-3 text-xs text-white/55">
              Havenly never uses your writing for advertising or profiling.
            </p>
          </section>
        </div>
      </div>
    </RequirePremium>
  );
}
