import Link from "next/link";
import PreviewInsightsLink from "./PreviewInsightsLink";
import UpgradeClient from "./UpgradeClient";

export const metadata = {
  title: "Premium | Havenly",
};

export default function UpgradePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-20 text-slate-200">
      {/* Client-only tracker (keep) */}
      <UpgradeClient />

      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">Premium</h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Your journal stays calm and private. Premium adds gentle pattern-clarity
          across time — so you can understand what repeats, what shifts, and what helps.
        </p>
      </header>

      {/* “Curiosity gap” preview card */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h2 className="text-base font-semibold text-slate-100">
                A pattern is waiting to be revealed
              </h2>
            </div>

            <p className="max-w-2xl text-sm text-slate-400">
              Based on your recent check-ins, there may be a recurring theme around{" "}
              <span className="blur-sm bg-white/10 px-1 rounded text-transparent select-none">
                energy drains
              </span>{" "}
              that quietly affects your mood. Premium helps you see the full pattern —
              gently, without judgment.
            </p>

            <p className="text-xs text-slate-500">
              Preview only. You’ll always be able to write freely.
            </p>
          </div>

          <PreviewInsightsLink />
        </div>
      </section>

      {/* Plan cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">Free</h3>
          <p className="mt-1 text-sm text-slate-400">
            A calm journaling space with occasional reflection previews.
          </p>

          <ul className="mt-5 space-y-2 text-sm text-slate-300">
            <li>• Write anytime (always available)</li>
            <li>• Gentle prompts to begin</li>
            <li>• Your entries stay private</li>
            <li>• Simple weekly progress snapshot</li>
          </ul>

          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-white/5 px-5 py-2.5 text-sm font-semibold text-white border border-white/10 hover:bg-white/10"
            >
              Continue on Free
            </Link>
          </div>
        </div>

        {/* Premium (coming soon) */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Premium</h3>
              <p className="mt-1 text-sm text-slate-300">
                Understand your patterns. Keep your space calm.
              </p>
            </div>

            <span className="rounded-full border border-emerald-500/30 bg-slate-950/30 px-3 py-1 text-xs text-emerald-200">
              Coming soon
            </span>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-200">
            <li>• Pattern clarity across time</li>
            <li>• Deeper reflections when you want them</li>
            <li>• Weekly & monthly summaries</li>
            <li>• “Why does this keep happening?” insights</li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-emerald-500/60 px-5 py-2.5 text-sm font-semibold text-slate-950 opacity-60"
            >
              Premium (coming soon)
            </button>

            <PreviewInsightsLink />
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Payments are temporarily disabled while we finalize stability. You can still
            preview Premium insights.
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Keep <span className="text-slate-300">Insights preview</span> as the main upgrade
        teaser while checkout is disabled.
      </div>
    </main>
  );
}
