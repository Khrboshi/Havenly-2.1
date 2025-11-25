export const dynamic = "force-dynamic";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen px-4 pt-28 pb-32 mx-auto max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-xs tracking-[0.22em] text-emerald-300">
            HAVENLY 2.1 • EARLY ACCESS
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-slate-50">
            A calm space to
            <br />
            <span className="text-emerald-300">decompress your day</span>
            <br />
            in just a few minutes.
          </h1>

          <p className="text-slate-300 text-base max-w-md">
            Write a few honest sentences each day, and Havenly’s gentle AI
            reflection helps you see your day with more clarity and compassion.
            No pressure, no streaks, no public feed.
          </p>

          <Link
            href="/magic-login"
            className="inline-flex rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-200"
          >
            Start journaling now
          </Link>

          <ul className="text-xs text-slate-400 space-y-1 pt-2">
            <li>Free forever for daily journaling.</li>
            <li>Premium deeper insights coming soon.</li>
            <li>Your entries stay fully private.</li>
          </ul>
        </div>

        <div className="hidden md:block">
          <img
            src="/landing-preview.png"
            alt="Havenly preview"
            className="rounded-xl border border-slate-800 shadow-xl opacity-90"
          />
        </div>
      </div>
    </main>
  );
}
