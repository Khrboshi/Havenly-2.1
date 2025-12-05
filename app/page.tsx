// app/page.tsx
// Havenly Landing – Soft Blue Calm, rich content, high-conversion structure
// - No glow, no neon, no harsh whites
// - Clear free vs premium story
// - Designed for psychological safety and engagement

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-[#050816] text-gray-100">
      {/* ================= HERO ================= */}
      <section className="w-full bg-gradient-to-b from-[#111827] via-[#0D1422] to-[#050816] px-6 pb-28 pt-24 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT: Hero copy */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-black/20 px-4 py-1 text-xs font-medium text-teal-200/80">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
              A calm space for overloaded minds
            </div>

            <h1 className="text-balance text-3xl font-semibold leading-tight text-gray-50 sm:text-4xl md:text-5xl">
              When your thoughts feel crowded,
              <span className="block text-[#7AB3FF]">
                Havenly helps you hear yourself clearly.
              </span>
            </h1>

            <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
              Havenly is a quiet journaling space with gentle AI reflections.
              It doesn’t judge, chase streaks, or push you to “optimize”.
              It simply helps you notice what you feel, why it’s there, and
              how it shifts over time. Start free. Upgrade only if deeper
              guidance truly serves you.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/magic-login"
                className="rounded-full bg-[#4CC5A9] px-6 py-3 text-sm font-semibold text-[#050816] transition hover:bg-[#3db497]"
              >
                Start a free check-in
              </Link>
              <Link
                href="/upgrade"
                className="rounded-full border border-gray-500/50 px-6 py-3 text-sm font-medium text-gray-100 transition hover:bg-gray-800/50"
              >
                See Premium options
              </Link>
            </div>

            <p className="text-xs text-gray-400">
              Free plan requires no card. Keep it as your private space even if
              you never upgrade.
            </p>

            {/* Small trust line */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
              <span className="rounded-full bg-black/30 px-3 py-1">
                Designed for sensitive, thoughtful people
              </span>
              <span className="rounded-full bg-black/30 px-3 py-1">
                Works on heavy days, not just good ones
              </span>
            </div>
          </div>

          {/* RIGHT: Preview card */}
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-gray-700/50 bg-[#0B1020]/90 p-6 shadow-[0_0_40px_-20px_rgba(0,0,0,0.7)]">
              <div className="mb-4 flex items-center justify-between text-xs text-gray-300/90">
                <div>
                  <p className="font-medium text-gray-100">Evening check-in</p>
                  <p className="text-gray-400">3–5 minutes · just for you</p>
                </div>
                <span className="rounded-full bg-gray-800 px-3 py-1 text-[11px] text-teal-200">
                  Calm mode
                </span>
              </div>

              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-wide text-gray-400">
                  Tonight’s prompt
                </p>
                <p className="mt-1 text-sm text-gray-100">
                  “If your mind could say out loud what it’s carrying tonight,
                  what would it share first?”
                </p>
              </div>

              <div className="mb-6 rounded-xl border border-gray-700/60 p-4">
                <p className="text-[11px] uppercase tracking-wide text-gray-400">
                  AI · Gentle reflection
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  You’re holding a lot, and it makes sense that it feels heavy.
                  Noticing this is already an important step. It might be
                  kinder to choose just one thing to care about tonight, rather
                  than asking yourself to carry everything perfectly.
                </p>
              </div>

              <div className="flex justify-between gap-4 text-[11px] text-gray-400">
                <div className="flex-1">
                  <p className="font-semibold text-gray-100">Free</p>
                  <p>Private journal + gentle reflections.</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-100">Premium</p>
                  <p>Deeper themes and long-term patterns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== WHO IT'S FOR / VALUE PILLARS ============== */}
      <section className="px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-100 sm:text-3xl">
              Built for minds that feel “too full” a lot of the time.
            </h2>
            <p className="text-sm text-gray-300 sm:text-base max-w-2xl">
              Havenly is especially supportive if you tend to replay
              conversations at night, feel emotionally overloaded, or struggle
              to make space for your own needs while caring about everyone else.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "You want a safe outlet",
                text: "A place to put what you’re holding without worrying how it sounds, looks, or should be ‘fixed’.",
              },
              {
                title: "You want to see patterns",
                text: "You sense cycles in your mood or energy, but it’s hard to see them clearly on your own.",
              },
              {
                title: "You want gentler self-talk",
                text: "You’re tired of tools that feel like pressure or performance. You want something kinder.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-700/50 bg-[#0B1020] p-5"
              >
                <h3 className="text-sm font-semibold text-gray-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="border-t border-gray-800/70 bg-[#050816] px-6 py-18 pb-20 pt-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-100 sm:text-3xl">
              How Havenly works (on real, messy days).
            </h2>
            <p className="text-sm text-gray-300 sm:text-base max-w-2xl">
              No streaks, no gamification, no pressure to show up perfectly.
              Just a simple rhythm that helps you feel a little less alone in
              your own head.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-800/70 bg-[#090F1C] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Step 1
              </p>
              <h3 className="mt-2 text-sm font-semibold text-gray-50">
                Drop in for a few minutes
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-300">
                You land on one simple, gentle prompt. No feeds, no noise, no
                pressure to come up with the “right” answer.
              </p>
            </div>

            <div className="rounded-xl border border-gray-800/70 bg-[#090F1C] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Step 2
              </p>
              <h3 className="mt-2 text-sm font-semibold text-gray-50">
                Write what feels true today
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-300">
                You share as much or as little as you like. Havenly holds it
                quietly, without judgment or urgency to change.
              </p>
            </div>

            <div className="rounded-xl border border-gray-800/70 bg-[#090F1C] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Step 3
              </p>
              <h3 className="mt-2 text-sm font-semibold text-gray-50">
                Let AI reflect things back
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-300">
                You receive a gentle reflection. On Premium, Havenly also
                highlights emotional themes and patterns across weeks and months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FREE vs PREMIUM ============== */}
      <section className="border-t border-gray-800/70 bg-[#050816] px-6 pb-24 pt-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-100 sm:text-3xl">
              One calm space. Two ways to use it.
            </h2>
            <p className="text-sm text-gray-300 sm:text-base max-w-2xl">
              Start with the free space for as long as you need. Move to
              Premium if you want Havenly to help you see the deeper story
              behind your days.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Free plan */}
            <div className="flex flex-col rounded-2xl border border-gray-800/80 bg-[#090F1C] p-7">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Free
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-50">
                Havenly Free
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                A steady, private outlet for your thoughts and feelings—without
                any pressure to pay or perform.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>Unlimited journaling entries</li>
                <li>Gentle reflections focused on validation</li>
                <li>Simple timeline of what you’ve been carrying lately</li>
              </ul>
              <Link
                href="/magic-login"
                className="mt-6 inline-flex w-fit text-sm font-medium text-teal-300 hover:text-teal-200"
              >
                Open your free space →
              </Link>
            </div>

            {/* Premium plan */}
            <div className="relative flex flex-col rounded-2xl border border-teal-400/70 bg-[#0B1421] p-7">
              <div className="absolute right-6 top-6 rounded-full bg-teal-400 px-3 py-1 text-[11px] font-semibold text-[#050816]">
                Most depth
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-200/90">
                Premium
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-50">
                Havenly Premium
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                For when you’re ready to understand not just how you feel today,
                but how your inner world has been shifting over time.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>Emotional themes across weeks & months</li>
                <li>Deeper reflections that gently challenge unhelpful stories</li>
                <li>Early access to new supportive tools and journeys</li>
              </ul>
              <Link
                href="/upgrade"
                className="mt-6 inline-flex w-fit rounded-full bg-[#4CC5A9] px-5 py-3 text-sm font-semibold text-[#050816] hover:bg-[#3db497]"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="border-t border-gray-800/70 bg-[#050816] px-6 pb-24 pt-14 md:px-12 lg:px-24">
        <div className="mx-auto max-w-xl text-center space-y-5">
          <h2 className="text-2xl font-semibold text-gray-100 sm:text-3xl">
            You don’t have to hold everything alone.
          </h2>
          <p className="text-sm text-gray-300 sm:text-base">
            Havenly offers a small, repeatable ritual: a few honest minutes
            to notice what you’re carrying, and a gentle reflection to help
            you make sense of it over time.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/magic-login"
              className="rounded-full bg-[#4CC5A9] px-6 py-3 text-sm font-semibold text-[#050816] hover:bg-[#3db497]"
            >
              Begin a free check-in
            </Link>
            <Link
              href="/upgrade"
              className="rounded-full border border-gray-600 px-6 py-3 text-sm font-medium text-gray-100 hover:bg-gray-800/50"
            >
              Learn about Premium
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
