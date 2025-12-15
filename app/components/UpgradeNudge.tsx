import Link from "next/link";

/**
 * UpgradeNudge
 *
 * Purpose:
 * - Calm, value-based Premium reminder
 * - No blocking, no pressure, no popups
 * - Designed to appear inside Dashboard or tools
 *
 * Usage:
 * <UpgradeNudge />
 */

export default function UpgradeNudge() {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
      <h3 className="mb-2 text-sm font-semibold text-emerald-300">
        Seeing patterns takes time
      </h3>

      <p className="mb-4 text-sm text-slate-300">
        As you keep writing, Havenly begins to surface recurring themes and
        emotional patterns. Premium adds gentle timelines and deeper summaries
        that help those patterns become clearer — without asking you to do
        more.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/upgrade"
          className="rounded-full bg-emerald-400 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
        >
          Explore Premium
        </Link>

        <span className="text-xs text-slate-400">
          No pressure. Free works fully on its own.
        </span>
      </div>
    </div>
  );
}
