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
            more clarity and compassion — no pressure, no streaks, and no
            public feed.
          </p>

          {/* Primary CTA only (no extra login link here) */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/magic-login"
              className="inline-flex items-center rounded-full bg-emerald-300 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-200"
            >
              Start journaling free
            </Link>
          </div>

          <ul className="space-y-1 pt-3 text-xs text-slate-400 md:text-[13px]">
            <li>• Free forever for daily journaling.</li>
            <li>• Premium deeper insights coming soon — optional upgrade.</li>
            <li>• Your entries stay private — no ads, no social profile.</li>
          </ul>

          {/* Mobile “Add to phone” hint – hidden by default, revealed via script */}
          <div
            data-install-hint
            className="mt-4 hidden max-w-sm rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs text-emerald-200"
          >
            Using your phone? Add Havenly to your home screen for faster
            check-ins — open it like an app, without browser tabs.
          </div>
        </div>

        {/* Right side – preview card (no external image required) */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-emerald-500/10">
            <div className="mb-4 flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Today&apos;s check-in
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
              Once a day (or whenever you like), you answer a gentle prompt and
              jot down a few honest sentences.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold text-emerald-300">2 · REFLECT</p>
            <p className="mt-2 text-sm text-slate-100">
              Havenly&apos;s AI offers a soft reflection — not advice, just a
              kinder angle that helps you see your day with more compassion.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold text-emerald-300">
              3 · NOTICE PATTERNS
            </p>
            <p className="mt-2 text-sm text-slate-100">
              Over time, you begin to see what energises you, what drains you,
              and what you want to protect or change.
            </p>
          </div>
        </div>
      </section>

      {/* WHY IT FEELS DIFFERENT */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-3 rounded-2xl border border-slate-900 bg-slate-950/80 p-5">
            <h3 className="text-sm font-semibold text-slate-50">
              Built for real life, not perfect habits
            </h3>
            <p className="text-sm text-slate-300">
              Havenly is designed for the nights you open your laptop feeling
              tired, the mornings when you have three minutes before a meeting,
              and the days you don&apos;t have energy for a big routine.
            </p>
            <p className="text-sm text-slate-300">
              You can disappear for a week and come back without guilt. There
              are no streaks to break, no charts judging you — just a quiet
              space waiting when you need it.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-900 bg-slate-950/80 p-5">
            <h3 className="text-sm font-semibold text-slate-50">
              A gentle use of AI
            </h3>
            <p className="text-sm text-slate-300">
              The AI here isn&apos;t trying to optimise you or tell you how to
              live. It mirrors what you write, highlights what seems important,
              and invites kinder questions.
            </p>
            <p className="text-xs text-slate-400">
              Your text stays private and is used only to generate your
              reflections — not to train ads or social feeds.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL TEXT-ONLY BAND (no extra CTA button to avoid duplicates) */}
      <section className="border-t border-slate-900 bg-slate-950/90">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-xs text-slate-400 md:text-[13px]">
            Start whenever you&apos;re ready. Havenly will be here for your next
            check-in — whether that&apos;s tonight, tomorrow, or next week.
          </p>
        </div>
      </section>

      {/* Mobile detection script for install hint */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              try {
                var ua = navigator.userAgent || "";
                var isMobile = /iPhone|iPad|iPod|Android/i.test(ua) || (navigator.maxTouchPoints || 0) > 1;
                var isStandalone =
                  window.matchMedia("(display-mode: standalone)").matches ||
                  window.navigator.standalone === true;

                if (isMobile && !isStandalone) {
                  var el = document.querySelector("[data-install-hint]");
                  if (el) el.classList.remove("hidden");
                }
              } catch (e) {
                // fail silently
              }
            })();
          `,
        }}
      />
    </main>
  );
}
