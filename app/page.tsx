// app/page.tsx
import Link from "next/link";

/**
 * Havenly – Calm Emotional Support Landing
 * Visual tone: Cool calm (moonlight + mint + lavender)
 * Focus: psychological safety, gentle reflection, free → premium journey
 */

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#020617,_#020617_45%,_#020617)] text-hvn-text-primary">
      {/* ============================ HERO ============================ */}
      <section className="px-4 pt-24 pb-20 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT – emotional headline & CTAs */}
          <div className="max-w-xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-hvn-subtle/40 bg-hvn-bg/40 px-3 py-1 text-xs font-medium text-hvn-text-muted backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-hvn-accent-mint" />
              A quiet place to land at the end of the day
            </div>

            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-hvn-text-primary sm:text-4xl md:text-[2.8rem]">
              When your mind feels full,{" "}
              <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-hvn-accent-mint-soft bg-clip-text text-transparent">
                Havenly holds the pieces
              </span>
              .
            </h1>

            <p className="text-pretty text-sm leading-relaxed text-hvn-text-secondary sm:text-base">
              Havenly is a calm journaling space with gentle AI reflections that
              listen first and never judge. Empty your head, name what feels
              heavy, and slowly notice patterns in how you feel over time.
              Start free. Upgrade only if deeper psychological insight feels
              right for you.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/magic-login"
                className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-6 py-3 text-sm font-semibold text-hvn-bg shadow-[0_18px_45px_rgba(56,189,248,0.55)] transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:bg-hvn-accent-mint-soft hover:shadow-[0_22px_60px_rgba(56,189,248,0.65)] sm:w-auto"
              >
                Start a free check-in
              </Link>

              <Link
                href="/upgrade"
                className="inline-flex w-full items-center justify-center rounded-full border border-hvn-subtle px-6 py-3 text-sm font-medium text-hvn-text-secondary transition duration-200 hover:border-hvn-accent-mint-soft hover:text-hvn-accent-mint sm:w-auto"
              >
                See deeper insight options
              </Link>
            </div>

            <p className="text-xs text-hvn-text-muted">
              No credit card for the free space. Keep it as your private
              journal, even if you never upgrade.
            </p>
          </div>

          {/* RIGHT – “therapy-like” preview card */}
          <div className="w-full max-w-md">
            <div className="relative rounded-3xl border border-hvn-subtle/50 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.45),_rgba(15,23,42,0.98))] p-5 shadow-[0_26px_90px_rgba(15,23,42,0.95)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
              {/* soft light glow */}
              <div className="pointer-events-none absolute inset-x-8 -top-6 h-10 rounded-full bg-gradient-to-r from-sky-400/40 via-indigo-400/20 to-hvn-accent-mint-soft/35 blur-2xl" />

              {/* Header */}
              <div className="relative mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-400 to-hvn-accent-mint shadow-[0_10px_25px_rgba(129,140,248,0.75)]" />
                  <div>
                    <p className="text-xs font-medium text-hvn-text-secondary">
                      Evening check-in
                    </p>
                    <p className="text-[11px] text-hvn-text-muted">
                      3–5 minutes · just for you
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-hvn-bg-soft/80 px-3 py-1 text-[11px] text-sky-200">
                  Calm mode
                </span>
              </div>

              {/* Prompt */}
              <div className="relative space-y-2 rounded-2xl bg-hvn-bg-soft/90 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.75)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                  Tonight&apos;s prompt
                </p>
                <p className="text-sm text-hvn-text-primary">
                  &quot;If your mind could speak freely right now, what would it
                  say it&apos;s carrying?&quot;
                </p>
              </div>

              {/* AI reflection */}
              <div className="mt-4 space-y-2 rounded-2xl border border-hvn-subtle/60 bg-hvn-bg-soft/75 p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-400/15 text-xs font-semibold text-sky-200">
                    AI
                  </span>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-hvn-text-muted">
                    Gentle reflection
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-hvn-text-secondary">
                  You&apos;re holding a lot, and still showing up. That says
                  something important about your strength. It might help to
                  choose just one feeling to name for tonight, instead of trying
                  to solve everything at once.
                </p>
              </div>

              {/* Free vs Premium mini-legend */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
                <div className="rounded-2xl bg-hvn-bg-soft/80 p-3">
                  <p className="font-semibold text-hvn-text-secondary">Free</p>
                  <p className="mt-1 text-hvn-text-muted">
                    Safe, private journaling + gentle reflections.
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-300/60 bg-gradient-to-br from-slate-900/70 to-slate-950/90 p-3">
                  <p className="font-semibold text-sky-200">Premium</p>
                  <p className="mt-1 text-hvn-text-muted">
                    Deeper patterns, emotional themes, and tailored guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="border-t border-hvn-subtle/40 bg-hvn-bg-soft/20 px-4 py-16 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="max-w-xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-300">
              How Havenly supports you
            </p>
            <h2 className="text-xl font-semibold text-hvn-text-primary sm:text-2xl md:text-3xl">
              Not here to fix you. Here to sit with you.
            </h2>
            <p className="text-sm text-hvn-text-secondary">
              Havenly is designed like a compassionate friend: it listens, helps
              you name what you feel, and gently reflects patterns back over
              time—without rushing you.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Arrive as you are",
                text: "You land on one simple prompt. No streaks, no pressure, no judgment—just an invitation to be honest.",
              },
              {
                step: "02",
                title: "Write what’s true for today",
                text: "You can share as much or as little as you like. Havenly holds it quietly and safely.",
              },
              {
                step: "03",
                title: "Receive a gentle reflection",
                text: "AI highlights what stood out, validates your effort, and over time surfaces emotional themes.",
              },
            ].map((item) => (
              <article
                key={item.step}
                className="group rounded-2xl border border-hvn-subtle/50 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),_rgba(15,23,42,0.98))] p-5 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:border-sky-300/70 hover:shadow-[0_18px_65px_rgba(15,23,42,0.9)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-300">
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-300">
                Free & Premium
              </p>
              <h2 className="text-xl font-semibold text-hvn-text-primary sm:text-2xl md:text-3xl">
                Your mind deserves a steady place to return to.
              </h2>
              <p className="text-sm text-hvn-text-secondary">
                Begin with the free space for as long as you need. When you
                feel ready for deeper understanding of your emotional patterns,
                Premium is there—no pressure, no urgency.
              </p>
            </div>
            <div className="flex gap-2 text-xs text-hvn-text-muted">
              <span className="rounded-full bg-hvn-bg-soft px-3 py-1">
                Cancel anytime
              </span>
              <span className="rounded-full bg-hvn-bg-soft px-3 py-1">
                No lock-in or long contracts
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Free plan */}
            <div className="flex flex-col rounded-3xl border border-hvn-subtle/60 bg-hvn-bg-soft p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-sky-300/60 hover:shadow-[0_18px_55px_rgba(15,23,42,0.8)]">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-hvn-text-muted">
                Free
              </p>
              <h3 className="mt-2 text-lg font-semibold text-hvn-text-primary">
                Havenly Free
              </h3>
              <p className="mt-1 text-sm text-hvn-text-secondary">
                A steady, private space to unload your thoughts and feelings at
                your own pace.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-hvn-text-secondary">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300/80" />
                  Unlimited entries & evening check-ins
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300/80" />
                  Gentle reflections focused on validation, not perfection
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300/80" />
                  A private timeline of what you’ve been carrying lately
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/magic-login"
                  className="inline-flex w-full items-center justify-center rounded-full bg-sky-500/10 px-5 py-2.5 text-xs font-semibold text-sky-200 transition duration-200 hover:bg-sky-400/20"
                >
                  Open your free space
                </Link>
              </div>
            </div>

            {/* Premium plan */}
            <div className="relative flex flex-col rounded-3xl border border-sky-300/70 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.28),_rgba(15,23,42,0.98))] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(56,189,248,0.55)]">
              <div className="absolute right-5 top-5 rounded-full bg-sky-400 px-3 py-1 text-[11px] font-semibold text-hvn-bg">
                Most depth
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">
                Premium
              </p>
              <h3 className="mt-2 text-lg font-semibold text-hvn-text-primary">
                Havenly Premium
              </h3>
              <p className="mt-1 text-sm text-hvn-text-secondary">
                For when you’re ready to understand not just today&apos;s
                feelings, but the patterns beneath them.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-hvn-text-secondary">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-200" />
                  Emotional themes and patterns across weeks & months
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-200" />
                  Deeper reflections that gently challenge unhelpful stories
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-200" />
                  Early access to guided journeys and supportive tools
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/upgrade"
                  className="inline-flex w-full items-center justify-center rounded-full bg-sky-400 px-5 py-2.5 text-xs font-semibold text-hvn-bg transition duration-200 hover:bg-sky-300"
                >
                  Explore Premium support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section className="border-t border-hvn-subtle/40 bg-hvn-bg-soft/15 px-4 py-16 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-hvn-text-primary sm:text-3xl">
            You don&apos;t have to hold it all alone.
          </h2>
          <p className="text-sm text-hvn-text-secondary">
            Havenly offers a steady ritual: a few minutes to notice, name, and
            gently understand what you’re feeling—today, and over time.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/magic-login"
              className="w-full rounded-full bg-hvn-accent-mint px-6 py-3 text-sm font-semibold text-hvn-bg transition duration-200 hover:bg-hvn-accent-mint-soft sm:w-auto"
            >
              Begin a free check-in
            </Link>
            <Link
              href="/upgrade"
              className="w-full rounded-full border border-hvn-subtle px-6 py-3 text-sm font-medium text-hvn-text-secondary transition duration-200 hover:border-sky-300/70 hover:text-sky-200 sm:w-auto"
            >
              Learn about Premium support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
