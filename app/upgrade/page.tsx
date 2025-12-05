// app/upgrade/page.tsx
// Upgrade to Havenly Premium – logged out, with sign-in banner

import Link from "next/link";

export default function UpgradePage() {
  return (
    <main className="min-h-screen w-full bg-[#050816] text-slate-100">
      <section className="px-6 pb-24 pt-20 md:px-10 lg:px-24">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          {/* Logged-out banner */}
          <div className="mt-4 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-3 text-xs text-slate-200 sm:px-6 sm:text-sm">
            <span>You need to sign in before upgrading. </span>
            <Link
              href="/magic-login"
              className="font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Sign in to your Havenly space →
            </Link>
          </div>

          {/* Hero row */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            {/* LEFT – Story & CTA */}
            <div className="flex-1 space-y-5">
              <span className="inline-flex rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-200">
                Havenly Premium
              </span>

              <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
                A deeper, calmer way to understand yourself.
              </h1>

              <p className="text-sm text-slate-300 sm:text-base">
                The free Havenly space helps you slow down and express yourself.
                Premium takes you further—gently showing emotional themes,
                supportive insights, and long-term patterns that help you make
                sense of what you’ve been carrying.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/magic-login"
                  className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-sky-300"
                >
                  Upgrade to Premium
                </Link>
                <p className="text-xs text-slate-400">
                  No ads. No pressure. Just clarity and support.
                </p>
              </div>
            </div>

            {/* RIGHT – What Premium adds */}
            <aside className="flex-1 rounded-2xl border border-slate-800 bg-[#050816] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.6)]">
              <h2 className="text-sm font-semibold text-slate-50">
                What Premium adds
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>
                  • Deeper AI reflections that gently highlight what mattered
                  most in your week.
                </li>
                <li>
                  • Understanding emotional themes and recurring internal
                  patterns.
                </li>
                <li>
                  • Supportive insights that help you feel less alone with what
                  you’re carrying.
                </li>
                <li>
                  • Early access to new calming tools and reflective journeys.
                </li>
              </ul>

              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-xs text-slate-300">
                Havenly Premium stays quiet and gentle—no streaks, no
                productivity pressure. Just clearer understanding of what shapes
                your inner world.
              </div>
            </aside>
          </div>

          {/* Free vs Premium table */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-50">
                Free vs Premium
              </h2>
              <p className="max-w-2xl text-sm text-slate-300">
                Havenly always includes a free journaling space. Premium is for
                when you’re ready to see what’s been shifting beneath the
                surface.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050816] shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
              <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/70 px-5 py-4 text-xs font-semibold text-slate-300">
                <div>Feature</div>
                <div>Free</div>
                <div>Premium</div>
              </div>

              <div className="divide-y divide-slate-800 text-sm text-slate-200">
                {[
                  {
                    feature: "Daily private journaling",
                    free: "Included",
                    premium: "Included",
                  },
                  {
                    feature: "Gentle AI reflections",
                    free: "Short + simple",
                    premium: "Deeper, more supportive",
                  },
                  {
                    feature: "Patterns & emotional themes",
                    free: "Not available",
                    premium: "Full insight timeline",
                  },
                  {
                    feature: "Advanced wellbeing tools",
                    free: "Limited",
                    premium: "Everything unlocked",
                  },
                  {
                    feature: "Early access to new features",
                    free: "No",
                    premium: "Yes",
                  },
                ].map((row) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-3 px-5 py-4 text-xs sm:text-sm"
                  >
                    <div className="pr-4 text-slate-300">{row.feature}</div>
                    <div className="text-slate-400">{row.free}</div>
                    <div className="text-emerald-300">{row.premium}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Who Premium is for / How upgrading works */}
          <section className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-slate-800 bg-[#050816] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.6)]">
              <h2 className="text-sm font-semibold text-slate-50">
                Who Premium is for
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                Premium is for people who want to understand their emotional
                life—not monitor it like a productivity dashboard. It’s about
                clarity, not control.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>
                  • People who feel mentally overloaded and want calm structure.
                </li>
                <li>
                  • Anyone who journals but wishes they could see patterns more
                  clearly.
                </li>
                <li>
                  • Those who want emotional support—not productivity tools.
                </li>
                <li>
                  • People who enjoy Havenly’s tone and want the full, deeper
                  experience.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#050816] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.6)]">
              <h2 className="text-sm font-semibold text-slate-50">
                How upgrading works
              </h2>
              <ol className="mt-3 space-y-2 text-sm text-slate-300">
                <li>1. Sign in or create your free Havenly space.</li>
                <li>2. Tap “Upgrade to Premium” on this page.</li>
                <li>3. Your account unlocks Premium automatically.</li>
              </ol>
              <p className="mt-3 text-xs text-slate-400">
                You stay in full control. Your free journaling space remains
                yours forever.
              </p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="mt-4 rounded-2xl border border-slate-800 bg-[#050816] p-6 text-center shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
            <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
              Ready to understand yourself more deeply?
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Premium helps you see emotional themes, receive deeper support,
              and notice the quiet shifts that matter most.
            </p>
            <div className="mt-5 flex justify-center">
              <Link
                href="/magic-login"
                className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-sky-300"
              >
                Upgrade now
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Prefer staying on the free version? That’s completely fine.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
