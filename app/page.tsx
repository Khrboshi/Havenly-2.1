// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-transparent">
      {/* HERO */}
      <section className="px-4 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-14">
          {/* Left: copy + CTAs */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-hvn-subtle/60 bg-hvn-bg/60 px-3 py-1 text-xs font-medium text-hvn-text-muted backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-hvn-accent-mint-soft" />
              A kinder way to understand your day
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight text-hvn-text-primary sm:text-4xl md:text-5xl lg:text-[3.1rem]">
              Journaling that feels{" "}
              <span className="text-hvn-accent-mint">soft</span>, honest, and{" "}
              <span className="text-hvn-accent-blue">simple</span>.
            </h1>

            <p className="max-w-xl text-base text-hvn-text-muted sm:text-lg">
              Havenly 2.1 is a calm, private space to write a few honest
              sentences and receive gentle AI reflections—no streaks, no public
              feed, and no pressure to be “productive.”
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-hvn-accent-mint px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/25 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hvn-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Start journaling free
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-hvn-subtle/70 bg-transparent px-5 py-2.5 text-sm font-medium text-hvn-accent-blue transition hover:bg-hvn-accent-blue-soft/25"
              >
                Learn how Havenly works
              </Link>

              <p className="w-full text-xs text-hvn-text-muted sm:w-auto sm:pl-2">
                No credit card. Just you and a blank, gentle page.
              </p>
            </div>
          </div>

          {/* Right: preview card */}
          <div className="mt-10 lg:mt-0">
            <div className="relative">
              <div className="absolute inset-0 -translate-y-4 translate-x-6 scale-105 rounded-[30px] bg-hvn-accent-blue-soft blur-3xl" />
              <div className="relative rounded-[26px] border border-hvn-card bg-hvn-bg-elevated/95 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.9)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-hvn-accent-mint">
                      Today&apos;s check-in
                    </p>
                    <p className="text-[11px] text-hvn-text-muted">
                      2–3 minutes · Private · AI-assisted
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-hvn-accent-mint-soft/40 px-2.5 py-1 text-[11px] text-hvn-accent-mint">
                    Gentle mode
                  </span>
                </div>

                <div className="space-y-3 rounded-2xl bg-hvn-bg-soft/80 p-4">
                  <p className="text-xs font-medium text-hvn-text-secondary">
                    Prompt
                  </p>
                  <p className="text-sm text-hvn-text-primary">
                    “What felt heavier than usual today, and what helped you get
                    through it even a little?”
                  </p>
                </div>

                <div className="mt-4 space-y-3 rounded-2xl bg-black/20 p-4">
                  <p className="text-xs font-medium text-hvn-text-secondary">
                    Your reflection
                  </p>
                  <p className="text-sm text-hvn-text-muted">
                    I woke up already tired. Work was noisy, and I kept worrying
                    I was behind. A short walk and a message from a friend made
                    things feel more bearable.
                  </p>
                </div>

                <div className="mt-4 space-y-3 rounded-2xl bg-hvn-accent-mint-soft/10 p-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-hvn-accent-mint-soft text-[11px] text-hvn-accent-mint">
                      AI
                    </span>
                    <p className="text-xs font-medium text-hvn-text-secondary">
                      Havenly reflection (just for you)
                    </p>
                  </div>
                  <p className="text-sm text-hvn-text-secondary">
                    It sounds like you carried a lot today with very little
                    energy. Even so, you still reached for a walk and stayed
                    open to support—that matters. Your body is asking for a bit
                    more gentleness than your schedule currently allows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY HAVENLY FEELS DIFFERENT */}
      <section className="px-4 pb-14 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold text-hvn-text-primary sm:text-3xl">
              Built for tired brains, not perfect habits.
            </h2>
            <p className="text-sm text-hvn-text-muted sm:text-base">
              Havenly is a tiny ritual you can keep even on the messy days.
              Write when you can, stop when you need, and let the AI gently
              highlight what mattered—without judging you or trying to “optimize”
              your life.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Low-pressure by design"
              body="No streaks, public feed, or metrics telling you how you “should” feel. Just a quiet page where a few honest sentences are enough."
            />
            <FeatureCard
              title="Gentle AI reflections"
              body="Havenly summarizes what you wrote in soft, human language—pointing out themes, emotions, and small wins you might have missed."
            />
            <FeatureCard
              title="Privacy comes first"
              body="Your entries are private and used only to generate reflections for you. No ads, no selling data, and no social-media style engagement tricks."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 pb-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[26px] border border-hvn-card bg-hvn-bg-elevated/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.85)] backdrop-blur-sm sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-hvn-accent-blue">
            How Havenly works
          </p>
          <h2 className="mt-3 text-xl font-semibold text-hvn-text-primary sm:text-2xl">
            A 3-step routine that fits between everything else.
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StepCard
              step="1"
              title="Check in"
              body="Once a day—or whenever you like—open Havenly and answer a short, gentle prompt about your day or your moment."
            />
            <StepCard
              step="2"
              title="Let AI reflect back"
              body="Havenly summarizes what it heard, highlights emotional patterns, and echoes back what seemed to matter most."
            />
            <StepCard
              step="3"
              title="Notice the patterns"
              body="Over time, your entries and reflections make it easier to see what supports you, what drains you, and what needs protecting."
            />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-hvn-subtle/40 pt-5 text-sm text-hvn-text-muted">
            <p>Free plan includes daily journaling and gentle reflections.</p>
            <Link
              href="/upgrade"
              className="text-xs font-medium text-hvn-accent-blue underline-offset-4 hover:underline"
            >
              See what Havenly Plus will add →
            </Link>
          </div>
        </div>
      </section>

      {/* FROM THE HAVENLY JOURNAL (BLOG PREVIEW) */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-hvn-accent-mint">
                From the Havenly Journal
              </p>
              <h2 className="mt-2 text-xl font-semibold text-hvn-text-primary sm:text-2xl">
                Gentle articles on journaling, self-talk, and burnout.
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs font-medium text-hvn-accent-blue underline-offset-4 hover:underline"
            >
              Browse all articles →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <BlogPreviewCard
              href="/blog/why-gentle-journaling-works"
              title="Why gentle journaling works better than strict routines"
              description="How low-pressure writing helps your nervous system relax enough to be honest."
              readingTime="5 min read"
            />
            <BlogPreviewCard
              href="/blog/the-3-minute-journal-that-actually-works"
              title="The 3-minute journal that actually works on busy days"
              description="A tiny template you can finish between meetings, chores, or childcare."
              readingTime="4 min read"
            />
            <BlogPreviewCard
              href="/blog/why-your-mind-feels-lighter-after-two-sentences"
              title="Why your mind feels lighter after two honest sentences"
              description="Your brain isn’t asking for pages—it’s asking for a safe place to land."
              readingTime="4 min read"
            />
            <BlogPreviewCard
              href="/blog/how-to-talk-to-yourself-more-kindly"
              title="How to talk to yourself more kindly (without faking it)"
              description="Simple prompts to shift your inner voice from harsh to honest-but-soft."
              readingTime="6 min read"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

type FeatureProps = {
  title: string;
  body: string;
};

function FeatureCard({ title, body }: FeatureProps) {
  return (
    <div className="h-full rounded-2xl border border-hvn-card bg-hvn-bg-elevated/80 p-4 shadow-sm shadow-black/40">
      <h3 className="text-sm font-semibold text-hvn-text-secondary">
        {title}
      </h3>
      <p className="mt-2 text-xs text-hvn-text-muted sm:text-[13px]">
        {body}
      </p>
    </div>
  );
}

type StepProps = {
  step: string;
  title: string;
  body: string;
};

function StepCard({ step, title, body }: StepProps) {
  return (
    <div className="h-full rounded-2xl border border-hvn-card bg-hvn-bg-soft/70 p-4">
      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-hvn-accent-mint-soft text-xs font-semibold text-hvn-accent-mint">
        {step}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-hvn-text-secondary">
        {title}
      </h3>
      <p className="mt-2 text-xs text-hvn-text-muted sm:text-[13px]">
        {body}
      </p>
    </div>
  );
}

type BlogPreviewProps = {
  href: string;
  title: string;
  description: string;
  readingTime: string;
};

function BlogPreviewCard({
  href,
  title,
  description,
  readingTime,
}: BlogPreviewProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-hvn-card bg-hvn-bg-elevated/80 p-4 transition hover:border-hvn-accent-mint-soft hover:bg-hvn-bg-soft/90"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-hvn-accent-blue">
        Journal article
      </p>
      <h3 className="mt-2 text-sm font-semibold text-hvn-text-secondary group-hover:text-hvn-accent-mint">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-xs text-hvn-text-muted sm:text-[13px]">
        {description}
      </p>
      <p className="mt-3 text-[11px] text-hvn-text-muted">{readingTime}</p>
    </Link>
  );
}
