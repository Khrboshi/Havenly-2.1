import Link from "next/link";

export const metadata = {
  title: "Upgrade to Havenly Premium",
  description:
    "See the deeper pattern behind your entries with Havenly Premium: unlimited reflections, recurring themes, weekly summaries, and clearer insight over time.",
};

const premiumFeatures = [
  {
    title: "Unlimited reflections",
    body: "Reflect on every entry, not just a few each month.",
  },
  {
    title: "Full pattern insights",
    body: "See what repeats across weeks and months, not only what stands out today.",
  },
  {
    title: "Weekly personal summary",
    body: "Get a concise written mirror of what Havenly noticed across the week.",
  },
  {
    title: "Why-this-keeps-happening insight",
    body: "Go beyond surface description and get closer to the recurring emotional loop underneath.",
  },
  {
    title: "Everything in Free",
    body: "Keep the private writing space, gentle prompts, and all core journaling features.",
  },
];

const faqs = [
  {
    q: "What if I do not write very often?",
    a: "Premium can still be worthwhile. Patterns can begin emerging from a small number of entries, and the weekly summary reflects whatever you have written, even if it was a lighter week.",
  },
  {
    q: "Will I be charged automatically every month?",
    a: "Yes. Premium renews monthly until you cancel. You can manage or cancel your subscription from Settings, and you keep access until the end of the paid period.",
  },
  {
    q: "Is my data safe and private?",
    a: "Yes. Your entries stay private, are never sold, never shared, and are never used to train AI models. Havenly is built around that principle.",
  },
  {
    q: "Why is Premium $30/month?",
    a: "Free helps you write and reflect. Premium adds the layer that connects your entries across time so you can see recurring patterns, weekly shifts, and the deeper thread behind what keeps happening.",
  },
];

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-slate-800/60 bg-slate-950">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute right-[-120px] top-24 h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-12 sm:pb-16 sm:pt-16">
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400/80">
              Havenly Premium
            </p>

            <h1 className="mt-4 max-w-4xl text-[2.2rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-[3.4rem]">
              Start seeing the deeper pattern,
              <br />
              <span className="text-emerald-400">not just today’s entry.</span>
            </h1>

            <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-slate-400 sm:text-[17px]">
              Premium adds the layer that connects your entries across time. Instead of
              only reflecting what you wrote today, Havenly starts showing what keeps
              repeating, what is shifting, and what may be underneath it.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/api/stripe/checkout"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400 sm:px-6 sm:py-3.5 sm:text-sm"
              >
                Upgrade to Premium
              </Link>

              <Link
                href="/insights/preview"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-6 py-4 text-base font-medium text-slate-300 transition-colors hover:bg-slate-900 sm:px-6 sm:py-3.5 sm:text-sm"
              >
                Preview Premium insights
              </Link>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                $30 / month
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Secure checkout via Stripe
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/60 bg-slate-950/95 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/70">
                What changes with Premium
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                The value is not more journaling. It is more understanding.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
                Free gives you a private space to write and a few reflections each month.
                Premium helps Havenly connect the dots across entries, so your journal
                becomes easier to learn from.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {premiumFeatures.map(({ title, body }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-500/20 bg-emerald-500/[0.04] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                    Premium
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                    The roadmap to understanding yourself
                  </h3>
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Early access
                </span>
              </div>

              <div className="mt-4 flex items-end gap-1.5">
                <span className="text-4xl font-bold text-white">$30</span>
                <span className="pb-1 text-sm text-slate-400">/ month</span>
              </div>

              <p className="mt-1 text-xs text-slate-600">
                Less than one therapy co-pay • cancel anytime
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                For people who want to genuinely understand their patterns, not just track
                events.
              </p>

              <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 text-xs text-slate-400">
                <p>
                  <span className="text-slate-600">Before:</span> “I know something keeps
                  happening, but I still cannot quite see what.”
                </p>
                <p className="mt-1">
                  <span className="text-emerald-500/80">After:</span> Havenly shows what
                  repeats, how long it has been there, and what may be underneath it.
                </p>
              </div>

              <ul className="mt-5 space-y-3 text-sm text-slate-200">
                {[
                  {
                    label: "Everything in Free",
                    sub: "Nothing removed, just a deeper layer added",
                  },
                  {
                    label: "Unlimited reflections",
                    sub: "Reflect on every entry",
                  },
                  {
                    label: "Full hidden-pattern insights",
                    sub: "See what repeats across weeks and months",
                  },
                  {
                    label: "Weekly personal summary",
                    sub: "A written mirror of the week",
                  },
                  {
                    label: "“Why does this keep happening?” insights",
                    sub: "A clearer view of recurring loops and emotional drivers",
                  },
                  {
                    label: "Cancel anytime",
                    sub: "No lock-in, no questions asked",
                  },
                ].map(({ label, sub }) => (
                  <li key={label} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-emerald-400">&#10003;</span>
                    <div>
                      <p>{label}</p>
                      <p className="text-xs text-slate-500">{sub}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/api/stripe/checkout"
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400"
                >
                  Upgrade to Premium
                </Link>

                <Link
                  href="/insights/preview"
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-900"
                >
                  Preview Premium insights
                </Link>
              </div>

              <p className="mt-3 text-center text-xs text-slate-700">
                Secure checkout via Stripe • cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/60 bg-slate-950 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              What Premium starts surfacing
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              The patterns are easier to trust when you can finally see them.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                label: "What you feel most",
                text: "Emotional load appears in 14 of your last 22 entries.",
                labelClass: "text-violet-300",
              },
              {
                label: "What keeps coming back",
                text: "Responsibility and communication are the two themes most often linked together.",
                labelClass: "text-emerald-300",
              },
              {
                label: "Your hidden pattern right now",
                text: "You may be moving into a cycle of emotional over-functioning and self-silencing.",
                labelClass: "text-amber-300",
              },
              {
                label: "What is shifting in you",
                text: "Curiosity and honesty are rising in recent entries, which often means something important is becoming clearer.",
                labelClass: "text-sky-300",
              },
              {
                label: "Your weekly mirror",
                text: "A personal summary of what Havenly noticed this week across your entries.",
                labelClass: "text-rose-300",
              },
              {
                label: "A question worth sitting with",
                text: "What keeps making you say you are fine before you have had a chance to ask whether you are?",
                labelClass: "text-slate-300",
              },
            ].map(({ label, text, labelClass }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
                <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${labelClass}`}>
                  {label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/insights/preview"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              See a full example of Premium insights &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/60 bg-slate-950/95 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Free vs Premium
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Start free. Upgrade when you want the bigger picture.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Free helps you begin. Premium helps you understand what your entries mean
              together over time.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Free
              </p>
              <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                The perfect private place to start
              </p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-white">$0</span>
                <span className="text-sm text-slate-400">/ month</span>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                A calm place to write honestly, with no commitment, no pressure, and no audience.
              </p>

              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                {[
                  "Write anytime, entries stay private",
                  "3 AI reflections per month",
                  "Gentle daily prompts",
                  "Basic pattern insights",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-emerald-600">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <Link
                  href="/magic-login"
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
                >
                  Start for free
                </Link>
                <p className="mt-2 text-center text-xs text-slate-700">
                  No credit card. No expiry.
                </p>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                  Premium
                </p>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Early access
                </span>
              </div>

              <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                The deeper layer of understanding
              </p>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-white">$30</span>
                <span className="text-sm text-slate-400">/ month</span>
              </div>

              <p className="mt-3 text-sm text-slate-300">
                For people who want clearer insight into what keeps repeating and why.
              </p>

              <ul className="mt-5 space-y-3 text-sm text-slate-200">
                {[
                  "Unlimited reflections",
                  "Full pattern insights",
                  "Weekly personal summary",
                  "Why-this-keeps-happening insights",
                  "Everything in Free",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-emerald-400">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-2 pt-6">
                <Link
                  href="/api/stripe/checkout"
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400"
                >
                  Upgrade to Premium
                </Link>
                <Link
                  href="/insights/preview"
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-900"
                >
                  Preview Premium insights
                </Link>
              </div>

              <p className="mt-3 text-center text-xs text-slate-700">
                Secure checkout via Stripe
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/60 bg-slate-950 py-12 sm:py-14">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            A few honest answers
          </h2>

          <div className="mt-6 space-y-5 sm:mt-7 sm:space-y-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-slate-800/60 pb-5">
                <p className="text-[15px] font-medium text-white sm:text-base">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-xs text-slate-700">
            <Link
              href="/privacy"
              className="text-emerald-600 transition-colors hover:text-emerald-500"
            >
              Read the Privacy Policy &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-4xl">
            Your thoughts deserve a clearer mirror.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Start with a single entry. When you want the deeper picture, Premium helps
            Havenly connect the dots.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/api/stripe/checkout"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-7 py-3.5 text-[15px] font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400 sm:py-3 sm:text-sm"
            >
              Upgrade to Premium
            </Link>

            <Link
              href="/magic-login"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-7 py-3.5 text-[15px] font-medium text-slate-300 transition-colors hover:bg-slate-900 sm:py-3 sm:text-sm"
            >
              Start free first
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
