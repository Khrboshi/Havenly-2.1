"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserPlan } from "@/app/components/useUserPlan";

const premiumBenefits = [
  "Deeper AI reflections that gently highlight what mattered most in your week.",
  "Timelines of emotional patterns, themes, and recurring worries.",
  "Richer context around your entries—without judgment or productivity pressure.",
  "Priority access to new tools and Premium experiments as they roll out.",
];

const freeVsPremiumRows = [
  {
    label: "Daily private journaling",
    free: "Included",
    premium: "Included",
  },
  {
    label: "AI reflections",
    free: "Light snapshot",
    premium: "Deeper, more nuanced insights",
  },
  {
    label: "Pattern timelines & themes",
    free: "Not included",
    premium: "Included",
  },
  {
    label: "Monthly recap / check-ins",
    free: "Not included",
    premium: "Included",
  },
  {
    label: "Credits balance",
    free: "Limited",
    premium: "Higher monthly balance",
  },
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
  const [loginRequired, setLoginRequired] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const alreadyUpgraded = planType && planType !== "FREE";

  async function handleUpgrade() {
    try {
      setLoginRequired(false);
      setUpgradeError(null);
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
        const data = await res.json().catch(() => ({}));
        setUpgradeError(
          typeof data.error === "string"
            ? data.error
            : "Something went wrong while upgrading. Please try again."
        );
        setLoading(false);
        return;
      }

      // Simple redirect to Premium hub on success
      setLoading(false);
      if (typeof window !== "undefined") {
        window.location.href = "/premium";
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      setUpgradeError(
        "We couldn’t complete the upgrade right now. Please try again shortly."
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        {/* Inline notice if login is required */}
        {loginRequired && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Please sign in first using the{" "}
            <Link
              href="/magic-login"
              className="font-semibold underline underline-offset-2"
            >
              magic link
            </Link>{" "}
            before upgrading to Premium.
          </div>
        )}

        {upgradeError && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {upgradeError}
          </div>
        )}

        {/* HERO SECTION */}
        <section className="mb-4">
          <span className="inline-flex items-center rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Havenly Premium
          </span>

          <div className="mt-4 grid items-start gap-8 lg:grid-cols-[2fr,1.3fr]">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Upgrade to deeper, calmer insights.
              </h1>

              <p className="mt-4 text-sm text-white/75 sm:text-base max-w-xl">
                The free version of Havenly gives you a quiet page to write a
                few honest sentences. Premium goes a step further—helping you
                see emotional patterns over time, understand what quietly
                supports you, and feel less alone with what you are carrying.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={alreadyUpgraded ? undefined : handleUpgrade}
                  disabled={loading || alreadyUpgraded}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {alreadyUpgraded
                    ? "You’re already on Premium"
                    : loading
                    ? "Processing…"
                    : "Upgrade to Premium – $25/month"}
                </button>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
                >
                  Keep exploring for now
                </Link>
              </div>

              <p className="mt-3 text-xs text-white/55">
                Premium is intentionally priced around{" "}
                <span className="font-semibold text-emerald-300">
                  $25/month
                </span>
                . If roughly 200 people find it helpful, that sustains about{" "}
                <span className="font-semibold text-emerald-300">
                  $5,000 MRR
                </span>{" "}
                and keeps Havenly focused on users, not ads.
              </p>
            </div>

            {/* Price summary / benefits snapshot */}
            <aside className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/60">
              <p className="text-sm font-semibold text-emerald-300">
                Premium at a glance
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">
                $25
                <span className="text-base font-normal text-white/70">
                  /month
                </span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {premiumBenefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-white/60">
                Cancel anytime. Your entries stay in your account, even if you
                move back to the Free plan.
              </p>
            </aside>
          </div>
        </section>

        {/* COMPARE FREE VS PREMIUM */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">
            What’s different about Premium?
          </h2>
          <p className="mt-2 text-sm text-white/75">
            You keep everything you already have in Free. Premium simply adds
            more depth and context—especially over weeks and months.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-white/60">
                  <th className="px-4 py-2">Feature</th>
                  <th className="px-4 py-2">Free</th>
                  <th className="px-4 py-2 text-emerald-300">Premium</th>
                </tr>
              </thead>
              <tbody>
                {freeVsPremiumRows.map((row) => (
                  <tr
                    key={row.label}
                    className="rounded-xl bg-slate-950/80 text-white/80"
                  >
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3 text-white/60">{row.free}</td>
                    <td className="px-4 py-3 text-emerald-300 font-medium">
                      {row.premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="mb-6 grid gap-8 lg:grid-cols-[1.6fr,1.2fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">
              Who Havenly Premium is for
            </h2>
            <p className="mt-3 text-sm text-white/75 max-w-xl">
              Premium isn’t about squeezing more productivity out of you. It’s
              for people who want a kinder way to track how they’re actually
              doing—and what’s been quietly helping.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {whoItsFor.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-base font-semibold text-white">
              Not ready to upgrade yet?
            </h3>
            <p className="mt-3 text-sm text-white/75">
              That’s completely fine. Havenly’s free version is designed to be
              genuinely useful on its own. You can stay on Free as long as you
              like and only move to Premium if it feels clearly worth it to you.
            </p>
            <p className="mt-3 text-sm text-white/75">
              Come back to this page any time from{" "}
              <span className="font-medium">Settings → Billing</span> if you
              decide you’d like deeper insights later.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={alreadyUpgraded ? undefined : handleUpgrade}
                disabled={loading || alreadyUpgraded}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {alreadyUpgraded
                  ? "You’re already on Premium"
                  : loading
                  ? "Processing…"
                  : "Upgrade now"}
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
              >
                Stay on Free for now
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/55">
              Your entries are never used for ads, and your space remains
              private whether you are on Free or Premium.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
