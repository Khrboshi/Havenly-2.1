export const dynamic = "force-dynamic";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO */}
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-28 md:flex-row md:items-center">
        {/* Left side – copy */}
        <div className="flex-1 space-y-6">
          <p className="text-xs font-semibold tracking-[0.22em] text-emerald-300">
            HAVENLY 2.1 · EARLY ACCESS
          </p>

          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            A calm space to{" "}
            <span className="text-emerald-300">decompress your day</span>{" "}
            in just a few minutes.
          </h1>

          <p className="max-w-md text-sm text-slate-300 md:text-base">
            Havenly is a private micro-journal. You write a few honest
            sentences, and a gentle AI reflection helps you see your day with
            more clarity and compassion — no pressure, no streaks, and no public
            feed.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/magic-login"
              className="inline-flex items-center rounded-full bg-emerald-300 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-200"
            >
              Start journaling free
            </Link>

            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-emerald-200"
            >
              Log in
            </Link>
          </div>

          <ul className="space-y-1 pt-3 text-xs text-slate-400 md:text-[13px]">
            <li>• Free forever for daily journaling.</li>
            <li>• Premium deeper insights coming soon — optional upgrade.</li>
            <li>• Your entries stay private — no ads, no social profile.</li>
          </ul>
        </div>

        {/* Right side – preview */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-emerald-500/10">
            <div className="mb-4 flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Tonight&apos;s check-in
              </span>
              <span>~3 min</span>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-950/60 p-4">
              <p className="text-xs font-semibold text-slate-100">
                How are you really feeling about today?
              </p>
              <p className="text-xs text-slate-400">
                Write a few sentences about what stood out — conversations,
                small wins, or moments that felt heavy.
              </p>
              <div className="mt-1 rounded-xl border border-dashed border-slate-700 bg-slate-900/80 p-3 text-[11px] text-slate-400">
                “Today was more exhausting than I expected, but there were also
                a couple of small moments that felt good…”
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-slate-900/70 p-4">
              <p className="text-[11px] font-semibold text-emerald-300">
                Gentle reflection (AI-assisted)
              </p>
              <p className="text-xs text-slate-300">
                It sounds like you carried a lot today and still made space for
                small wins. What would it look like to acknowledge those wins,
                instead of only what&apos;s left undone?
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span>No streaks · No “shoulds” · Just one honest check-in</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-xs font-semibold tracking-[0.22em] text-emerald-300">
          HOW HAVENLY WORKS
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-900 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold text-emerald-300">1 · CHECK IN</p>
            <p className="mt-2 text-sm text-slate-100">
              Once a day (or whenever you like), you answer a prompt and jot down
              a few honest sentences.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold text-emerald-300">2 · REFLECT</p>
            <p className="mt-2 text-sm text-slate-100">
              Havenly’s AI offers a soft reflection — not advice, just a kinder
              angle that helps you see your day with more compassion.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold text-emerald-300">
              3 · NOTICE PATTERNS
            </p>
            <p className="mt-2 text-sm text-slate-100">
              Over time, you begin to see what energizes you, what drains you,
              and what you want to protect or change.
            </p>
          </div>
        </div>
      </section>

      {/* WHY DIFFERENT */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-3 rounded-2xl border border-slate-900 bg-slate-950/80 p-5">
            <h3 className="text-sm font-semibold text-slate-50">
              Built for real life, not perfect habits
            </h3>
            <p className="text-sm text-slate-300">
              Havenly works whether you journal daily or disappear for a week.
              There are no streaks to break, no judgment — just a quiet space
              waiting when you need it.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-900 bg-slate-950/80 p-5">
            <h3 className="text-sm font-semibold text-slate-50">
              A gentle use of AI
            </h3>
            <p className="text-sm text-slate-300">
              The AI mirrors what you write, highlights what seems important,
              and invites kinder questions — without pushing optimization.
            </p>
            <p className="text-xs text-slate-400">
              Your entries are private and not used for ads or training feeds.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA BAND */}
      <section className="border-t border-slate-900 bg-slate-950/90">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-50">
              Ready to give your day a soft landing?
            </p>
            <p className="text-xs text-slate-400 md:text-[13px]">
              Start with one short check-in tonight. You can always delete your
              account later — no commitment and no streak to maintain.
            </p>
          </div>

          <Link
            href="/magic-login"
            className="inline-flex items-center rounded-full bg-emerald-300 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-200"
          >
            Start journaling free
          </Link>
        </div>
      </section>
    </main>
  );
}
