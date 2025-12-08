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
          {/* ========================= HEADER ========================= */}
          <header>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
              Havenly Premium
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Your deeper reflection space
            </h1>

            <p className="mt-3 max-w-xl text-sm text-white/70">
              This page gives you a calm overview of your Premium benefits,
              available credits, and the reflective tools designed to help you
              understand your emotional patterns with more clarity and softness.
            </p>
          </header>

          {/* ========================= MAIN GRID ========================= */}
          <section className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
            {/* PLAN OVERVIEW */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold">Your plan</h2>

              <p className="mt-2 text-sm text-slate-200">
                You’re on the{" "}
                <span className="font-medium text-emerald-300">
                  {readablePlan}
                </span>{" "}
                plan, which gives you full access to Havenly’s deeper insights,
                supportive timelines, and expanded reflective tools.
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

            {/* PREMIUM BENEFITS */}
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-200">
              <h3 className="text-base font-semibold text-white">
                What Premium gives you
              </h3>

              <ul className="mt-3 space-y-2">
                <li>
                  • Deeper, more thoughtful reflections that look across
                  multiple entries—not just one at a time.
                </li>

                <li>
                  • Emotional timelines and themes that help you see how your
                  days weave together over time.
                </li>

                <li>
                  • A higher monthly credit balance so you can explore insights
                  comfortably.
                </li>

                <li>
                  • Early access to new Premium-only tools and experiments as
                  Havenly grows.
                </li>
              </ul>

              <Link
                href="/settings/billing"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-white"
              >
                Manage subscription
              </Link>

              <p className="mt-3 text-xs text-slate-400">
                You can downgrade at any time. Your journal entries always
                remain yours, regardless of your plan.
              </p>
            </div>
          </section>

          {/* ========================= SUPPORTIVE NOTE ========================= */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-white/80">
            <h3 className="text-base font-semibold text-white">
              A calmer, more supportive experience
            </h3>

            <p className="mt-3 leading-relaxed">
              Premium is designed to give you a deeper sense of clarity—not more
              pressure. Every feature here is built to help you feel grounded,
              supported, and understood in your own rhythm. Use what feels
              helpful, skip what doesn’t, and return whenever you want to take a
              closer look at how your days have been unfolding.
            </p>

            <p className="mt-3 text-xs text-white/55">
              Havenly never uses your writing for advertising or profiling. Your
              space remains private, gentle, and yours alone.
            </p>
          </section>
        </div>
      </div>
    </RequirePremium>
  );
}
