import Link from "next/link";
import PwaInstaller from "./pwa-installer";

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="text-xs font-medium tracking-[0.2em] text-emerald-300/80 uppercase">
              Havenly 2.1 · Early Access
            </p>

            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
              A calm space to{" "}
              <span className="text-emerald-400">understand your day</span> in
              just a few minutes.
            </h1>

            <p className="mt-4 max-w-2xl text-balance text-sm leading-relaxed text-slate-300 sm:text-base">
              Havenly is a private micro-journal with gentle AI reflections that
              help you slow down, notice how you’re really doing, and feel a
              little lighter — without pressure, streaks, or judgment.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Start journaling free
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-100/90 hover:border-slate-500 hover:bg-slate-900/60"
              >
                See how it works
              </a>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Free plan includes daily journaling and gentle reflections. Havenly
              Plus with deep insights is coming soon.
            </p>

            {/* Reflection card */}
            <div className="mt-10 w-full max-w-3xl rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/8 via-slate-900 to-slate-950 px-5 py-5 text-left shadow-[0_0_50px_rgba(16,185,129,0.25)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                Today’s gentle reflection
              </p>
              <p className="mt-2 text-sm text-slate-100">
                “It sounds like today has been a lot to carry. What felt even a
                little lighter, and what helped you get through it?”
              </p>
              <p className="mt-3 text-[11px] text-slate-400">
                Private · AI-assisted · No tracking · No public feed
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="px-4 pb-16 sm:px-6 md:pb-20 lg:pb-24"
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
              How Havenly works
            </p>

            {/* Mobile: horizontal scroll · Desktop: 3-column grid */}
            <div className="mt-6 -mx-4 flex gap-4 overflow-x-auto pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
              <article className="min-w-[260px] flex-1 rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-800 md:min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
                  1 — Check in
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-50">
                  A tiny honest pause.
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Once a day (or whenever you like), you answer a gentle prompt
                  and jot down a few honest sentences about how you’re really
                  doing.
                </p>
              </article>

              <article className="min-w-[260px] flex-1 rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-800 md:min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
                  2 — Reflect
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-50">
                  Gentle AI reflections.
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Havenly reflects back what matters most in your writing —
                  softly, like a kind friend — so you can see your day with more
                  compassion.
                </p>
              </article>

              <article className="min-w-[260px] flex-1 rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-800 md:min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
                  3 — Notice patterns
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-50">
                  See what keeps showing up.
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Over time, your reflections help you notice what energises
                  you, what drains you, and what you want to protect or change —
                  with deeper insights coming in Havenly Plus.
                </p>
              </article>
            </div>

            {/* Supportive copy */}
            <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-12">
              <div>
                <h2 className="text-lg font-semibold text-slate-50">
                  Built for real life, not perfect habits.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Havenly works on your tired days, rushed mornings, quiet
                  moments, and everything in between. There are no streaks to
                  break, no public feed, and nothing to perform.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  A few minutes of honest writing — even once in a while — is
                  enough to start feeling different about your day.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-50">
                  A gentle use of AI you can trust.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  No optimisation. No coaching. No judgment. The AI simply
                  listens to what you wrote, highlights what seems important,
                  and invites kinder questions — never power ads or algorithms.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Your words stay private and are used only to generate your
                  reflections — never for ads or social feeds.
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 flex justify-center">
              <div className="w-full max-w-2xl rounded-3xl bg-slate-900/80 px-6 py-8 text-center ring-1 ring-slate-800">
                <p className="text-sm font-medium text-slate-100">
                  Ready to try a calmer way to check in with yourself?
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Start with the free plan today. You can upgrade later for deep
                  insights in Havenly Plus.
                </p>
                <div className="mt-5 flex justify-center">
                  <Link
                    href="/magic-login"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-medium text-slate-950 shadow-md shadow-emerald-500/35 transition hover:bg-emerald-400"
                  >
                    Start journaling free
                  </Link>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Prefer to read more first?{" "}
                  <Link
                    href="/blog"
                    className="font-medium text-emerald-300 hover:text-emerald-200"
                  >
                    Explore the Havenly Journal →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* PWA onboarding & service worker registration */}
      <PwaInstaller />
    </>
  );
}
