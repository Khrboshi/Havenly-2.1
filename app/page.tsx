// app/page.tsx
import Link from "next/link";

/**
 * Havenly – Landing Page v2.0
 * Hybrid Calm + Modern SaaS visual design.
 * Server component, zero extra dependencies, subtle CSS-only animations.
 */

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#020617,_#020617,_#020617)] text-hvn-text-primary">
      {/* ============================ HERO ============================ */}
      <section className="px-4 pt-24 pb-20 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Left side – text + CTAs */}
          <div className="max-w-xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-hvn-subtle/40 bg-hvn-bg/40 px-3 py-1 text-xs font-medium text-hvn-text-muted backdrop-blur transition hover:border-hvn-accent-mint-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-hvn-accent-mint" />
              A calmer way to understand your days
            </div>

            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-hvn-text-primary sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              Turn daily moments into{" "}
              <span className="bg-gradient-to-r from-hvn-accent-mint via-hvn-accent-peach to-hvn-accent-mint-soft bg-clip-text text-transparent">
                quiet, useful clarity
              </span>
              .
            </h1>

            <p className="text-pretty text-sm leading-relaxed text-hvn-text-secondary sm:text-base">
              Havenly is a calm journaling space with AI reflections that stay
              gentle and focused on what matters. Start free and build a
              simple habit; upgrade to Premium only if deeper guidance feels
              genuinely helpful.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/magic-login"
                className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-6 py-3 text-sm font-semibold text-hvn-bg shadow-[0_18px_45px_rgba(16,185,129,0.45)] transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:bg-hvn-accent-mint-soft hover:shadow-[0_22px_55px_rgba(16,185,129,0.55)] sm:w-auto"
              >
                Start free in 30 seconds
              </Link>

              <Link
                href="/upgrade"
                className="inline-flex w-full items-center justify-center rounded-full border border-hvn-subtle px-6 py-3 text-sm font-medium text-hvn-text-secondary transition duration-200 hover:border-hvn-accent-mint-soft hover:text-hvn-accent-mint sm:w-auto"
              >
                Explore Premium
              </Link>
            </div>

            <p className="text-xs text-hvn-text-muted">
              Free plan requires no credit card. Keep it forever or upgrade any
              time.
            </p>
          </div>

          {/* Right side – product preview card */}
          <div className="w-full max-w-md">
            <div className="relative rounded-3xl border border-hvn-subtle/60 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_#020617)] p-5 shadow-[0_22px_80px_rgba(15,23,42,0.95)] backdrop-blur-lg transition-transform duration-200 hover:-translate-y-1">
              <div className="absolute inset-x-10 -top-4 h-10 rounded-full bg-gradient-to-r from-hvn-accent-mint/40 via-transparent to-hvn-accent-peach/30 blur-2xl" />

              {/* Header */}
              <div className="relative mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-hvn-accent-mint to-hvn-accent-peach shadow-[0_8px_20px_rgba(16,185,129,0.55)]" />
                  <div>
                    <p className="text-xs font-medium text-hvn-text-secondary">
                      Havenly Journal
                    </p>
                    <p className="text-[11px] text-hvn-text-muted">
                      Example entry · 3–5 minutes
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-hvn-bg-soft/80 px-3 py-1 text-[11px] text-hvn-accent-mint-soft">
                  Calm mode
                </span>
              </div>

              {/* Prompt card */}
              <div className="relative space-y-2 rounded-2xl bg-hvn-bg-soft/80 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.65)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-hvn-accent-blue">
                  Today&apos;s prompt
                </p>
                <p className="text-sm text-hvn-text-primary">
                  &quot;What moment from today stayed with you more than you
                  expected?&quot;
                </p>
              </div>

              {/* AI reflection */}
              <div className="mt-4 space-y-2 rounded-2xl border border-hvn-subtle/60 bg-hvn-bg-soft/70 p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-hvn-accent-mint-soft/15 text-xs font-semibold text-hvn-accent-mint">
                    AI
                  </span>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-hvn-text-muted">
                    Gentle reflection
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-hvn-text-secondary">
                  It sounds like that moment held more meaning than you
                  realized at first. Noticing these subtle shifts is one of your
                  quiet strengths. Tomorrow, consider giving yourself a little
                  space to follow that curiosity.
                </p>
              </div>

              {/* Free vs Premium mini-legend */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
                <div className="rounded-2xl bg-hvn-bg-soft/80 p-3">
                  <p className="font-semibold text-hvn-text-secondary">Free</p>
                  <p className="mt-1 text-hvn-text-muted">
                    Unlimited journaling + gentle insights.
                  </p>
                </div>
                <div className="rounded-2xl border border-hvn-accent-mint-soft bg-hvn-bg/80 p-3">
                  <p className="font-semibold text-hvn-accent-mint">Premium</p>
                  <p className="mt-1 text-hvn-text-muted">
                    Deeper guidance across weeks &amp; patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="border-t border-hvn-subtle/40 bg-hvn-bg-soft/25 px-4 py-16 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="max-w-xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-hvn-accent-blue">
              How it works
            </p>
            <h2 className="text-xl font-semibold text-hvn-text-primary sm:text-2xl md:text-3xl">
              A quiet space to check in with yourself.
            </h2>
            <p className="text-sm text-hvn-text-secondary">
              You don&apos;t need a perfect routine. Havenly is built around
              small, honest reflections—especially on days that feel messy.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Drop in for a few minutes",
                text: "You arrive to one simple prompt—no feeds, no noise, no pressure to perform.",
              },
              {
                step: "02",
                title: "Capture what mattered",
                text: "Write freely, in your own words. The tone stays soft and supportive, not demanding.",
              },
              {
                step: "03",
                title: "Let AI reflect things back",
                text: "Even on the free plan, you get gentle reflections. Premium adds long-term patterns.",
              },
            ].map((item) => (
              <article
                key={item.step}
                className="group rounded-2xl border border-hvn-subtle/50 bg-hvn-bg-soft/40 p-5 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:border-hvn-accent-mint-soft hover:shadow-[0_18px_60px_rgba(15,23,42,0.75)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-hvn-accent-mint-soft">
                  Step {item.step}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-hvn-text-primary sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-hvn-text-secondary">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ PLANS ============================ */}
      <section className="border-t border-hvn-subtle/40 bg-hvn-bg px-4 py-16 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-hvn-accent-blue">
                Plans
              </p>
              <h2 className="text-xl font-semibold text-hvn-text-primary sm:text-2xl md:text-3xl">
                One space, two ways to use it.
              </h2>
              <p className="text-sm text-hvn-text-secondary">
                Most people start with the free plan to build a gentle habit.
                Premium is there when you want deeper patterns and more structured guidance.
              </p>
            </div>
            <div className="flex gap-2 text-xs text-hvn-text-muted">
              <span className="rounded-full bg-hvn-bg-soft px-3 py-1">
                Cancel anytime
              </span>
              <span className="rounded-full bg-hvn-bg-soft px-3 py-1">
                No lock-in
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Free plan */}
            <div className="flex flex-col rounded-3xl border border-hvn-subtle/60 bg-hvn-bg-soft p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-hvn-accent-mint-soft hover:shadow-[0_18px_55px_rgba(15,23,42,0.7)]">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-hvn-text-muted">
                Free
              </p>
              <h3 className="mt-2 text-lg font-semibold text-hvn-text-primary">
                Havenly Free
              </h3>
              <p className="mt-1 text-sm text-hvn-text-secondary">
                A permanent free option for anyone who needs a calm place to
                process their days.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-hvn-text-secondary">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-mint-soft" />
                  Unlimited journaling entries
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-mint-soft" />
                  Gentle daily reflections on recent entries
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-mint-soft" />
                  Private timeline of your recent reflections
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/magic-login"
                  className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint-soft/20 px-5 py-2.5 text-xs font-semibold text-hvn-accent-mint transition duration-200 hover:bg-hvn-accent-mint-soft/30"
                >
                  Start for free
                </Link>
              </div>
            </div>

            {/* Premium plan */}
            <div className="relative flex flex-col rounded-3xl border border-hvn-accent-mint-soft bg-gradient-to-br from-hvn-bg-soft via-hvn-bg-soft to-hvn-bg p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_20px_65px_rgba(16,185,129,0.45)]">
              <div className="absolute right-5 top-5 rounded-full bg-hvn-accent-mint-soft px-3 py-1 text-[11px] font-semibold text-hvn-bg">
                Most depth
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-hvn-accent-mint">
                Premium
              </p>
              <h3 className="mt-2 text-lg font-semibold text-hvn-text-primary">
                Havenly Premium
              </h3>
              <p className="mt-1 text-sm text-hvn-text-secondary">
                Everything in the free plan, plus deeper AI understanding of
                your emotional patterns over weeks and months.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-hvn-text-secondary">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-peach-soft" />
                  Insights across weeks and recurring emotional patterns
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-peach-soft" />
                  Personalized guidance and deeper reflections
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-peach-soft" />
                  Priority access to new tools and journeys
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/upgrade"
                  className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-5 py-2.5 text-xs font-semibold text-hvn-bg transition duration-200 hover:bg-hvn-accent-mint-soft"
                >
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section className="border-t border-hvn-subtle/40 bg-hvn-bg-soft/20 px-4 py-18 pb-20 pt-16 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-hvn-text-primary sm:text-3xl">
            Ready to reflect with more clarity?
          </h2>
          <p className="text-sm text-hvn-text-secondary">
            Havenly helps you stay in touch with your emotional landscape—one
            honest check-in at a time.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/magic-login"
              className="w-full rounded-full bg-hvn-accent-mint px-6 py-3 text-sm font-semibold text-hvn-bg transition duration-200 hover:bg-hvn-accent-mint-soft sm:w-auto"
            >
              Start free
            </Link>
            <Link
              href="/upgrade"
              className="w-full rounded-full border border-hvn-subtle px-6 py-3 text-sm font-medium text-hvn-text-secondary transition duration-200 hover:border-hvn-accent-mint-soft hover:text-hvn-accent-mint sm:w-auto"
            >
              Explore Premium
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
