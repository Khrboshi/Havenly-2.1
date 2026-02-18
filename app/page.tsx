// app/page.tsx
import Link from "next/link";
import dynamic from "next/dynamic";

// Defer below-the-fold markup until after initial paint.
const HomeBelowFold = dynamic(() => import("./(home)/HomeBelowFold"), {
  ssr: false,
});

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
                href="/insights/preview"
                className="inline-flex items-center justify-center rounded-full border border-slate-600/80 bg-slate-900/70 px-5 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                See what’s coming
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

            {/* TRUST-PATH */}
            <div className="mt-2 space-y-1 text-xs text-hvn-text-muted">
              <p>
                Your journal is meant to stay yours.{" "}
                <span className="text-hvn-text-secondary">Private by default.</span>
              </p>
              <p>
                Want the details?{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  Read the Privacy Policy →
                </Link>
              </p>
            </div>
          </div>

          {/* Right: card mock */}
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
                <p className="font-semibold text-emerald-300">Today you seem:</p>
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
                <span>Reflections that feel human.</span>
                <Link
                  href="/insights/preview"
                  className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Insights coming soon →
                </Link>
              </div>

              <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-hvn-text-muted">
                No pressure. Free stays useful on its own. “Coming soon” features
                will unlock gradually.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BELOW THE FOLD */}
      <HomeBelowFold />
    </div>
  );
}
