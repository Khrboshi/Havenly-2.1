// app/upgrade/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserPlan } from "@/app/components/useUserPlan";

const PREMIUM_FEATURES = [
  "Deeper AI reflections that gently highlight what mattered most in your week.",
  "Timelines of emotional patterns, themes, and recurring worries.",
  "Richer context across multiple entries, not just single moments.",
  "Higher monthly credit balance so you can reflect without counting uses.",
];

const COMPARISON_ROWS = [
  {
    label: "Private journaling",
    free: "Included",
    premium: "Included",
  },
  {
    label: "AI reflections",
    free: "Light snapshots",
    premium: "Deeper, more nuanced insights",
  },
  {
    label: "Patterns & timelines",
    free: "Not included",
    premium: "Included",
  },
  {
    label: "Monthly emotional recap",
    free: "Not included",
    premium: "Included",
  },
  {
    label: "Credit balance",
    free: "Limited",
    premium: "Higher balance",
  },
];

const WHO_IT_IS_FOR = [
  "People who feel mentally overloaded and want a calm place to put what they’re carrying.",
  "Journalers who wish they could actually see patterns in how their days are going.",
  "Those who prefer gentle reflection instead of productivity hacks and performance tips.",
  "Anyone who wants deeper emotional clarity without sharing their writing with other people.",
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
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        {/* Alerts */}
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

        {/* =============== HERO & PRICE =============== */}
        <section>
          <p className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
            Havenly Premium
          </p>

          <div className="mt-5 grid items-start gap-10 lg:grid-cols-[1.7fr,1.1fr]">
            {/* Left: Story */}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Upgrade to deeper, calmer insights.
              </h1>

              <p className="mt-4 max-w-xl text-sm text-slate-200">
                The free version of Havenly gives you a quiet place to be
                honest. Premium adds deeper, AI-powered reflections that look
                across your entries, gently revealing patterns in your energy,
                emotions, and needs over time.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-slate-100">
                {PREMIUM_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  onClick={alreadyUpgraded ? undefined : handleUpgrade}
                  disabled={loading || alreadyUpgraded}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {alreadyUpgraded
                    ? "You’re already on Premium"
                    : loading
                    ? "Processing…"
                    : "Upgrade to Premium – $25/month"}
                </button>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-900"
                >
                  Keep exploring first
                </Link>
              </div>

              <p className="mt-3 text-xs text-slate-400 max-w-sm">
                Premium helps support ongoing improvements to Havenly and keeps
                your reflection space private, calm, and completely free from
                ads or social feeds.
              </p>
            </div>

            {/* Right: Price card */}
            <aside className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-500/15 via-slate-900/90 to-slate-950/90 p-6 shadow-[0_22px_70px_rgba(16,185,129,0.35)]">
              <p className="text-sm font-semibold text-emerald-200">
                Premium at a glance
              </p>

              <p className="mt-4 text-4xl font-semibold text-emerald-300">
                $25
                <span className="text-base font-normal text-slate-100">
                  /month
                </span>
              </p>

              <p className="mt-2 text-xs text-slate-200">
                For deeper emotional clarity, timelines, and richer AI
                reflections across your entries.
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-100">
                <p>• Cancel anytime. Your entries always remain in your account.</p>
                <p>• No ads, no selling your data, no public feed.</p>
                <p>
                  • Ideal if you&apos;re using Havenly as an ongoing emotional
                  check-in, not just a one-time experiment.
                </p>
              </div>

              <button
                onClick={alreadyUpgraded ? undefined : handleUpgrade}
                disabled={loading || alreadyUpgraded}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {alreadyUpgraded
                  ? "Manage your Premium space"
                  : loading
                  ? "Processing…"
                  : "Upgrade now"}
              </button>

              <Link
                href="/settings/billing"
                className="mt-3 block text-center text-xs font-medium text-emerald-200 hover:text-emerald-100"
              >
                View billing & usage →
              </Link>
            </aside>
          </div>
        </section>

        {/* =============== FREE VS PREMIUM =============== */}
        <section className="mt-16 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <h2 className="text-lg font-semibold text-slate-50">
            What actually changes with Premium?
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-xl">
            You keep everything you already have in the Free plan. Premium
            doesn&apos;t add pressure &mdash; it adds depth, context, and a
            clearer view of your emotional patterns.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-2">Feature</th>
                  <th className="px-4 py-2">Free</th>
                  <th className="px-4 py-2 text-emerald-300">Premium</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr
                    key={row.label}
                    className="rounded-2xl bg-slate-900/80 text-slate-100"
                  >
                    <td className="px-4 py-3 text-slate-200">{row.label}</td>
                    <td className="px-4 py-3 text-slate-400">{row.free}</td>
                    <td className="px-4 py-3 text-emerald-300 font-medium">
                      {row.premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* =============== WHO IT'S FOR / NOT READY =============== */}
        <section className="mb-4 mt-16 grid gap-8 lg:grid-cols-[1.6fr,1.2fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-lg font-semibold text-slate-50">
              Who Havenly Premium is for
            </h2>
            <p className="mt-3 text-sm text-slate-300 max-w-xl">
              Premium is for people who know their emotional world is busy and
              want a quieter way to understand it.
            </p>

            <ul className="mt-4 space-y-3 text-sm text-slate-100">
              {WHO_IT_IS_FOR.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h3 className="text-base font-semibold text-slate-50">
              Not sure yet? Stay on Free as long as you like.
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              The Free plan is intentionally usable on its own. You can journal
              privately, receive light reflections, and decide later whether
              deeper insights would actually help.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={alreadyUpgraded ? undefined : handleUpgrade}
                disabled={loading || alreadyUpgraded}
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {alreadyUpgraded
                  ? "You’re already on Premium"
                  : loading
                  ? "Processing…"
                  : "Upgrade when you’re ready"}
              </button>

              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-900"
              >
                Keep using Free for now
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Your entries remain private and are never used for advertising,
              whether you&apos;re on Free or Premium.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
