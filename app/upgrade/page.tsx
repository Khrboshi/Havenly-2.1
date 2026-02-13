import Link from "next/link";
import UpgradeIntentTracker from "@/app/components/UpgradeIntentTracker";

export const metadata = {
  title: "Premium — Coming Soon | Havenly",
};

export default function UpgradePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-20 text-slate-200">
      {/* Track that the user opened the upgrade page */}
      <UpgradeIntentTracker source="upgrade-page" />

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">Premium</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Premium is coming soon. For now, we’re focusing on stability and quality so the
          experience feels solid before we turn on payments.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
          <h2 className="text-lg font-semibold text-white">Free</h2>
          <p className="mt-1 text-sm text-slate-400">
            A calm journaling flow with a limited number of AI reflections.
          </p>

          <ul className="mt-5 space-y-2 text-sm text-slate-300">
            <li>• Journal entries</li>
            <li>• Monthly reflection credits</li>
            <li>• Gentle, structured reflections</li>
            <li>• Tools & dashboard access</li>
          </ul>

          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Continue on Free
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Premium</h2>
              <p className="mt-1 text-sm text-slate-300">
                Deeper reflections + insights over time.
              </p>
            </div>

            <span className="rounded-full border border-emerald-500/30 bg-slate-950/30 px-3 py-1 text-xs text-emerald-200">
              Coming soon
            </span>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-200">
            <li>• Unlimited reflections</li>
            <li>• Higher-depth reflection model</li>
            <li>• Insights & patterns across time</li>
            <li>• Weekly and monthly summaries</li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              disabled
              className="inline-flex items-center justify-center rounded-full bg-emerald-500/60 px-5 py-2.5 text-sm font-semibold text-slate-950 opacity-60 cursor-not-allowed"
            >
              Premium (coming soon)
            </button>

            <Link
              href="/insights/preview?from=upgrade"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-900/60"
            >
              Preview Premium insights
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            You can keep using Havenly fully on Free while Premium is being finalized.
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Keep the <span className="text-slate-300">Insights</span> preview as the main
        “upgrade teaser” while checkout is disabled.
      </div>
    </main>
  );
}
