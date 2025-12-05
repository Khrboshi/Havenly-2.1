// app/page.tsx
// Havenly Landing – Soft Blue Calm v2.2
// Improvements included:
// - CTA spacing + button hierarchy polish
// - Balanced left/right hero layout
// - Improved section spacing + scanning hierarchy
// - Footer CTA tightened
// - No breaking changes, no logic modifications

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-[#050816] text-gray-100">
      {/* ================= HERO ================= */}
      <section className="w-full bg-gradient-to-b from-[#111827] via-[#0D1422] to-[#050816] px-6 pb-24 pt-24 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-14 lg:flex-row lg:items-center lg:justify-between">

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
              It doesn’t judge or push you. It simply helps you notice what you
              feel, why it’s there, and how it changes over time.
            </p>

            {/* CTA row — spacing improved */}
            <div className="flex flex-wrap gap-4">
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

            {/* Micro-tags */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
              <span className="rounded-full bg-black/30 px-3 py-1">
                Designed for sensitive, thoughtful people
              </span>
              <span className="rounded-full bg-black/30 px-3 py-1">
                Works on heavy days, not just good ones
              </span>
            </div>
          </div>

          {/* RIGHT: Preview card — reduced width + better balance */}
          <div className="w-full lg:max-w-sm">
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
                  Choosing one thing to care about tonight is kinder than asking
                  yourself to carry everything perfectly.
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

      {/* ================= WHO IT'S FOR ================= */}
      <section className="px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-100 sm:text-3xl">
              Built for minds that feel “too full” a lot of the time.
            </h2>
            <p className="text-sm text-gray-300 sm:text-base max-w-2xl">
              Havenly supports people who replay conversations, feel emotionally
              overloaded, or struggle to make space for their own needs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "You want a safe outlet",
                text: "A place to put what you’re holding without worrying how it sounds or should be ‘fixed’.",
              },
              {
                title: "You want to see patterns",
                text: "You sense emotional cycles, but it’s hard to see them clearly alone.",
              },
              {
                title: "You want gentler self-talk",
                text: "You're tired of tools that feel like pressure or performance.",
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

      {/* ================= HOW IT WORKS ================= */}
      <section className="border-t border-gray-800/70 bg-[#050816] px-6 pt-16 pb-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-100 sm:text-3xl">
              How Havenly works (on real, messy days).
            </h2>
            <p className="text-sm text-gray-300 sm:text-base max-w-2xl">
              No streaks. No gamification. Just a calm ritual you can return to.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "Step 1",
                title: "Drop in for a few minutes",
                text: "You land on one gentle prompt. No noise, no pressure.",
              },
              {
                step: "Step 2",
                title: "Write what feels true today",
                text: "Say as much or as little as you like. Havenly holds it quietly.",
              },
              {
                step: "Step 3",
                title: "Let AI reflect things back",
                text: "Premium highlights emotional themes across weeks & months.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-800/70 bg-[#090F1C] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {item.step}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-gray-50">
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

      {/* ================= FREE VS PREMIUM ================= */}
      <section className="border-t border-gray-800/70 bg-[#050816] px-6 pt-16 pb-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-8">

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-100 sm:text-3xl">
              One calm space. Two ways to use it.
            </h2>
            <p className="text-sm text-gray-300 sm:text-base max-w-2xl">
              Use the free space as long as you need. Upgrade when you want
              deeper understanding.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-gray-800/80 bg-[#090F1C] p-7">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Free
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-50">
                Havenly Free
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                A steady, private outlet—without pressure to perform.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>Unlimited journal entries</li>
                <li>Gentle reflections</li>
                <li>Simple timeline of your days</li>
              </ul>

              <Link
                href="/magic-login"
                className="mt-6 inline-flex w-fit text-sm font-medium text-teal-300 hover:text-teal-200"
              >
                Open your free space →
              </Link>
            </div>

            {/* Premium */}
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
                For deeper emotional themes and long-term patterns.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>Emotional themes across weeks & months</li>
                <li>Deeper reflections</li>
                <li>Early access to new tools</li>
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

      {/* ================= FINAL CTA ================= */}
      <section className="border-t border-gray-800/70 bg-[#050816] px-6 pt-10 pb-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-xl text-center space-y-5">
          <h2 className="text-2xl font-semibold text-gray-100 sm:text-3xl">
            You don’t have to hold everything alone.
          </h2>
          <p className="text-sm text-gray-300 sm:text-base">
            A small, repeatable ritual to help you notice what you’re carrying,
            and make sense of it in a gentler way.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-4">
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
