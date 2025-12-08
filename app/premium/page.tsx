// app/premium/page.tsx
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
              Your Premium reflection space
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/70">
              This hub gives you an overview of your plan, credits, and the
              deeper tools you have access to with Havenly Premium.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
            {/* Plan overview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold">Plan overview</h2>
              <p className="mt-2 text-sm text-slate-200">
                <span className="font-medium">{readablePlan}</span> · billed at
                approximately{" "}
                <span className="font-semibold text-emerald-300">
                  $25/month
                </span>{" "}
                as part of Havenly’s simple subscription model.
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
                    {renewalDate || "Not set yet"}
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
                  Open insights
                </Link>
              </div>
            </div>

            {/* Premium benefits summary */}
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-200">
              <h3 className="text-base font-semibold text-white">
                What you get with Premium
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  • Deeper, kinder reflections that look across multiple
                  entries—not just one at a time.
                </li>
                <li>
                  • Emerging themes and emotional timelines that make patterns
                  easier to notice.
                </li>
                <li>
                  • A higher monthly credit balance so you can explore insights
                  without worrying about “wasting” them.
                </li>
                <li>
                  • Priority access to new Premium-only tools as they are
                  released.
                </li>
              </ul>

              <Link
                href="/settings/billing"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-white"
              >
                Manage subscription
              </Link>

              <p className="mt-3 text-xs text-slate-400">
                You can downgrade back to the Free plan at any time from
                Billing. Your journal entries always remain in your account.
              </p>
            </div>
          </section>
        </div>
      </div>
    </RequirePremium>
  );
}
