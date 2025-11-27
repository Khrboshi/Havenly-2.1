import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative px-4 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="mb-4 text-xs font-medium tracking-[0.25em] text-emerald-300/80 uppercase">
            Havenly 2.1 · Early access
          </p>

          <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-50">
            A calm space to{" "}
            <span className="text-emerald-300">understand your day</span> in
            just a few minutes.
          </h1>

          <p className="mt-4 max-w-2xl text-pretty text-sm sm:text-base text-slate-300/90">
            Havenly is a private micro-journal with gentle AI reflections that
            help you slow down, notice how you&apos;re really doing, and feel a
            little lighter — without pressure, streaks, or judgment.
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/magic-login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition-transform duration-150 hover:translate-y-0.5 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Start journaling free
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/40 px-6 py-2.5 text-sm font-medium text-slate-100/90 shadow-sm transition-colors duration-150 hover:border-slate-400 hover:bg-slate-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              See how it works
            </Link>
          </div>

          {/* Social proof / plan hint */}
          <p className="mt-4 text-xs text-slate-400">
            Free plan includes daily journaling and gentle reflections. Havenly
            Plus with deep insights is coming soon.
          </p>

          {/* Gentle reflection preview card */}
          <div className="mt-10 w-full max-w-xl">
            <div className="rounded-2xl border border-emerald-500/15 bg-slate-900/70 px-5 py-4 text-left shadow-[0_18px_45px_rgba(15,23,42,0.8)] backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-wide text-emerald-300 uppercase">
                Today&apos;s gentle reflection
              </p>
              <p className="mt-3 text-sm text-slate-100">
                “It sounds like today has been a lot to carry. What felt even a
                little lighter, and what helped you get through it?”
              </p>
              <p className="mt-3 text-[11px] text-slate-400">
                Private · AI-assisted · No tracking · No public feed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="px-4 pb-20 sm:pb-24 bg-gradient-to-b from-slate-950/0 to-slate-950/40"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xs font-semibold tracking-[0.28em] text-emerald-300/80 uppercase">
            How Havenly works
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
              <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300/80 uppercase">
                1 — Check in
              </p>
              <p className="mt-2 text-sm font-medium text-slate-50">
                A tiny honest pause.
              </p>
              <p className="mt-2 text-xs sm:text-sm text-slate-300/90">
                Once a day (or whenever you like), you answer a gentle prompt
                and jot down a few honest sentences about how you&apos;re really
                doing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
              <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300/80 uppercase">
                2 — Reflect
              </p>
              <p className="mt-2 text-sm font-medium text-slate-50">
                Gentle AI reflections.
              </p>
              <p className="mt-2 text-xs sm:text-sm text-slate-300/90">
                Havenly&apos;s AI offers a soft reflection — not advice, not
                coaching, just a kind angle that mirrors back what seems to
                matter most in what you wrote.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
              <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300/80 uppercase">
                3 — Notice patterns
              </p>
              <p className="mt-2 text-sm font-medium text-slate-50">
                See what keeps showing up.
              </p>
              <p className="mt-2 text-xs sm:text-sm text-slate-300/90">
                Over time, your reflections help you notice what energizes you,
                what drains you, and what you want to protect or change — with
                deeper insights coming in Havenly Plus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT FEELS DIFFERENT / FOR WHOM / SOFT UPSell */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-5xl space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-50">
              Built for real life, not perfect habits.
            </h3>
            <p className="mt-3 text-sm text-slate-300/90">
              Havenly is designed for the nights you open your laptop feeling
              drained, the mornings before a meeting, and the days you don&apos;t
              have energy for a big routine. There are no streaks to break, no
              public feed, and nothing to perform.
            </p>
            <p className="mt-3 text-sm text-slate-300/90">
              A few minutes of honest writing — even once in a while — is enough
              to start feeling different about your day.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-50">
              A gentle use of AI you can trust.
            </h3>
            <p className="mt-3 text-sm text-slate-300/90">
              Havenly&apos;s AI isn&apos;t here to optimise you or tell you what
              to do. It simply reflects what it heard in your own words and
              highlights what seems important, in a tone that feels like a kind
              friend — not a dashboard.
            </p>
            <p className="mt-3 text-sm text-slate-300/90">
              Your text stays private and is used only to generate your
              reflections — never for ads or social feeds.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-slate-50">
            Ready to try a calmer way to check in with yourself?
          </p>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-300/90">
            Start with the free plan today. You can always upgrade later for
            deeper weekly summaries, emotional patterns, and clarity insights in
            Havenly Plus.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/magic-login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition-transform duration-150 hover:translate-y-0.5 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Start journaling free
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/40 px-6 py-2.5 text-sm font-medium text-slate-100/90 shadow-sm transition-colors duration-150 hover:border-slate-400 hover:bg-slate-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Explore the Havenly Journal →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
