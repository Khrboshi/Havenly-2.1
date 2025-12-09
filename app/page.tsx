import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* HERO */}
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-6 pb-20 pt-24 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <p className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-medium text-emerald-300">
            A calmer way to keep up with yourself
          </p>

          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A quiet place to write. <br />
            A kinder way to see the patterns.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            Havenly is a private journaling space with gentle AI reflections.
            Write a few honest lines, and Havenly softly highlights what has
            been weighing on you, sustaining you, or quietly changing over
            time—without pressure, productivity scores, or judgment.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/magic-login"
              className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-300"
            >
              Start free
            </Link>
            <Link
              href="/upgrade"
              className="rounded-full border border-slate-700 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
            >
              Explore Premium
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            No credit card required to start. Upgrade only if Premium clearly
            feels valuable for you.
          </p>
        </div>

        {/* “TODAY'S CHECK-IN” CARD */}
        <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Today&apos;s check-in
            </span>
            <span className="text-slate-500">Light AI reflections on Free</span>
          </div>

          <div className="mt-4 rounded-xl bg-slate-900/80 p-4 text-sm text-slate-300">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              What you write
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              “Today was heavy. I got through my tasks, but I felt disconnected
              and tired. I kept scrolling instead of actually resting.”
            </p>
          </div>

          <div className="mt-4 rounded-xl bg-emerald-500/5 p-4 text-sm text-slate-200">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
              Havenly reflects back
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              It sounds like your mind is carrying more than your day allowed
              space for. The exhaustion isn&apos;t a failure—it&apos;s emotional
              backlog. A small win would be giving yourself permission to rest
              without justifying it.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
            <p className="font-semibold text-slate-200">
              Over a week, Premium might show:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• Evenings where you feel most drained.</li>
              <li>• People or tasks that consistently leave you calmer.</li>
              <li>
                • How your emotional load actually shifts across the week.
              </li>
            </ul>
            <p className="mt-3 text-[0.7rem] text-slate-500">
              Premium adds deeper timelines, themes, and context. Free already
              includes private, encrypted journaling and light insights.
            </p>
          </div>
        </div>
      </section>

      {/* HOW HAVENLY FITS INTO A TIRED WEEK */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)]">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              How Havenly fits into a tired week
            </h2>
            <p className="mt-3 text-sm text-slate-300 max-w-xl">
              Havenly is designed for real, overloaded humans—not perfect
              routines. You don&apos;t need to write every day for it to help.
            </p>

            <ol className="mt-6 space-y-4 text-sm text-slate-200">
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-300">
                  1
                </span>
                <div>
                  <p className="font-semibold">Drop a few honest lines.</p>
                  <p className="mt-1 text-slate-300">
                    When something feels heavy, confusing, or surprisingly good,
                    you open Havenly and write what actually happened—in your
                    own words, without trying to be impressive.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-300">
                  2
                </span>
                <div>
                  <p className="font-semibold">
                    Havenly gently reflects back what mattered.
                  </p>
                  <p className="mt-1 text-slate-300">
                    Soft, non-judgmental summaries help you notice emotional
                    load, recurring thoughts, and quiet wins that your brain
                    normally rushes past.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-300">
                  3
                </span>
                <div>
                  <p className="font-semibold">
                    Over time, patterns start to feel clearer.
                  </p>
                  <p className="mt-1 text-slate-300">
                    Premium layers in timelines, themes, and deeper context so
                    you can see what has actually been supporting you—and what
                    has been quietly draining you.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* DESIGNED FOR TIRED HUMANS CARD */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-sm text-slate-200">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Designed for tired humans
            </h3>
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>• You can write once a day, once a week, or once a month.</li>
              <li>
                • Havenly meets you where you are—no streaks, no productivity
                score, no follower count.
              </li>
              <li>
                • Entries are private by default. No feeds, no comments, no
                public posting.
              </li>
              <li>
                • The goal isn&apos;t optimization—it&apos;s emotional clarity
                and self-compassion.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* HAVENLY IS FOR YOU IF… */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-lg font-semibold">Havenly is for you if…</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
            <h3 className="text-sm font-semibold text-slate-100">
              Your brain feels full, even on quiet days.
            </h3>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm">
              You&apos;re carrying mental load that doesn&apos;t fit into a
              to-do list. You want somewhere calm to put it.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
            <h3 className="text-sm font-semibold text-slate-100">
              You&apos;ve tried journaling, but it never sticks.
            </h3>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm">
              Traditional journaling feels too big or precious. Havenly is built
              for short, imperfect check-ins that still add up to something
              meaningful.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
            <h3 className="text-sm font-semibold text-slate-100">
              You&apos;re curious about patterns, not perfection.
            </h3>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm">
              You want to see how your days are really going over time—without
              being judged or scored by a productivity metric.
            </p>
          </div>
        </div>
      </section>

      {/* NEW SECTION: WHY PEOPLE CHOOSE PREMIUM */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/3 p-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Why people stay for Premium
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Premium isn&apos;t about doing more. It&apos;s about finally being
              able to see what&apos;s actually happening in your life—so your
              energy goes where it matters.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-slate-200">
              <li>• Weekly and monthly emotional timelines.</li>
              <li>• Richer themes across work, relationships, and rest.</li>
              <li>• Deeper AI reflections on what&apos;s been sustaining you.</li>
              <li>• Higher credit balance for unlimited, gentle check-ins.</li>
            </ul>

            <p className="mt-5 text-xs text-slate-400">
              If 1–2 calmer decisions a week are worth more than{" "}
              <span className="font-semibold text-slate-200">$25/month</span>,
              Premium pays for itself in emotional energy very quickly.
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Premium at a glance
              </p>
              <p className="mt-3 text-3xl font-semibold text-emerald-200">
                $25
                <span className="text-base font-normal text-slate-400">
                  /month
                </span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>• Deeper AI reflections that go beyond one entry.</li>
                <li>• Emotional timelines that highlight hidden patterns.</li>
                <li>• Higher monthly credit balance for unlimited usage.</li>
                <li>• Priority access to new reflection tools.</li>
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                Cancel anytime. Your entries always remain in your account.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/upgrade"
                className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-300"
              >
                See Premium details
              </Link>
              <Link
                href="/magic-login"
                className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
              >
                Start with Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REASSURANCE / TRUST SECTION (NO EXTRA FOOTER) */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Private by design
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              Entries are tied only to your account. No public feed, no
              followers, no social sharing by default.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Gentle, not optimizing
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              Havenly is built for emotional clarity, not productivity hacks.
              You&apos;re not a project—you&apos;re a person.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Clear, fair pricing
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              Free is fully usable. Premium is there if deeper insights, higher
              credits, and pattern timelines clearly help you—and are worth{" "}
              <span className="font-semibold text-slate-100">$25/month</span>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
