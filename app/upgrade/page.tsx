"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserPlan } from "@/app/components/useUserPlan";

/*
  Havenly Upgrade – Soft Blue Calm (v2.1)
  ----------------------------------------
  - Matches landing + premium visual identity
  - Softer psychological tone
  - Uses blue/teal calm palette
  - Stronger emotional storytelling for conversion
  - Zero breaking changes — safe drop-in replacement
*/

const premiumBenefits = [
  "Deeper AI reflections that gently highlight what mattered most in your week.",
  "Understanding emotional themes and recurring internal patterns.",
  "Supportive insights that help you feel less alone with what you’re carrying.",
  "Early access to new calming tools and reflective journeys.",
];

const freeVsPremiumRows = [
  { label: "Daily private journaling", free: "Included", premium: "Included" },
  {
    label: "Gentle AI reflections",
    free: "Short + simple",
    premium: "Deeper, more supportive",
  },
  {
    label: "Patterns & emotional themes",
    free: "Not available",
    premium: "Full insight timeline",
  },
  {
    label: "Advanced wellbeing tools",
    free: "Limited",
    premium: "Everything unlocked",
  },
  {
    label: "Early access to new features",
    free: "No",
    premium: "Yes",
  },
];

const whoItsFor = [
  "People who feel mentally overloaded and want calm structure.",
  "Anyone who journals but wishes they could see patterns more clearly.",
  "Those who want emotional support—not productivity tools.",
  "People who enjoy Havenly’s tone and want the full, deeper experience.",
];

export default function UpgradePage() {
  const { planType } = useUserPlan();
  const [loading, setLoading] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);

  const alreadyUpgraded = planType && planType !== "FREE";

  async function handleUpgrade() {
    try {
      setLoading(true);

      const res = await fetch("/api/user/plan/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "premium" }),
      });

      if (res.status === 401) {
        setLoginRequired(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        alert("Upgrade failed.");
        setLoading(false);
        return;
      }

      window.location.href = "/premium";
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-10 text-gray-100 bg-[#050816]">

      {/* LOGIN REQUIRED NOTICE */}
      {loginRequired && (
        <div className="mx-auto max-w-5xl mb-6">
          <div className="rounded-xl border border-blue-400/40 bg-blue-400/10 px-4 py-3 text-blue-200 text-sm">
            You need to sign in before upgrading.
            <Link
              href="/magic-login?redirectedFrom=/upgrade"
              className="ml-2 underline hover:text-blue-100"
            >
              Sign in here →
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="mx-auto max-w-5xl mb-12">
        <span className="inline-flex items-center rounded-full border border-blue-400/40 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-200 mb-4">
          Havenly Premium
        </span>

        <div className="grid gap-8 lg:grid-cols-[2fr,1.3fr] items-start">
          {/* LEFT SIDE */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
              A deeper, calmer way to understand yourself.
            </h1>

            <p className="text-gray-300 text-base sm:text-lg mb-6 max-w-xl leading-relaxed">
              The free Havenly space helps you slow down and express yourself. 
              Premium takes you further—gently showing emotional themes, 
              supportive insights, and long-term patterns that help you make sense 
              of what you’ve been carrying.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleUpgrade}
                disabled={loading || alreadyUpgraded}
                className="px-5 py-3 rounded-full bg-[#7AB3FF] text-[#050816] font-semibold text-sm sm:text-base hover:bg-[#6aa6f5] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {alreadyUpgraded
                  ? "You’re already Premium"
                  : loading
                  ? "Processing…"
                  : "Upgrade to Premium"}
              </button>

              <p className="text-xs sm:text-sm text-gray-400">
                No ads. No pressure. Just clarity and support.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE CARD */}
          <div className="rounded-2xl border border-gray-700/40 bg-[#0B1020]/80 p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-3">What Premium adds</h2>

            <ul className="space-y-3 text-sm text-gray-300">
              {premiumBenefits.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#7AB3FF]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl bg-[#0F1628] px-4 py-3 text-xs text-gray-400">
              Havenly Premium stays quiet and gentle—no streaks, no 
              productivity pressure. Just clearer understanding of what 
              shapes your inner world.
            </div>
          </div>
        </div>
      </section>

      {/* FREE vs PREMIUM COMPARISON */}
      <section className="mx-auto max-w-5xl mb-12">
        <h2 className="text-2xl font-semibold mb-4">Free vs Premium</h2>

        <p className="text-gray-300 text-sm sm:text-base mb-6 max-w-2xl">
          Havenly always includes a free journaling space. Premium is for when
          you're ready to see what’s been shifting beneath the surface.
        </p>

        <div className="overflow-hidden rounded-2xl border border-gray-700/40 bg-[#0B1020]/50">
          <table className="w-full text-sm">
            <thead className="bg-[#0B1020]/80">
              <tr className="text-left">
                <th className="px-6 py-3 text-gray-400 font-medium">Feature</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Free</th>
                <th className="px-6 py-3 text-[#7AB3FF] font-semibold">Premium</th>
              </tr>
            </thead>

            <tbody>
              {freeVsPremiumRows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-[#0B1020]/40" : "bg-[#0B1020]/20"}
                >
                  <td className="px-6 py-3 text-gray-200">{row.label}</td>
                  <td className="px-6 py-3 text-gray-400">{row.free}</td>
                  <td className="px-6 py-3 text-[#7AB3FF] font-medium">
                    {row.premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="mx-auto max-w-5xl mb-12 grid gap-8 lg:grid-cols-[1.6fr,1.2fr]">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Who Premium is for</h2>

          <p className="text-gray-300 text-sm sm:text-base mb-6 max-w-xl leading-relaxed">
            Premium is for people who want to understand their emotional life—not 
            monitor it like a productivity dashboard. It’s about clarity, not control.
          </p>

          <ul className="space-y-3 text-sm text-gray-300">
            {whoItsFor.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#7AB3FF]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-700/40 bg-[#0B1020]/70 p-6">
          <h3 className="text-lg font-semibold mb-3">How upgrading works</h3>

          <ol className="space-y-3 text-sm text-gray-300 list-decimal list-inside">
            <li>Sign in or create your free Havenly space.</li>
            <li>Tap “Upgrade to Premium” on this page.</li>
            <li>Your account unlocks Premium automatically.</li>
          </ol>

          <p className="mt-4 text-xs text-gray-400">
            You stay in full control. Your free journaling space remains yours forever.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-5xl pb-12">
        <div className="rounded-2xl border border-blue-400/40 bg-blue-400/10 px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Ready to understand yourself more deeply?
            </h2>

            <p className="text-sm text-gray-300 max-w-xl">
              Premium helps you see emotional themes, receive deeper support, 
              and notice the quiet shifts that matter most.
            </p>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading || alreadyUpgraded}
            className="px-5 py-3 rounded-full bg-[#7AB3FF] text-[#050816] font-semibold text-sm hover:bg-[#6aa6f5] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {alreadyUpgraded ? "You're already Premium" : loading ? "Processing…" : "Upgrade now"}
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Prefer staying on the free version? That’s completely fine.
        </p>
      </section>
    </div>
  );
}
