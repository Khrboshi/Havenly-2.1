// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-hvn-bg text-hvn-text-primary bg-hvn-page-gradient">
      {/* HERO */}
      <section className="pt-16 pb-14 sm:pt-20 sm:pb-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-center md:justify-between">
          {/* Left: copy */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
              Gentle AI journaling · Private by design
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              A calmer way to keep up with{" "}
              <span className="text-emerald-400">your own life.</span>
            </h1>

            <p className="text-sm leading-relaxed text-hvn-text-muted sm:text-base">
              Havenly is your quiet corner on the internet: a private journal
              with gentle AI reflections that help you understand how you have
              really been doing—without turning your life into a productivity
              project.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Start free journal
              </Link>

              <Link
                href="/premium"
                className="inline-flex items-center justify-center rounded-full border border-slate-600/80 bg-slate-900/70 px-5 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Explore Premium features
              </Link>
            </div>

            {/* Social proof / micro-copy */}
            <div className="flex flex-col gap-1 pt-2 text-xs text-hvn-text-muted sm:flex-row sm:items-center sm:gap-3">
              <p>No credit card required for Free plan.</p>
              <p className="flex items-center gap-2">
                <span className="inline-block h-1 w-1 rounded-full bg-emerald-400" />
                Designed for busy, thoughtful people with very full lives.
              </p>
            </div>
          </div>

          {/* Right: card mock / mobile-first emphasis */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="pointer-events-none absolute -left-4 -top-4 hidden h-20 w-20 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 blur-3xl sm:block" />

            <div className="rounded-3xl border border-hvn-card bg-slate-950/90 p-4 shadow-xl shadow-black/60 backdrop-blur">
              <div className="mb-3 flex items-center justify-between text-xs text-hvn-text-muted">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Today’s check-in
                </span>
                <span>Private · Just for you</span>
              </div>

              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-xs font-medium text-hvn-text-primary">
                  “I feel overwhelmed, but I am not sure if it is just work or
                  everything at once…”
                </p>
                <p className="text-[11px] text-hvn-text-muted">
                  Havenly’s AI gently reflects your words back to you, helping
                  you notice patterns without judgment.
                </p>
              </div>

              <div className="mt-4 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-xs">
                <p className="font-semibold text-emerald-300">
                  Today you seem:
                </p>
                <ul className="list-inside list-disc space-y-1 text-slate-200">
                  <li>Carrying more than you realised.</li>
                  <li>Trying to keep everything steady for others.</li>
                  <li>Needing one small thing that is just for you.</li>
                </ul>
                <p className="pt-1 text-[11px] text-hvn-text-muted">
                  You do not have to fix all of this today. Let us just name it
                  together.
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-hvn-text-muted">
                <span>20 AI reflections / month on Free</span>
                <Link
                  href="/upgrade"
                  className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Unlock Premium →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRIP: WHO IT’S FOR */}
      <section className="border-y border-slate-800/80 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-xs text-hvn-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-hvn-text-secondary">
            Built for people who are:
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-hvn-subtle bg-slate-900/80 px-3 py-1">
              Always “on”, rarely checked-in with themselves
            </span>
            <span className="rounded-full border border-hvn-subtle bg-slate-900/80 px-3 py-1">
              Good at supporting others, hard on themselves
            </span>
            <span className="rounded-full border border-hvn-subtle bg-slate-900/80 px-3 py-1">
              Wanting insight, not more dashboards
            </span>
          </div>
        </div>
      </section>

      {/* SECTION: HOW HAVENLY WORKS */}
      <section className="border-b border-slate-800/80 bg-slate-950/95 py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-hvn-text-primary sm:text-2xl">
                How Havenly fits into your actual life
              </h2>
              <p className="mt-2 max-w-xl text-sm text-hvn-text-muted">
                No 30-day “challenges”, no pressure. Just small, honest
                check-ins that build a clearer picture of how you have been
                doing over time.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-hvn-card bg-slate-950/80 p-4">
              <p className="text-xs font-semibold text-emerald-300">
                1 · Capture
              </p>
              <h3 className="mt-1 text-sm font-medium text-hvn-text-primary">
                Write what is really going on
              </h3>
              <p className="mt-2 text-xs text-hvn-text-muted">
                Open your journal and write for a few minutes—messy, honest,
                incomplete. Havenly is for you, not for the internet.
              </p>
            </div>

            <div className="rounded-2xl border border-hvn-card bg-slate-950/80 p-4">
              <p className="text-xs font-semibold text-emerald-300">
                2 · Reflect
              </p>
              <h3 className="mt-1 text-sm font-medium text-hvn-text-primary">
                Let the AI gently respond
              </h3>
              <p className="mt-2 text-xs text-hvn-text-muted">
                Havenly’s AI reflects your words back to you, highlights
                emotions, and offers a kinder narrative than your inner critic.
              </p>
            </div>

            <div className="rounded-2xl border border-hvn-card bg-slate-950/80 p-4">
              <p className="text-xs font-semibold text-emerald-300">
                3 · Notice
              </p>
              <h3 className="mt-1 text-sm font-medium text-hvn-text-primary">
                See patterns over time
              </h3>
              <p className="mt-2 text-xs text-hvn-text-muted">
                As entries build up, Insights and Tools help you see what keeps
                repeating: stress patterns, energy dips, and quiet wins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PLANS – FREE VS PREMIUM */}
      <section className="border-b border-slate-800/80 bg-slate-950 py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 max-w-xl">
            <h2 className="text-xl font-semibold text-hvn-text-primary sm:text-2xl">
              Start free. Upgrade only if it genuinely helps.
            </h2>
            <p className="mt-2 text-sm text-hvn-text-muted">
              Havenly is designed so the Free plan is genuinely useful on its
              own. Premium simply gives you more space, more context, and more
              gentle support.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-[minmax(0,1.1fr),minmax(0,1.2fr)]">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-hvn-card bg-slate-950/85 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.65)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-hvn-text-muted">
                Free plan
              </p>
              <p className="mt-1 text-2xl font-semibold text-hvn-text-primary">
                $0 / month
              </p>
              <p className="mt-2 text-xs text-hvn-text-muted">
                For people who want a calmer, more honest place to check in
                without yet committing to a subscription.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-hvn-text-secondary">
                <li>• Private journaling space</li>
                <li>• Up to 20 AI reflections per month</li>
                <li>• Access to core Tools (mood, reflection prompts)</li>
                <li>• Gentle insights over time</li>
              </ul>

              <div className="mt-5">
                <Link
                  href="/magic-login"
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-white"
                >
                  Start with Free
                </Link>
              </div>

              <p className="mt-2 text-[11px] text-hvn-text-muted">
                You can stay on Free as long as you like.
              </p>
            </div>

            {/* Premium */}
            <div className="relative flex flex-col rounded-2xl border border-emerald-500/50 bg-emerald-500/5 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.75)]">
              <div className="absolute right-4 top-4 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                For deeper support
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Premium
              </p>
              <p className="mt-1 text-2xl font-semibold text-hvn-text-primary">
                Coming soon
              </p>
              <p className="mt-2 text-xs text-emerald-100/80">
                Designed for people who want clearer patterns, weekly reviews,
                and more nuanced AI reflections.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-emerald-50/90">
                <li>• Higher reflection limits each month</li>
                <li>• Deeper multi-entry insights and timelines</li>
                <li>• Weekly “how have I really been?” summaries</li>
                <li>• Priority access to new tools & experiments</li>
              </ul>

              <div className="mt-5">
                <Link
                  href="/upgrade"
                  className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  See Premium roadmap
                </Link>
              </div>

              <p className="mt-2 text-[11px] text-emerald-200/80">
                You will always be able to move back to Free if life or budget
                changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FAQ */}
      <section className="bg-slate-950 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-lg font-semibold text-hvn-text-primary sm:text-xl">
            A few questions you might have
          </h2>

          <div className="mt-6 space-y-5 text-sm">
            <div>
              <p className="font-medium text-hvn-text-primary">
                Is Havenly therapy or a replacement for professional help?
              </p>
              <p className="mt-1 text-xs text-hvn-text-muted sm:text-sm">
                No. Havenly is a journaling and reflection companion. It can sit
                alongside therapy, coaching, spiritual direction, or your own
                personal practices—but it is not a clinical or crisis service.
              </p>
            </div>

            <div>
              <p className="font-medium text-hvn-text-primary">
                Do I have to write every day?
              </p>
              <p className="mt-1 text-xs text-hvn-text-muted sm:text-sm">
                Absolutely not. Some people use Havenly a few times a week,
                others just when life feels particularly dense. The goal is
                honest consistency, not perfection.
              </p>
            </div>

            <div>
              <p className="font-medium text-hvn-text-primary">
                What happens to my data?
              </p>
              <p className="mt-1 text-xs text-hvn-text-muted sm:text-sm">
                Your entries are stored securely and are not used to train
                public models. The point of Havenly is to give you a private
                corner online, not to turn your inner life into content.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start gap-3 border-t border-slate-800 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p className="text-hvn-text-muted">
              Ready to give your inner life a quieter place to land?
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Start journaling in 30 seconds
              </Link>
              <Link
                href="/premium"
                className="inline-flex items-center justify-center rounded-full border border-slate-600 px-4 py-2 text-xs text-slate-100 hover:bg-slate-900"
              >
                Learn more about Havenly →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
