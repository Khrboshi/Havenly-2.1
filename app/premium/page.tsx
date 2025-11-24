import Link from "next/link";

export const metadata = {
  title: "Havenly Plus – Premium journaling for deeper reflection",
  description:
    "Upgrade to Havenly Plus for richer AI reflections, export options, and advanced wellbeing insights.",
};

export default function PremiumPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-10 py-10">
      {/* Header */}
      <header className="space-y-3">
        <p className="text-xs tracking-[0.18em] text-emerald-300">
          HAVENLY PLUS · COMING SOON
        </p>
        <h1 className="text-3xl font-semibold text-slate-50 md:text-4xl">
          A calmer, deeper version of your day.
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 md:text-base">
          Havenly is free to start. Havenly Plus will offer richer AI
          reflections, more history, and gentle accountability features – built
          for people who want a consistent, private reflection habit.
        </p>
      </header>

      {/* Main grid */}
      <div className="grid gap-6 md:grid-cols-[3fr,2fr]">
        {/* Left: feature cards */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/60 p-4">
            <h2 className="mb-1 text-sm font-semibold text-emerald-300">
              What you get with Havenly Plus
            </h2>
            <ul className="space-y-1.5 text-sm text-slate-200">
              <li>• Longer, more nuanced AI reflections on each entry</li>
              <li>• Unlimited journal history, not just recent entries</li>
              <li>• Export your reflections to PDF or CSV</li>
              <li>• Streaks, gentle reminders, and mood trend insights</li>
              <li>• Priority AI processing when things are busy</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="mb-1 text-sm font-semibold text-slate-100">
              Why a paid option?
            </h3>
            <p className="text-sm text-slate-300">
              A small subscription lets us keep Havenly{" "}
              <span className="font-medium">ad-free</span>, private, and focused
              on slow growth instead of aggressive engagement tricks.
            </p>
          </div>
        </div>

        {/* Right: call to action */}
        <aside className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              get started today
            </p>
            <h2 className="text-lg font-semibold text-slate-50">
              Start free. Decide later.
            </h2>
            <p className="text-sm text-slate-300">
              You can begin with the free version in under a minute. If Havenly
              becomes part of your day, upgrading to Plus will be one click
              away.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <Link
              href="/signup"
              className="flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-300"
            >
              Start free journaling
            </Link>
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-full border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-900/70"
            >
              I already have an account
            </Link>
            <p className="text-[11px] text-slate-500">
              No dark patterns. If we ever ask you to pay, the pricing will be
              clear and simple.
            </p>
          </div>
        </aside>
      </div>

      {/* Privacy reassurance */}
      <div className="border-t border-slate-800 pt-4 text-xs text-slate-400">
        <p>
          Havenly is{" "}
          <span className="font-medium text-slate-200">private by design</span>
          . Your entries are not used to train public models and are never shown
          in a social feed.
          {" "}
          <span className="whitespace-nowrap">
            Read our{" "}
            <Link
              href="/privacy"
              className="text-emerald-300 hover:underline"
            >
              privacy notice
            </Link>
            .
          </span>
        </p>
      </div>
    </section>
  );
}
