import Link from "next/link";

type Props = {
  credits?: number | null;
  variant?: "default" | "credits";
};

export default function UpgradeNudge({ credits = null, variant = "default" }: Props) {
  const showCredits = variant === "credits" && typeof credits === "number";

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
      <h3 className="mb-2 text-sm font-semibold text-emerald-300">
        {showCredits ? "You’re close to the edge of your free credits" : "Seeing patterns takes time"}
      </h3>

      <p className="mb-4 text-sm text-slate-300">
        {showCredits ? (
          <>
            You have{" "}
            <span className="font-semibold text-slate-100">
              {credits}
            </span>{" "}
            credits left. Premium adds deeper multi-entry reflections and calmer summaries so your
            patterns become clearer—without asking you to do more.
          </>
        ) : (
          <>
            As you keep writing, Havenly begins to surface recurring themes and emotional patterns.
            Premium adds gentle timelines and deeper summaries that help those patterns become clearer
            — without extra effort.
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/upgrade"
          className="rounded-full bg-emerald-400 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
        >
          Explore Premium
        </Link>

        <span className="text-xs text-slate-400">
          No pressure. Free remains fully usable.
        </span>
      </div>
    </div>
  );
}
