// app/page.tsx
// Havenly 2.1 – Logged-out Landing (Home)

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-[#050816] text-slate-100">
      {/* ============== HERO ============== */}
      <section className="w-full bg-gradient-to-b from-[#0b1120] via-[#050816] to-[#050816] px-6 pb-24 pt-24 md:px-10 lg:px-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT – COPY & CTAs */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-slate-950/60 px-4 py-1 text-xs font-medium text-sky-200/90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              A calm space for overloaded minds
            </div>

            <h1 className="text-balance text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl md:text-5xl">
              When your thoughts feel crowded,
              <span className="block text-sky-300">
                Havenly helps you hear yourself clearly.
              </span>
            </h1>

            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Havenly is a quiet journaling space with gentle AI reflections. No
              streaks, no pressure, no performance. Just a private place to
              understand what you feel, why it’s there, and how it shifts over
              time. Start free. Upgrade only if deeper guidance truly serves
              you.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/magic-login"
                className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-300"
              >
                Start a free check-in
              </Link>

              <Link
                href="/upgrade"
                className="rounded-full border border-slate-600 px-6 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-800/70"
              >
                See Premium options
              </Link>
            </div>

            <p className="text-xs text-slate-400">
              Free plan requires no card. Your space stays private even if you
              never upgrade.
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="rounded-full bg-slate-950/80 px-3 py-1">
                Designed for sensitive, thoughtful people
              </span>
              <span className="rounded-full bg-slate-950/80 px-3 py-1">
                Works on heavy days, not just good ones
              </span>
            </div>
          </div>

          {/* RIGHT – PREVIEW CARD */}
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-700/70 bg-[#050816]/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
                <div>
                  <p className="font-medium text-slate-100">Evening check-in</p>
                  <p className="text-slate-400">3–5 minutes · just for you</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-sky-200">
                  Calm mode
                </span>
              </div>

              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Tonight’s prompt
                </p>
                <p className="mt-1 text-sm text-slate-100">
                  “If your mind could say out loud what it’s carrying tonight,
                  what would it share first?”
                </p>
              </div>

              <div className="mb-6 rounded-xl border border-slate-700/70 bg-slate-900/80 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  AI · Gentle reflection
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  You’re holding a lot, and it makes sense that it feels heavy.
                  Noticing this is already an important step. It might be kinder
                  to choose just one thing to care about tonight, instead of
                  asking yourself to carry everything perfectly.
                </p>
              </div>

              <div className="flex justify-between gap-4 text-[11px] text-slate-400">
                <div className="flex-1">
                  <p className="font-semibold text-slate-100">Free</p>
                  <p>Private journal + gentle reflections.</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-100">Premium</p>
                  <p>Deeper themes & long-term emotional patterns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== WHO IT'S FOR ============== */}
      <section className="border-t border-slate-800/70 bg-[#050816] px-6 pb-16 pt-14 md:px-10 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
              Built for minds that feel “too full” a lot of the time.
            </h2>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              Havenly supports people who replay conversations at night, feel
              emotionally overloaded, or struggle to make space for their own
              needs while caring about everyone else.
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
                text: "You sense emotional cycles, but it’s hard to see them clearly alone.",
              },
              {
                title: "You want gentler self-talk",
                text: "You’re tired of tools that feel like pressure or performance. You want something kinder.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-800 bg-[#050816] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.45)]"
              >
                <h3 className="text-sm font-semibold text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="border-t border-slate-800/70 bg-[#050816] px-6 pb-18 pt-14 md:px-10 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
              How Havenly works (on real, messy days).
            </h2>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              No streaks. No gamification. Just a simple ritual you can return
              to, even when your mind feels scattered.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "Step 1",
                title: "Drop in for a few minutes",
                text: "You land on one gentle prompt. No noise, no feeds, no pressure.",
              },
              {
                step: "Step 2",
                title: "Write what feels true today",
                text: "Say as much or as little as you like. Havenly holds it quietly, without judgment.",
              },
              {
                step: "Step 3",
                title: "Let AI reflect things back",
                text: "You receive a gentle reflection. On Premium, Havenly highlights themes across weeks and months.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-slate-800 bg-[#050816] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.45)]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {item.step}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FREE vs PREMIUM ============== */}
      <section className="border-t border-slate-800/70 bg-[#050816] px-6 pb-24 pt-14 md:px-10 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
              One calm space. Two ways to use it.
            </h2>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              Use the free space as long as you need. Upgrade when you want
              deeper understanding and a clearer sense of the story behind your
              days.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Free plan */}
            <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#050816] p-7 shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Free
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-50">
                Havenly Free
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                A steady, private outlet for your thoughts and feelings—without
                any pressure to pay or perform.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>Unlimited journal entries</li>
                <li>Gentle reflections focused on validation</li>
                <li>Simple timeline of your emotional days</li>
              </ul>
              <Link
                href="/magic-login"
                className="mt-6 inline-flex w-fit text-sm font-medium text-emerald-300 hover:text-emerald-200"
              >
                Open your free space →
              </Link>
            </div>

            {/* Premium plan */}
            <div className="relative flex flex-col rounded-2xl border border-emerald-400/70 bg-[#050816] p-7 shadow-[0_25px_65px_rgba(0,0,0,0.75)]">
              <div className="absolute right-6 top-6 rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-semibold text-slate-950">
                Most depth
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300/90">
                Premium
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-50">
                Havenly Premium
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                For deeper emotional themes and long-term patterns—helping you
                understand not just today, but how your inner world is shifting.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>Emotional themes across weeks & months</li>
                <li>Deeper reflections that gently challenge unhelpful stories</li>
                <li>Early access to new supportive tools & journeys</li>
              </ul>
              <Link
                href="/upgrade"
                className="mt-6 inline-flex w-fit rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="border-t border-slate-800/70 bg-[#050816] px-6 pb-24 pt-12 md:px-10 lg:px-24">
        <div className="mx-auto max-w-xl space-y-5 text-center">
          <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
            You don’t have to hold everything alone.
          </h2>
          <p className="text-sm text-slate-300 sm:text-base">
            Havenly offers a small, repeatable ritual: a few quiet minutes to
            notice what you’re carrying, and a gentle reflection to help you
            make sense of it in a kinder way.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/magic-login"
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Begin a free check-in
            </Link>
            <Link
              href="/upgrade"
              className="rounded-full border border-slate-600 px-6 py-3 text-sm font-medium text-slate-100 hover:bg-slate-800/70"
            >
              Learn about Premium
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
