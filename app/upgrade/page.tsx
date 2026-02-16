import Link from "next/link";
import PreviewInsightsLink from "./PreviewInsightsLink";
import UpgradeClient from "./UpgradeClient";

export const metadata = {
  title: "Premium | Havenly",
};

export default function UpgradePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-20 text-slate-200">
      <UpgradeClient />

      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">Premium</h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Havenly stays calm and private. Premium adds gentle clarity across
          time — helping you understand what repeats, what shifts, and what helps.
        </p>
      </header>

      {/* Curiosity Insight Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h3 className="font-medium text-slate-100">
                A pattern is waiting to be revealed
              </h3>
            </div>

            <p className="max-w-xl text-sm text-slate-400">
              Based on your recent check-ins, Havenly may begin noticing
              recurring emotional themes — gently, without judgment.
            </p>
          </div>

          <PreviewInsightsLink />
        </div>
      </div>

      {/* Plan comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* FREE */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Free</h2>
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
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Continue on Free
            </Link>
          </div>
        </div>

        {/* PREMIUM */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold text-white">Premium</h2>
            <span className="rounded-full border border-emerald-500/30 px-3 py-1 text-xs text-emerald-200">
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
              className="cursor-not-allowed rounded-full bg-emerald-500/60 px-5 py-2.5 text-sm font-semibold text-slate-950 opacity-60"
            >
              Premium (coming soon)
            </button>

            <PreviewInsightsLink />
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Payments are temporarily disabled while we finalize stability.
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Insight previews are the main upgrade teaser while checkout is disabled.
      </p>
    </main>
  );
}
