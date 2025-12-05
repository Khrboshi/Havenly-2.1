// app/premium/page.tsx
"use client";

/* 
  Havenly Premium — Soft Blue Calm (v2.0)
  ---------------------------------------------------
  - Matches landing page tone, visuals, and structure
  - Maintains all functionality (RequirePremium, useUserPlan)
  - Reinforces emotional value + long-term insight benefits
  - Zero breaking changes to API, metadata, or routing
*/

import RequirePremium from "@/app/components/RequirePremium";
import Link from "next/link";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function PremiumPage() {
  const { credits, renewalDate, planType } = useUserPlan();

  return (
    <RequirePremium>
      <main className="min-h-screen w-full bg-[#050816] text-gray-100 pb-24">
        {/* ================= HERO ================= */}
        <section className="w-full bg-gradient-to-b from-[#111827] via-[#0D1422] to-[#050816] px-6 pt-20 pb-24 md:px-12 lg:px-24">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-50">
              Welcome to Havenly Premium
            </h1>

            <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              This is your deeper reflective space — where gentle insights turn
              into long-term understanding. Premium helps you notice emotional
              patterns, track inner shifts, and grow with clarity over time.
            </p>

            <div className="flex justify-center gap-3 text-xs text-gray-400 flex-wrap">
              <span className="rounded-full bg-black/30 px-3 py-1">
                Emotional themes & long-term patterns
              </span>
              <span className="rounded-full bg-black/30 px-3 py-1">
                Deeper AI reflections
              </span>
              <span className="rounded-full bg-black/30 px-3 py-1">
                Priority access to new tools
              </span>
            </div>
          </div>
        </section>

        {/* ================= PREMIUM BENEFITS ================= */}
        <section className="px-6 md:px-12 lg:px-24 py-16">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-100">
                What Havenly Premium unlocks for you
              </h2>
              <p className="text-sm text-gray-300 max-w-2xl">
                These tools are designed to help you make sense of your emotional world
                in a way that feels kind, grounded, and deeply supportive.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Benefit 1 */}
              <div className="rounded-xl border border-gray-700/40 bg-[#0B1020] p-5">
                <h3 className="text-sm font-semibold text-gray-50">
                  Long-term emotional themes
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-300">
                  Havenly helps you recognize repeating patterns in your emotions,
                  energy, and thoughts across weeks and months.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="rounded-xl border border-gray-700/40 bg-[#0B1020] p-5">
                <h3 className="text-sm font-semibold text-gray-50">
                  Deeper reflective insights
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-300">
                  Premium reflections go beyond validation — they gently challenge
                  unhelpful narratives and highlight what you may be overlooking.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="rounded-xl border border-gray-700/40 bg-[#0B1020] p-5">
                <h3 className="text-sm font-semibold text-gray-50">
                  Early access to supportive tools
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-300">
                  Be the first to try new journaling flows, emotional check-ins,
                  and guided reflection journeys as they roll out.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PLAN SUMMARY ================= */}
        <section className="px-6 md:px-12 lg:px-24 pb-16">
          <div className="mx-auto max-w-md rounded-2xl border border-gray-700/60 bg-[#0B1020]/80 backdrop-blur p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Your Premium Plan
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-200">Plan Type:</span>{" "}
                {planType || "Premium"}
              </p>
              <p>
                <span className="font-medium text-gray-200">Credits:</span>{" "}
                {credits ?? 0}
              </p>
              <p>
                <span className="font-medium text-gray-200">Next Renewal:</span>{" "}
                {renewalDate || "N/A"}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/settings/billing"
                className="flex-1 rounded-full bg-[#4CC5A9] px-5 py-2 text-sm font-semibold text-[#050816] hover:bg-[#3db497] text-center"
              >
                Manage Subscription
              </Link>

              <Link
                href="/journal"
                className="flex-1 rounded-full border border-gray-600 px-5 py-2 text-sm text-gray-200 hover:bg-gray-800/50 text-center"
              >
                Go to your journal
              </Link>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="px-6 md:px-12 lg:px-24 mt-10 text-center">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Keep showing up for yourself.
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mx-auto mb-6">
            Your Premium space will grow with you — gently reflecting who you
            are becoming, not just how you felt today.
          </p>
          <Link
            href="/journal"
            className="rounded-full bg-[#4CC5A9] px-6 py-3 text-sm font-semibold text-[#050816] hover:bg-[#3db497]"
          >
            Continue your reflection
          </Link>
        </section>
      </main>
    </RequirePremium>
  );
}
