// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-6 pt-28 pb-24">
        {/* ================= HERO ================= */}
        <section className="grid items-center gap-12 md:grid-cols-[1.25fr,1fr]">
          {/* Left: message + CTAs */}
          <div>
            <p className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-200">
              A calmer way to keep up with yourself
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              A quiet place to write.
              <br />
              A kinder way to see the patterns.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
              Havenly is a private journaling space with gentle AI reflections.
              Write a few honest lines, and Havenly softly highlights what has
              been weighing on you, sustaining you, or quietly changing over
              time &mdash; without pressure or productivity noise.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
              >
                Start free
              </Link>

              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900"
              >
                Explore Premium
              </Link>
            </div>

            <p className="mt-3 max-w-sm text-xs text-slate-400">
              No credit card required to start. Upgrade only if Premium feels
              clearly valuable for you.
            </p>
          </div>

          {/* Right: calm preview card */}
          <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
            <p className="text-xs font-medium tracking-wide text-emerald-300">
              Tonight&apos;s check-in
            </p>

            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <p className="rounded-2xl bg-slate-900/80 p-4 text-slate-200">
                &ldquo;Today was heavy. I got through my tasks, but I felt
                disconnected and tired. I kept scrolling instead of resting.&rdquo;
              </p>

              <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Havenly reflects back
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-200">
                  It sounds like your mind is carrying more than your day
                  allowed space for. The exhaustion isn&apos;t a failure &mdash;
                  it&apos;s emotional backlog. A small win would be giving
                  yourself permission to rest without justifying it.
                </p>
              </div>

              <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-[11px] leading-relaxed text-slate-300">
                <p className="font-semibold text-slate-100">
                  A week in Premium might show:
                </p>
                <p className="mt-1">
                  • Evenings where you feel most drained. <br />
                  • People and tasks that consistently leave you calmer. <br />
                  • How your emotional load actually shifts across the week.
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Private, encrypted journaling</span>
                <span>Light AI reflections on Free</span>
              </div>
            </div>
          </aside>
        </section>

        {/* ============== HOW IT WORKS ============== */}
        <section className="mt-20 grid items-start gap-10 md:grid-cols-[1.4fr,1fr]">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              How Havenly fits into a tired week
            </h2>
            <p className="mt-3 max-w-xl text-sm text-slate-300">
              Havenly is designed for real, overloaded humans &mdash; not
              perfect routines. You don&apos;t need to write every day for it to
              help.
            </p>

            <ol className="mt-6 space-y-5 text-sm text-slate-200">
              <li className="flex gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-300">
                  1
                </div>
                <div>
                  <p className="font-medium">Drop a few honest lines.</p>
                  <p className="mt-1 text-slate-400">
                    When something feels heavy, confusing, or surprisingly
                    good, you open Havenly and write what actually happened &mdash;
                    in your own words, without trying to be impressive.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-300">
                  2
                </div>
                <div>
                  <p className="font-medium">
                    Havenly gently reflects back what mattered.
                  </p>
                  <p className="mt-1 text-slate-400">
                    Soft, non-judgmental summaries help you notice themes,
                    emotional load, and quiet wins that your brain normally
                    rushes past.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-300">
                  3
                </div>
                <div>
                  <p className="font-medium">
                    Over time, patterns start to feel clearer.
                  </p>
                  <p className="mt-1 text-slate-400">
                    Premium layers in timelines, recurring themes, and gentle
                    insights so you can see what&apos;s actually been
                    supporting you &mdash; and what&apos;s been draining you.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-xs text-slate-300">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
              Designed for tired humans
            </p>
            <p>
              • You can write once a day, once a week, or whenever you have
              capacity. Havenly meets you where you are.
            </p>
            <p>
              • Entries are private by default. No feeds, no followers, no
              public posting.
            </p>
            <p>
              • The goal is not productivity &mdash; it&apos;s emotional clarity
              and self-compassion.
            </p>
          </div>
        </section>

        {/* ============== WHO IT'S FOR ============== */}
        <section className="mt-20">
          <h2 className="text-lg font-semibold text-slate-50">
            Havenly is for you if…
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="font-medium text-slate-100">
                Your brain feels full, even on quiet days.
              </p>
              <p className="mt-2 text-slate-400">
                You&apos;re carrying mental load that doesn&apos;t fit into a
                to-do list. You want somewhere calm to put it.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="font-medium text-slate-100">
                You&apos;ve tried journaling, but it never sticks.
              </p>
              <p className="mt-2 text-slate-400">
                Traditional journaling feels too big or precious. Havenly is
                built for short, imperfect check-ins.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="font-medium text-slate-100">
                You&apos;re curious about patterns, not perfection.
              </p>
              <p className="mt-2 text-slate-400">
                You want to see how your days are really going over time &mdash;
                without being judged or quantified as a productivity score.
              </p>
            </div>
          </div>
        </section>

        {/* ============== SIMPLE PRICING SUMMARY ============== */}
        <section className="mt-20 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <div className="grid items-center gap-8 md:grid-cols-[1.4fr,1fr]">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">
                Start free. Upgrade only if it clearly helps.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-slate-300">
                The Free plan gives you private journaling and light AI
                reflections. Havenly Premium adds deeper insights, emotional
                timelines, and a higher credit balance for rich, unlimited
                reflections.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>• Free: quiet journaling with gentle summaries.</li>
                <li>• Premium: deeper analysis, patterns, and emotional themes.</li>
                <li>
                  • Cancel anytime. Your entries always remain in your account.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-slate-900/80 p-5 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Premium at a glance
              </p>
              <p className="mt-3 text-3xl font-semibold text-emerald-300">
                $25
                <span className="text-base font-normal text-slate-200">
                  /month
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-300">
                For deeper emotional clarity, gentler self-talk, and a richer
                reflection space.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/upgrade"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                >
                  See Premium details
                </Link>
                <Link
                  href="/magic-login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2.5 text-sm text-slate-100 hover:bg-slate-900"
                >
                  Start with Free
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {currentYear} Havenly 2.1. All rights reserved.</p>
          <Link
            href="/privacy"
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
