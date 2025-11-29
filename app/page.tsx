// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-hvn-bg text-hvn-text-primary">
      {/* HERO SECTION */}
      <section className="relative px-4 pt-24 sm:px-6 lg:px-8">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 mx-auto max-w-4xl">
          <div className="absolute left-1/3 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-hvn-accent-mint-soft/30 blur-[120px]" />
          <div className="absolute right-1/3 top-20 h-96 w-96 translate-x-1/2 rounded-full bg-hvn-accent-blue-soft/20 blur-[140px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          {/* LEFT: Text */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-hvn-subtle/60 bg-hvn-bg-soft/60 px-3 py-1 text-xs font-medium text-hvn-text-muted backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-hvn-accent-mint" />
              A calmer way to understand your day
            </div>

            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.3rem]">
              Journaling that feels
              <span className="text-hvn-accent-mint"> gentle</span>,{" "}
              <span className="text-hvn-accent-blue">honest</span>, and yours.
            </h1>

            <p className="max-w-xl text-lg text-hvn-text-muted">
              Havenly 2.1 is a soft, private space to slow down for a moment,
              write two sentences, and receive a calm reflection—no streaks, no
              pressure, no public profiles.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-hvn-accent-mint px-7 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300"
              >
                Start journaling free
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-hvn-subtle/70 px-6 py-3 text-sm font-medium text-hvn-accent-blue hover:bg-hvn-accent-blue-soft/20"
              >
                Learn how Havenly works
              </Link>
            </div>

            <p className="text-xs text-hvn-text-muted">
              Takes 10 seconds. No credit card.
            </p>
          </div>

          {/* RIGHT: Card Preview */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 -translate-y-6 translate-x-6 rounded-[40px] bg-hvn-accent-blue-soft/25 blur-[90px]" />
            <div className="relative rounded-[26px] border border-hvn-card bg-hvn-bg-elevated/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-hvn-accent-mint">
                    Today’s check-in
                  </p>
                  <p className="text-[11px] text-hvn-text-muted">
                    Private • 2–3 mins • AI-assisted
                  </p>
                </div>
                <span className="rounded-full bg-hvn-accent-mint-soft/40 px-2 py-1 text-[10px] text-hvn-accent-mint">
                  Gentle mode
                </span>
              </div>

              {/* Prompt */}
              <div className="rounded-2xl bg-hvn-bg-soft/80 p-4">
                <p className="mb-1 text-xs font-medium text-hvn-text-secondary">
                  Prompt
                </p>
                <p className="text-sm text-hvn-text-primary">
                  “What felt heavy today, and what helped you carry it?”
                </p>
              </div>

              {/* User text */}
              <div className="mt-4 rounded-2xl bg-black/20 p-4">
                <p className="mb-1 text-xs font-medium text-hvn-text-secondary">
                  Your reflection
                </p>
                <p className="text-sm text-hvn-text-muted">
                  Work was overwhelming, but a quiet moment outside helped me
                  reset a bit.
                </p>
              </div>

              {/* AI Reflection */}
              <div className="mt-4 rounded-2xl bg-hvn-accent-mint-soft/10 p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-hvn-accent-mint-soft text-[11px] text-hvn-accent-mint">
                    AI
                  </span>
                  <p className="text-xs font-medium text-hvn-text-secondary">
                    Havenly’s gentle reflection
                  </p>
                </div>
                <p className="mt-2 text-sm text-hvn-text-secondary">
                  You carried more than you had energy for, yet you still found
                  a moment to breathe. That small act of care matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY HAVENLY IS DIFFERENT */}
      <section className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold text-hvn-text-primary sm:text-4xl">
              Built for real life, not perfect habits.
            </h2>
            <p className="text-lg text-hvn-text-muted">
              Havenly works even when you're tired, busy, overwhelmed, or not
              feeling reflective. No pressure, just a soft place to land.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Feature
              title="Low-pressure by design"
              body="No streaks, feeds, or emotional scoreboards. Just a quiet page for honest thoughts."
            />
            <Feature
              title="Gentle AI reflections"
              body="Soft, human-sounding summaries that highlight what mattered—never advice-giving."
            />
            <Feature
              title="Privacy comes first"
              body="Your writing stays yours. Not used for ads. Not shared. Not public."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 pb-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[26px] border border-hvn-card bg-hvn-bg-elevated/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-hvn-accent-blue">
            How it works
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-hvn-text-primary sm:text-3xl">
            A tiny routine that supports your emotional clarity.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Step
              step="1"
              title="Check in"
              body="Write two sentences—whatever feels honest or true right now."
            />
            <Step
              step="2"
              title="AI reflects back"
              body="Havenly mirrors your own words and gently highlights patterns."
            />
            <Step
              step="3"
              title="Feel lighter"
              body="Over time, clarity builds naturally. You see what supports you and what drains you."
            />
          </div>

          <div className="mt-8 border-t border-hvn-subtle/40 pt-4 text-sm text-hvn-text-muted">
            Free plan includes daily journaling + gentle reflections.
          </div>
        </div>
      </section>
    </div>
  );
}

/* COMPONENTS */

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-hvn-card bg-hvn-bg-elevated/70 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-hvn-text-secondary">{title}</h3>
      <p className="mt-2 text-sm text-hvn-text-muted">{body}</p>
    </div>
  );
}

function Step({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-hvn-card bg-hvn-bg-soft/80 p-5">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-hvn-accent-mint-soft text-xs font-semibold text-hvn-accent-mint">
        {step}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-hvn-text-secondary">{title}</h3>
      <p className="mt-2 text-sm text-hvn-text-muted">{body}</p>
    </div>
  );
}
