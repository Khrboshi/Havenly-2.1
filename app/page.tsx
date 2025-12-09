"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 pt-28 pb-20">
        <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium mb-6">
          A calmer way to keep up with yourself
        </div>

        <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
          A quiet place to write. <br /> A kinder way to see the patterns.
        </h1>

        <p className="max-w-2xl text-slate-300 text-lg leading-relaxed mb-8">
          Havenly is a private journaling space with gentle AI reflections. 
          Write a few honest lines, and Havenly softly highlights what has been 
          weighing on you, supporting you, or quietly shifting over time—
          without judgment or productivity pressure.
        </p>

        <div className="flex gap-4 mb-10">
          <Link
            href="/magic-login"
            className="px-6 py-3 rounded-full bg-emerald-400 text-slate-900 font-semibold text-sm hover:bg-emerald-300 transition"
          >
            Start free
          </Link>

          <Link
            href="/upgrade"
            className="px-6 py-3 rounded-full border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-900 transition"
          >
            Explore Premium
          </Link>
        </div>

        <p className="text-xs text-slate-500 max-w-sm">
          No credit card required to start. Upgrade only if Premium feels clearly valuable for you.
        </p>
      </section>

      {/* AI PREVIEW BLOCK — IMPROVED FOR CONVERSION */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 max-w-xl">
          <h3 className="text-sm font-semibold text-emerald-300 mb-4">
            A gentle reflection example
          </h3>

          <div className="bg-slate-800/40 rounded-xl p-4 text-sm text-slate-200 mb-4 leading-relaxed">
            “Today felt scattered. I kept moving between tasks but never really 
            landed anywhere. Writing it down helped me notice that I’ve been 
            carrying more tension than I thought.”
          </div>

          <h4 className="text-xs font-semibold text-slate-300 mb-2">
            HAVENLY REFLECTS BACK
          </h4>

          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            It looks like you’ve been juggling more than your mind had space 
            for. This isn’t a failure—it’s your brain asking for one clear 
            moment to breathe. A small pause today might help you reset without 
            forcing anything.
          </p>

          <div className="text-xs text-slate-500">
            Private, encrypted journaling · Light AI reflections on Free
          </div>
        </div>
      </section>

      {/* VALUE SECTIONS (unchanged except styling tightened) */}
      <section className="max-w-6xl mx-auto px-4 pb-32">
        <h2 className="text-2xl font-semibold mb-6">How Havenly fits a tired week</h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <span className="text-emerald-300 font-semibold">1</span>
            <p className="text-slate-300">
              Drop a few honest lines about what actually happened—in your own words.
            </p>
          </div>

          <div className="flex gap-4">
            <span className="text-emerald-300 font-semibold">2</span>
            <p className="text-slate-300">
              Havenly reflects back what mattered. Gentle summaries highlight themes and 
              emotional load without judgment.
            </p>
          </div>

          <div className="flex gap-4">
            <span className="text-emerald-300 font-semibold">3</span>
            <p className="text-slate-300">
              Over time, patterns begin to feel clearer. Premium adds timelines, deeper insights, 
              and recurring themes.
            </p>
          </div>
        </div>
      </section>

      {/* SINGLE FOOTER (duplicate removed) */}
      <footer className="border-t border-slate-800 py-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Havenly 2.1. All rights reserved.  
        <Link href="/privacy" className="ml-4 hover:underline">
          Privacy Policy
        </Link>
      </footer>
    </main>
  );
}
