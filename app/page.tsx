import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* ========================= HERO ========================= */}
      <section className="pt-6 sm:pt-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-300">
            A calmer way to keep up with yourself
          </span>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            A quiet space to notice what&apos;s really been happening in your life.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            Havenly gives you a gentle place to write a few honest sentences,
            then uses calm, non-judgmental AI reflections to help you see the
            patterns, weight, and small wins that are easy to miss when days blur together.
          </p>

          {/* Hero CTAs */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/magic-login"
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-300 sm:w-auto"
            >
              Start free in under 30 seconds
            </Link>

            <Link
              href="/upgrade"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-900 sm:w-auto"
            >
              Explore Premium – $25/month
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            No passwords, no spam. Just a magic link to your inbox and a quiet page to land on.
          </p>
        </div>
      </section>

      {/* ========================= TODAY'S CHECK-IN ========================= */}
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 lg:flex-row">
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Today&apos;s check-in
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-50">
            A few honest sentences are enough.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            “Today was heavy. I got through my tasks, but I felt disconnected and tired.
            I kept scrolling instead of resting. I&apos;m not sure what I actually need,
            but I know this pace isn&apos;t sustainable.”
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Havenly doesn&apos;t ask you to be positive. It simply holds what&apos;s true,
            then reflects it back softly so you can see the theme behind your week.
          </p>
        </div>

        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-50">
            How the reflection works
          </h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>
                You write a short check-in: two or three honest sentences about how the day felt.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>
                Havenly&apos;s AI responds gently, highlighting what seemed heavy, what helped,
                and where your energy actually went.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>
                Over time, Premium adds timelines and patterns so you can see what keeps repeating—
                without needing to dig through old entries.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ========================= WEEKLY RHYTHM ========================= */}
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
          Through a tired week
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-50">
          A simple rhythm that doesn&apos;t ask for perfection.
        </h2>
        <div className="mt-4 grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-900/70 p-4">
            <p className="text-xs font-semibold text-slate-400">Most days</p>
            <p className="mt-2">
              Jot down a few sentences about how the day felt. No streaks, no punishment
              if you skip.
            </p>
          </div>
          <div className="rounded-xl bg-slate-900/70 p-4">
            <p className="text-xs font-semibold text-slate-400">
              When you have a minute
            </p>
            <p className="mt-2">
              Read the reflection Havenly gives you. Notice what keeps coming up
              without forcing change.
            </p>
          </div>
          <div className="rounded-xl bg-slate-900/70 p-4">
            <p className="text-xs font-semibold text-slate-400">
              On Premium weeks
            </p>
            <p className="mt-2">
              See timelines, themes, and patterns that gently show where your energy
              is going—and what actually restores you.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= FREE VS PREMIUM ========================= */}
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:flex-row">
        {/* Free plan card */}
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Free plan
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-50">
            A genuinely useful free space.
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Havenly&apos;s free plan is designed to stand on its own. You can journal
            privately, get light AI reflections, and keep everything in one calm place.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Unlimited private entries.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Gentle AI reflections on individual entries.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Magic-link sign-in—no passwords to remember.</span>
            </li>
          </ul>

          <div className="mt-5">
            <Link
              href="/magic-login"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white sm:w-auto"
            >
              Start for free
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            You can stay on the free plan as long as you like. Premium is there only
            if it becomes clearly helpful.
          </p>
        </div>

        {/* Premium plan card */}
        <div className="flex-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Premium – $25/month
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-50">
            Deeper clarity, without added pressure.
          </h2>
          <p className="mt-3 text-sm text-slate-200">
            Premium is for when you&apos;re ready to see the bigger picture:
            timelines, recurring themes, and gentle insights across weeks and months—not just one day.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Deeper AI reflections that remember context over time.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Emotional timelines and patterns that highlight hidden patterns.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Higher monthly credit balance for reflections and tools.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Early access to new Premium-only tools.</span>
            </li>
          </ul>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/upgrade"
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 sm:w-auto"
            >
              Explore Premium
            </Link>
            <Link
              href="/premium"
              className="inline-flex w-full items-center justify-center rounded-full border border-emerald-500/40 px-5 py-2.5 text-sm text-emerald-200 transition hover:bg-emerald-500/10 sm:w-auto"
            >
              View Premium space
            </Link>
          </div>

          <p className="mt-3 text-xs text-emerald-200/80">
            Cancel anytime. Your writing remains yours, whether you&apos;re on
            Free or Premium.
          </p>
        </div>
      </section>

      {/* ========================= GENTLE REASSURANCE ========================= */}
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-slate-50">
          Built for tired, honest humans.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Havenly isn&apos;t here to optimize you or judge you. It&apos;s here so that when
          someone asks, “How have you been lately?” you have a softer, clearer answer
          than “busy.” A few minutes here is often enough to feel more grounded in
          your own story.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Start with the free plan. Upgrade only if the deeper clarity feels worth it.
          </p>
          <Link
            href="/magic-login"
            className="inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-900 transition hover:bg-white"
          >
            Open my first check-in
          </Link>
        </div>
      </section>
    </div>
  );
}
