// app/page.tsx
import Link from "next/link";

/**
 * Havenly – Landing Page
 * Calm, focused SaaS-style marketing page with clear Free vs Premium story.
 */

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-slate-950 text-white">
      {/* ============================ HERO ============================ */}
      <section className="px-4 pt-24 pb-16 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr,1fr] md:items-center">
          {/* Left – copy + CTAs */}
          <div>
            <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
              A gentle AI space for your days
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              A quiet place to write.
              <br />
              A kinder way to see the patterns.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Havenly gives you a calm, judgment-free space to journal, then
              uses soft, reflective AI to help you notice what has actually
              been happening in your days—without productivity pressure.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-400"
              >
                Start free
              </Link>

              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center rounded-full border border-emerald-400/40 bg-slate-950 px-6 py-3 text-sm font-medium text-emerald-200 hover:bg-slate-900"
              >
                Explore Premium
              </Link>
            </div>

            <p className="mt-3 text-xs text-white/55">
              No credit card required to start. Upgrade only if Premium feels
              clearly valuable for you.
            </p>

            <p className="mt-2 max-w-md text-xs text-white/55">
              Premium helps support ongoing improvements to Havenly and keeps
              your space private, calm, and completely free from ads or
              distractions.
            </p>
          </div>

          {/* Right – how it works snapshot */}
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/60">
            <h2 className="text-sm font-semibold text-white/90">
              How Havenly works
            </h2>

            <ol className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <span className="mt-0.5 h-5 w-5 flex-none rounded-full border border-emerald-400/40 text-center text-xs leading-[18px] text-emerald-300">
                  1
                </span>
                <div>
                  <p className="font-medium text-white">
                    Drop a few honest lines after your day.
                  </p>
                  <p className="text-xs text-white/65">
                    No pressure to perform. Just write what actually happened,
                    in your own words.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="mt-0.5 h-5 w-5 flex-none rounded-full border border-emerald-400/40 text-center text-xs leading-[18px] text-emerald-300">
                  2
                </span>
                <div>
                  <p className="font-medium text-white">
                    Havenly reflects back what mattered.
                  </p>
                  <p className="text-xs text-white/65">
                    Gentle, non-judgmental summaries that help you see themes,
                    not just single entries.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="mt-0.5 h-5 w-5 flex-none rounded-full border border-emerald-400/40 text-center text-xs leading-[18px] text-emerald-300">
                  3
                </span>
                <div>
                  <p className="font-medium text-white">
                    Over time, patterns begin to emerge.
                  </p>
                  <p className="text-xs text-white/65">
                    Premium layers in timelines, recurring themes, and gentle
                    insights that make it easier to understand what is actually
                    supporting you.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-white/65">
              <p className="mb-1 font-semibold text-white/80">
                Free vs Premium
              </p>
              <p>
                Free gives you private journaling and light reflections.
                Premium adds deeper AI insights, pattern timelines, richer
                context, and a higher monthly credit balance.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ============================ PRICING ============================ */}
      <section
        id="pricing"
        className="border-t border-slate-800 bg-slate-950 px-4 py-14 sm:px-6 md:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Choose the plan that feels right for your season.
            </h2>
            <p className="mt-3 text-sm text-white/75 sm:text-base">
              Havenly is intentionally simple: a{" "}
              <span className="font-medium text-emerald-300">Free</span> plan
              for quiet journaling, and a{" "}
              <span className="font-medium text-emerald-300">Premium</span> plan
              with deeper insights, timelines, and enhanced reflection tools.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Free plan */}
            <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="mt-1 text-2xl font-bold text-emerald-300">$0</p>
              <p className="mt-2 text-sm text-white/70">
                For quiet, private journaling with light AI reflections.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                <li>• Private, encrypted journaling</li>
                <li>• Light AI reflections</li>
                <li>• Basic check-in flow</li>
                <li>• No pressure to upgrade</li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/magic-login"
                  className="inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-white"
                >
                  Start with Free
                </Link>
              </div>
            </div>

            {/* Premium plan */}
            <div className="flex flex-col rounded-2xl border border-emerald-400/50 bg-slate-900/80 p-6 shadow-lg shadow-emerald-500/20">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">Premium</h3>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  Most popular
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold text-emerald-300">
                $25<span className="text-base font-normal text-white/70">/month</span>
              </p>
              <p className="mt-2 text-sm text-white/75">
                For deeper insights, pattern timelines, and a richer reflective
                experience built to support your emotional clarity.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/85">
                <li>• Deeper AI reflections</li>
                <li>• Emotional timelines & themes</li>
                <li>• Higher monthly credit balance</li>
                <li>• Priority access to new tools</li>
              </ul>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/upgrade"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Upgrade to Premium
                </Link>
                <p className="text-xs text-white/60">
                  Cancel anytime. Your journal entries always remain yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
