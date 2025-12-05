// app/page.tsx
import Link from "next/link";

/**
 * Havenly – Optimized Landing Page
 * Fully server-rendered, zero client JS, maximum performance.
 * High-engagement structure designed for free → premium conversion.
 */

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)] text-hvn-text-primary">
      {/* ============================ HERO SECTION ============================ */}
      <section className="px-6 pt-28 pb-20 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-14 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT SIDE: Headline + CTA */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-hvn-subtle/40 bg-hvn-bg/40 px-3 py-1 text-xs font-medium text-hvn-text-muted backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-hvn-accent-mint" />
              A calmer way to understand your days
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-hvn-text-primary sm:text-5xl md:text-6xl">
              Turn daily moments into{" "}
              <span className="bg-gradient-to-r from-hvn-accent-mint to-hvn-accent-peach bg-clip-text text-transparent">
                clarity and emotional insight
              </span>
              .
            </h1>

            <p className="text-base leading-relaxed text-hvn-text-secondary sm:text-lg">
              Havenly gives you a quiet space to journal and receive gentle,
              meaningful reflections powered by AI. Start for free. Upgrade only
              if the deeper insights truly help you.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/magic-login"
                className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-6 py-3 text-sm font-semibold text-hvn-bg shadow-lg shadow-hvn-accent-mint/30 transition hover:bg-hvn-accent-mint-soft sm:w-auto"
              >
                Start free in 30 seconds
              </Link>

              <Link
                href="/upgrade"
                className="inline-flex w-full items-center justify-center rounded-full border border-hvn-subtle px-6 py-3 text-sm font-medium text-hvn-text-secondary transition hover:border-hvn-accent-mint-soft hover:text-hvn-accent-mint sm:w-auto"
              >
                Explore Premium
              </Link>
            </div>

            <p className="text-xs text-hvn-text-muted">
              No credit card required for the free plan.
            </p>
          </div>

          {/* RIGHT SIDE: “Preview” Card */}
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-hvn-subtle/60 bg-hvn-bg-elevated p-5 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-lg">
              {/* Preview header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-hvn-accent-mint to-hvn-accent-peach" />
                  <div>
                    <p className="text-xs font-medium text-hvn-text-secondary">
                      Havenly Journal
                    </p>
                    <p className="text-[11px] text-hvn-text-muted">
                      Example entry • 3–5 minutes
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-hvn-bg-soft px-3 py-1 text-[11px] text-hvn-accent-mint-soft">
                  Calm Mode
                </span>
              </div>

              {/* Prompt */}
              <div className="space-y-2 rounded-2xl bg-hvn-bg-soft/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-hvn-accent-blue">
                  Today’s Prompt
                </p>
                <p className="text-sm text-hvn-text-primary">
                  “What moment from today stayed with you more than you expected?”
                </p>
              </div>

              {/* AI Reflection preview */}
              <div className="mt-4 space-y-2 rounded-2xl border border-hvn-subtle/50 bg-hvn-bg-soft/60 p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-hvn-accent-mint-soft/20 text-xs text-hvn-accent-mint">
                    AI
                  </span>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-hvn-text-muted">
                    Gentle Reflection
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-hvn-text-secondary">
                  It sounds like this moment held more meaning than you first
                  realized. Noticing these subtle emotional shifts is one of your
                  strengths. Tomorrow, consider giving yourself space to follow
                  that curiosity.
                </p>
              </div>

              {/* Free vs Premium hint */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
                <div className="rounded-2xl bg-hvn-bg-soft/80 p-3">
                  <p className="font-semibold text-hvn-text-secondary">Free</p>
                  <p className="mt-1 text-hvn-text-muted">
                    Unlimited journaling + gentle insights.
                  </p>
                </div>
                <div className="rounded-2xl border border-hvn-accent-mint-soft p-3">
                  <p className="font-semibold text-hvn-accent-mint">Premium</p>
                  <p className="mt-1 text-hvn-text-muted">
                    Deeper guidance across weeks & patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="border-t border-hvn-subtle/30 bg-hvn-bg-soft/40 px-6 py-16 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="max-w-xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-hvn-accent-blue">
              How It Works
            </p>
            <h2 className="text-2xl font-semibold text-hvn-text-primary sm:text-3xl">
              A quiet space to check in with yourself.
            </h2>
            <p className="text-sm text-hvn-text-secondary">
              Havenly is designed around simple, honest reflections—especially
              on imperfect days.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Drop in for a few minutes",
                text: "One simple prompt helps you ease into reflection without pressure.",
              },
              {
                step: "2",
                title: "Capture what mattered",
                text: "Write freely. Havenly keeps the tone calm and supportive.",
              },
              {
                step: "3",
                title: "Let the AI reflect back",
                text: "The more consistently you write, the richer your insights become.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-hvn-subtle/50 bg-hvn-bg-soft/50 p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-hvn-accent-mint-soft">
                  Step {s.step}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-hvn-text-primary">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-hvn-text-secondary">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FREE VS PREMIUM ============================ */}
      <section className="border-t border-hvn-subtle/30 bg-hvn-bg px-6 py-16 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-hvn-accent-blue">
                Plans
              </p>
              <h2 className="text-2xl font-semibold text-hvn-text-primary sm:text-3xl">
                One space, two ways to use it.
              </h2>
              <p className="text-sm text-hvn-text-secondary">
                Most people begin with the free plan. Premium offers deeper
                patterns and long-term clarity.
              </p>
            </div>
            <div className="mt-4 flex gap-2 text-xs text-hvn-text-muted md:mt-0">
              <span className="rounded-full bg-hvn-bg-soft px-3 py-1">
                Cancel anytime
              </span>
              <span className="rounded-full bg-hvn-bg-soft px-3 py-1">
                No lock-in
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* FREE CARD */}
            <div className="rounded-3xl border border-hvn-subtle/60 bg-hvn-bg-soft p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-hvn-text-muted">
                Free
              </p>
              <h3 className="mt-2 text-lg font-semibold text-hvn-text-primary">
                Havenly Free
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-hvn-text-secondary">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-mint-soft"></span>
                  Unlimited journaling entries
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-mint-soft"></span>
                  Gentle daily insights
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-mint-soft"></span>
                  Private timeline of recent reflections
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/magic-login"
                  className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint-soft/20 px-5 py-2 text-xs font-semibold text-hvn-accent-mint hover:bg-hvn-accent-mint-soft/30"
                >
                  Start for free
                </Link>
              </div>
            </div>

            {/* PREMIUM CARD */}
            <div className="relative rounded-3xl border border-hvn-accent-mint-soft bg-gradient-to-br from-hvn-bg-soft to-hvn-bg p-6">
              <div className="absolute right-4 top-4 rounded-full bg-hvn-accent-mint-soft px-3 py-1 text-[11px] font-semibold text-hvn-bg">
                Most depth
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-hvn-accent-mint">
                Premium
              </p>
              <h3 className="mt-2 text-lg font-semibold text-hvn-text-primary">
                Havenly Premium
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-hvn-text-secondary">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-peach-soft"></span>
                  Insights across weeks and emotional patterns
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-peach-soft"></span>
                  Personalized guidance and deeper understanding
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-hvn-accent-peach-soft"></span>
                  Early access to tools and journeys
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/upgrade"
                  className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-5 py-2 text-xs font-semibold text-hvn-bg hover:bg-hvn-accent-mint-soft"
                >
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ CTA FOOTER ============================ */}
      <section className="border-t border-hvn-subtle/30 bg-hvn-bg-soft/40 px-6 py-20 text-center md:px-10 lg:px-20">
        <div className="mx-auto max-w-xl space-y-6">
          <h2 className="text-2xl font-semibold text-hvn-text-primary sm:text-3xl">
            Ready to reflect with more clarity?
          </h2>
          <p className="text-sm text-hvn-text-secondary">
            Havenly helps you understand your emotional landscape—one honest
            moment at a time.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/magic-login"
              className="rounded-full bg-hvn-accent-mint px-6 py-3 text-sm font-semibold text-hvn-bg hover:bg-hvn-accent-mint-soft"
            >
              Start free
            </Link>
            <Link
              href="/upgrade"
              className="rounded-full border border-hvn-subtle px-6 py-3 text-sm font-medium text-hvn-text-secondary hover:border-hvn-accent-mint-soft hover:text-hvn-accent-mint"
            >
              Explore Premium
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
