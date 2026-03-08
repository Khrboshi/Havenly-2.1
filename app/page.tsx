import Link from "next/link";
import HomeBelowFold from "./(home)/HomeBelowFold";

export const metadata = {
  title: "Havenly - A Private Journal That Helps You See the Pattern",
  description:
    "Write what is weighing on you. Havenly gives back gentle reflections and helps you spot recurring patterns across your entries. Free to start.",
  openGraph: {
    title: "Havenly - A Private Journal That Helps You See the Pattern",
    description:
      "Write what is weighing on you. Havenly gives back gentle reflections and helps you spot recurring patterns across your entries. Free to start.",
    url: "https://havenly-2-1.vercel.app/",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-hvn-bg bg-hvn-page-gradient text-hvn-text-primary">
      <section className="relative overflow-hidden pb-12 pt-10 sm:pb-16 sm:pt-16 md:pb-24 md:pt-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-3xl sm:h-[520px] sm:w-[820px]" />
        <div className="pointer-events-none absolute right-[-80px] top-24 h-56 w-56 rounded-full bg-cyan-500/[0.04] blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)] md:items-center md:gap-14">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-500/75">
              Private journaling that reflects back
            </p>

            <h1 className="mt-4 text-[2.35rem] font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-[3.55rem]">
              Write what is heavy.
              <br />
              <span className="text-emerald-400">Start seeing the pattern.</span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-400 sm:text-[17px]">
              Havenly is a private AI journal that helps you turn scattered thoughts into
              gentle reflections and recurring patterns you can actually understand.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition-colors hover:bg-emerald-400 sm:px-6 sm:py-3.5 sm:text-sm"
              >
                Start free — no card needed
              </Link>

              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/30 px-6 py-4 text-base font-medium text-slate-300 transition-colors hover:bg-slate-900 sm:px-6 sm:py-3.5 sm:text-sm"
              >
                See what Premium adds
              </Link>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Private by default
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Entries never train AI models
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Free plan, no expiry
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  You write
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  A few honest sentences about what feels off, heavy, confusing, or hard
                  to name.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Havenly reflects
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  A short response that helps you hear what your own words may be
                  pointing to.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Patterns emerge
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Over time, recurring themes start to surface across your entries.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-emerald-500/[0.08] blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/95 p-5 shadow-2xl shadow-black/60 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  Evening check-in
                </span>
                <span className="text-[10px] text-slate-700">Private • Just for you</span>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4">
                <p className="text-[13px] leading-relaxed text-slate-200">
                  “I keep telling people I’m okay, but lately even small things feel
                  heavier than they should. I think I’m more drained than I’ve been
                  admitting.”
                </p>
              </div>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800/60" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                  Havenly reflects
                </span>
                <div className="h-px flex-1 bg-slate-800/60" />
              </div>

              <div className="space-y-3">
                <p className="text-[13px] leading-relaxed text-slate-300">
                  It sounds like you have been carrying more than you have let yourself
                  fully name. This does not read like one bad day. It reads like a weight
                  that has been building quietly for a while.
                </p>

                <p className="text-[13px] leading-relaxed text-slate-300">
                  Sometimes the first sign of burnout is not collapse. It is how often
                  “I’m fine” becomes a way to keep moving.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-300">
                    Emotional load
                  </span>
                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-[11px] text-violet-300">
                    Masking
                  </span>
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] text-amber-300">
                    Burnout signal
                  </span>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-3.5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
                    Pattern across recent entries
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-400">
                    Over the last 3 weeks, your entries keep returning to responsibility,
                    emotional exhaustion, and saying you are okay before you actually feel
                    okay.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 md:hidden">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
                  Most present
                </p>
                <p className="mt-2 text-sm text-slate-200">Emotional load</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
                  Keeps returning
                </p>
                <p className="mt-2 text-sm text-slate-200">Over-responsibility</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
                  Reflection style
                </p>
                <p className="mt-2 text-sm text-slate-200">Gentle, clear, private</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeBelowFold />
    </div>
  );
}
