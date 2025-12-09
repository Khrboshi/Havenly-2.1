"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserPlan } from "@/app/components/useUserPlan";

const premiumBenefits = [
  "Deeper AI reflections that gently highlight what mattered most in your week.",
  "Timelines of emotional patterns, themes, and recurring worries.",
  "Richer context around your entries—without judgment or pressure.",
  "Priority access to new tools and Premium experiments."
];

const freeVsPremiumRows = [
  { label: "Daily private journaling", free: "Included", premium: "Included" },
  { label: "AI reflections", free: "Light snapshot", premium: "Deep insights" },
  { label: "Pattern timelines", free: "Not included", premium: "Included" },
  { label: "Monthly recap", free: "Not included", premium: "Included" },
  { label: "Credits", free: "Limited", premium: "Higher balance" }
];

const whoItsFor = [
  "People who feel mentally overloaded and want calm check-ins.",
  "Anyone who journals but wants clearer patterns.",
  "Those who prefer gentle reflection instead of productivity pressure.",
  "People who want the deeper Havenly experience."
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
        body: JSON.stringify({ plan: "premium" })
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
      setUpgradeError("Unable to complete the upgrade now. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl flex flex-col gap-8">
        {loginRequired && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Please sign in first using the{" "}
            <Link href="/magic-login" className="font-semibold underline underline-offset-2">
              magic link
            </Link>
            .
          </div>
        )}

        {upgradeError && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {upgradeError}
          </div>
        )}

        {/* HERO */}
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
                Premium adds deeper reflections that help you understand what’s been happening
                over time—without pressure, judgment, or productivity noise.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={alreadyUpgraded ? undefined : handleUpgrade}
                  disabled={loading || alreadyUpgraded}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
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
                  Keep exploring
                </Link>
              </div>

              <p className="mt-3 text-xs text-white/55 max-w-sm">
                Premium keeps Havenly calm, private, and fully ad-free.
              </p>
            </div>

            {/* Price summary */}
            <aside className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/60">
              <p className="text-sm font-semibold text-emerald-300">Premium at a glance</p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">
                $25<span className="text-base font-normal text-white/70">/month</span>
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
                Cancel anytime. Your entries stay in your account.
              </p>
            </aside>
          </div>
        </section>

        {/* FREE VS PREMIUM */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">What’s different?</h2>
          <p className="mt-2 text-sm text-white/75">
            You keep everything in Free. Premium just adds more depth and clarity.
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
                  <tr key={row.label} className="rounded-xl bg-slate-950/80 text-white/80">
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3 text-white/60">{row.free}</td>
                    <td className="px-4 py-3 text-emerald-300 font-medium">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="mb-6 grid gap-8 lg:grid-cols-[1.6fr,1.2fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">Who Premium is for</h2>
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
            <h3 className="text-base font-semibold text-white">Not ready yet?</h3>
            <p className="mt-3 text-sm text-white/75">
              That’s fine. Free is fully usable. Upgrade later anytime.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={alreadyUpgraded ? undefined : handleUpgrade}
                disabled={loading || alreadyUpgraded}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
              >
                {alreadyUpgraded
                  ? "You're already Premium"
                  : loading
                  ? "Processing…"
                  : "Upgrade now"}
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
              >
                Stay Free for now
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/55">
              Your entries remain private and safe.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
