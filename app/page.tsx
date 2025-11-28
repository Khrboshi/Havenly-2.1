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
                    <
