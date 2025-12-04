"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserPlan } from "@/app/components/useUserPlan";

const premiumBenefits = [
  "Deeper AI reflections that gently highlight what mattered most in your week.",
  "Timeline of emotional patterns, themes, and recurring worries.",
  "Richer context around your entries—without judgment or pressure.",
  "Priority processing for insights and new features as they roll out.",
];

const freeVsPremiumRows = [
  { label: "Daily private journaling", free: "Included", premium: "Included" },
  { label: "Gentle AI reflections on recent entries", free: "Light", premium: "Richer, more detailed" },
  { label: "Patterns & mood over time", free: "Not available", premium: "Full timeline view" },
  { label: "Advanced wellbeing tools", free: "Limited", premium: "All tools unlocked" },
  { label: "Priority access to new features", free: "No", premium: "Yes" },
];

const whoItsFor = [
  "People who feel mentally overloaded and want calm, structured check-ins.",
  "Anyone who journals but wishes they could see patterns more clearly over time.",
  "Those who don’t want productivity hacks—just a gentle space to understand their days.",
  "People who like Havenly’s tone and want the “full experience” without distractions.",
];

export default function UpgradePage() {
  const { planType } = useUserPlan();
  const [loading, setLoading] = useState(false);
  const alreadyUpgraded = planType && planType !== "FREE";

  const [loginRequired, setLoginRequired] = useState(false);

  async function handleUpgrade() {
    try {
      setLoading(true);

      const res = await fetch("/api/user/plan/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "premium" }),
      });

      if (res.status === 401) {
        // Show friendly inline banner instead of alert()
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
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-10 text-white bg-slate-950">

      {/* LOGIN REQUIRED BANNER */}
      {loginRequired && (
        <div className="mx-auto max-w-5xl mb-6">
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-300 text-sm">
            You need to sign in before upgrading.
            <Link
              href="/magic-login?redirectedFrom=/upgrade"
              className="ml-2 underline hover:text-emerald-200"
            >
              Sign in here →
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="mx-auto max-w-5xl mb-12">
        <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 mb-4">
          Havenly Premium
        </span>

        <div className="grid gap-8 lg:grid-cols-[2fr,1.3fr] items-start">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Upgrade to deeper, calmer insights.
            </h1>

            <p className="text-white/70 text-base sm:text-lg mb-6 max-w-xl">
              The free version of Havenly gives you a quiet page to write a few
              honest sentences. Premium goes a step further—helping you see
              emotional patterns over time, understand what supports you, and
              feel a little less alone with what you're carrying.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleUpgrade}
                disabled={loading || alreadyUpgraded}
                className="px-5 py-3 rounded-full bg-emerald-500 text-slate-950 font-semibold text-sm sm:text-base hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {alreadyUpgraded
                  ? "You’re already on Premium"
                  : loading
                  ? "Processing…"
                  : "Upgrade to Premium"}
              </button>

              <p className="text-xs sm:text-sm text-white/60">
                No ads. No feeds. Just a calmer, deeper version of Havenly.
              </p>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-3">What Premium adds to your ritual</h2>

            <ul className="space-y-3 text-sm text-white/75">
              {premiumBenefits.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl bg-slate-800/60 px-4 py-3 text-xs text-white/70">
              Havenly Premium is intentionally quiet. There are no streaks,
              productivity scores, or growth-hacking tricks—just a gentler way
              to see what’s been weighing on you.
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="mx-auto max-w-5xl mb-12">
        <h2 className="text-2xl font-semibold mb-4">Free vs Premium</h2>

        <p className="text-white/70 text-sm sm:text-base mb-6 max-w-2xl">
          Havenly will always offer a free way to journal. Premium is for when
          you're ready to understand more about how you've really been feeling—
          without turning your life into a dashboard.
        </p>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/80">
              <tr className="text-left">
                <th className="px-6 py-3 text-white/60 font-medium">Feature</th>
                <th className="px-6 py-3 text-white/60 font-medium">Free</th>
                <th className="px-6 py-3 text-emerald-300 font-semibold">Premium</th>
              </tr>
            </thead>

            <tbody>
              {freeVsPremiumRows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/20"}
                >
                  <td className="px-6 py-3 text-white/80">{row.label}</td>
                  <td className="px-6 py-3 text-white/60">{row.free}</td>
                  <td className="px-6 py-3 text-emerald-300 font-medium">
                    {row.premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WHO ITS FOR */}
      <section className="mx-auto max-w-5xl mb-12 grid gap-8 lg:grid-cols-[1.6fr,1.2fr]">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Who Havenly Premium is for</h2>

          <p className="text-white/70 text-sm sm:text-base mb-6 max-w-xl">
            Premium isn't about becoming more productive. It’s for people who want
            a kinder way to track how they’re actually doing—and what’s been quietly helping.
          </p>

          <ul className="space-y-3 text-sm text-white/80">
            {whoItsFor.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <h3 className="text-lg font-semibold mb-3">How upgrading works</h3>

          <ol className="space-y-3 text-sm text-white/75 list-decimal list-inside">
            <li>Sign in or create your free Havenly account.</li>
            <li>Click "Upgrade to Premium" on this page.</li>
            <li>Your account unlocks Premium automatically.</li>
          </ol>

          <p className="mt-4 text-xs text-white/60">
            You’re always in control. You can continue using the free version at any time.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-5xl pb-12">
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Ready for a deeper, calmer view of your days?
            </h2>

            <p className="text-sm text-white/75 max-w-xl">
              Upgrade to Premium to see patterns, get richer reflections, and
              let Havenly gently highlight what’s been heavy—and what’s been helping.
            </p>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading || alreadyUpgraded}
            className="px-5 py-3 rounded-full bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {alreadyUpgraded
              ? "You’re already on Premium"
              : loading
              ? "Processing…"
              : "Upgrade now"}
          </button>
        </div>

        <p className="mt-4 text-xs text-white/55">
          Prefer to stay on the free version? That’s completely fine.
        </p>
      </section>
    </div>
  );
}
