// app/page.tsx
import Link from "next/link";
import dynamic from "next/dynamic";

const HomeBelowFold = dynamic(() => import("./(home)/HomeBelowFold"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-hvn-bg text-hvn-text-primary bg-hvn-page-gradient">

      <section className="relative overflow-hidden pt-10 pb-14 sm:pt-24 sm:pb-28">

        {/* Ambient glow - reduced on mobile for perf */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[300px] w-[500px] rounded-full bg-emerald-500/[0.05] blur-3xl sm:h-[500px] sm:w-[800px]" />

        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 md:flex-row md:items-center md:gap-16">

          {/* Left copy */}
          <div className="space-y-6 md:max-w-lg">

            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-500/70">
              Private &middot; Calm &middot; Yours
            </p>

            {/* Headline &mdash; larger on mobile than before, no forced line break */}
            <h1 className="text-[2.1rem] font-semibold leading-[1.15] tracking-tight sm:text-5xl">
              Stop carrying it all{" "}
              <span className="text-emerald-400">in your head.</span>
            </h1>

            <p className="text-[15px] leading-relaxed text-slate-400 sm:text-[17px]">
              Havenly is the private journal that listens, remembers, and helps
              you connect the dots. No advice. No noise. Just clarity &mdash;
              at your own pace.
            </p>

            {/* CTAs &mdash; full width on mobile, row on sm+ */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Link
                href="/magic-login"
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3.5 text-[15px] font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors sm:w-auto sm:py-3 sm:text-sm"
              >
                Start free &mdash; no card needed
              </Link>
              <Link
                href="/insights/preview"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-6 py-3.5 text-[15px] font-medium text-slate-300 hover:bg-slate-900 transition-colors sm:w-auto sm:py-3 sm:text-sm"
              >
                See how it works
              </Link>
            </div>

            {/* Trust signals &mdash; stacked on mobile */}
            <div className="flex flex-col gap-2 pt-1 text-xs text-slate-600 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1.5">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                Your entries never train AI models
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                Private by default, always
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                Free plan, no expiry
              </span>
            </div>
          </div>

          {/* Reflection card &mdash; hidden on very small screens, shown from sm */}
          {/* On mobile we show a simplified version without overflow issues */}
          <div className="relative mx-auto w-full max-w-[360px] shrink-0 sm:block">

            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-emerald-500/[0.06] blur-2xl" />

            <div className="relative rounded-2xl border border-white/[0.07] bg-slate-950/95 p-4 shadow-2xl shadow-black/60 backdrop-blur sm:rounded-3xl sm:p-5">

              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  March 4 &middot; Evening check-in
                </span>
                <span className="text-[10px] text-slate-700">Private &middot; Just for you</span>
              </div>

              <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-3 sm:rounded-2xl sm:p-4">
                <p className="text-[13px] leading-relaxed text-slate-200">
                  &ldquo;I keep saying I&rsquo;m fine but I don&rsquo;t think I mean it anymore.
                  I&rsquo;m tired in a way that sleep doesn&rsquo;t fix.&rdquo;
                </p>
              </div>

              <div className="my-3 flex items-center gap-3 sm:my-4">
                <div className="h-px flex-1 bg-slate-800/60" />
                <span className="text-[10px] text-slate-700 uppercase tracking-widest">Havenly noticed</span>
                <div className="h-px flex-1 bg-slate-800/60" />
              </div>

              <div className="space-y-3">
                <p className="text-[13px] leading-relaxed text-slate-300">
                  This tiredness sounds like it&rsquo;s been building quietly for a
                  while &mdash; not just this week, but longer. There&rsquo;s a difference
                  between being tired <em>from</em> things and being tired
                  <em> of</em> things.
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-[11px] text-violet-300">Exhaustion</span>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-300">Masking</span>
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] text-amber-300">Quiet signal</span>
                </div>

                <p className="text-[12px] text-slate-500 italic">
                  What would it mean to stop saying you&rsquo;re fine &mdash; just for today?
                </p>
              </div>

              <div className="mt-3 border-t border-slate-800/40 pt-3 text-[11px] text-slate-600 sm:mt-4">
                Patterns across 3 weeks &rarr;
                <span className="ml-1 text-emerald-600">Curiosity &middot; Communication &middot; Clarity</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <HomeBelowFold />
    </div>
  );
}
