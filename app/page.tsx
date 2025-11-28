import Link from "next/link";

const features = [
  {
    title: "Tiny, gentle check-ins",
    description:
      "Spend 2–3 minutes writing and get a surprisingly clear sense of how your day really felt.",
  },
  {
    title: "AI reflections that stay kind",
    description:
      "Havenly summarizes your entries in soft, non-judgmental language so you see patterns without feeling overwhelmed.",
  },
  {
    title: "Designed for busy, sensitive minds",
    description:
      "No pressure to write perfectly. Just a calm space to drop a few lines and move on with your day.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Start your free journal",
    description:
      "Open Havenly, click “Start journaling free”, and write a few honest lines about your day or your moment.",
  },
  {
    step: "2",
    title: "Let Havenly reflect back",
    description:
      "Our gentle AI reflects what it heard, highlighting emotions, themes, and what might need a bit more care.",
  },
  {
    step: "3",
    title: "Return to a calmer mind",
    description:
      "Over time, short entries turn into a soft record of what you’ve survived, learned, and grown through.",
  },
];

const journalTeasers = [
  {
    slug: "/blog/why-gentle-journaling-works",
    title: "Why gentle journaling works better than forcing yourself",
    description:
      "Perfectionism kills most journaling habits. Here is a softer way to keep showing up.",
  },
  {
    slug: "/blog/the-3-minute-journal-that-actually-works",
    title: "The 3-minute journal that actually works",
    description:
      "If you only have a few minutes, this simple flow can still give you real emotional clarity.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-800/70 bg-gradient-to-b from-slate-950 via-slate-930 to-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.08)_0,_transparent_55%)]" />
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center md:pb-24 md:pt-20 relative">
          <span className="mb-3 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
            A kinder way to understand your day
          </span>

          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl md:text-6xl">
            Journaling that feels{" "}
            <span className="text-emerald-300">soft, simple, and safe.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-balance text-base text-slate-300 sm:text-lg">
            Havenly 2.1 is a calm, private space where you write a few honest
            lines and receive gentle AI reflections—not productivity pressure,
            not self-criticism. Just a clearer, kinder view of your inner world.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/journal/new"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300"
            >
              Start journaling free
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-emerald-400 hover:text-emerald-300 transition"
            >
              Explore the Havenly Journal
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            No credit card. No complicated setup. Just you and a blank, gentle
            page.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-slate-800/60 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 md:flex-row md:items-start md:justify-between md:gap-12 md:py-16">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Built for quiet moments between everything else.
            </h2>
            <p className="mt-3 text-sm text-slate-300 md:text-base">
              Havenly is not another noisy app. It is deliberately simple, so
              you can drop a thought, breathe, and move on—with just a bit more
              clarity than before.
            </p>
          </div>

          <div className="grid flex-1 gap-5 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left"
              >
                <h3 className="text-sm font-semibold text-emerald-300">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs text-slate-300 sm:text-sm">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-slate-800/60 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <h2 className="text-center text-2xl font-semibold text-slate-50 md:text-3xl">
            How Havenly works
          </h2>
          <p className="mt-3 text-center text-sm text-slate-300 md:text-base">
            A tiny routine that fits into mornings, commutes, late nights, and
            everything in between.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
              >
                <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-300">
                  {step.step}
                </div>
                <h3 className="text-sm font-semibold text-slate-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs text-slate-300 sm:text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL TEASERS */}
      <section className="border-b border-slate-800/60 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">
                Havenly Journal: read, then write.
              </h2>
              <p className="mt-2 text-sm text-slate-300 md:text-base">
                Short, gentle articles to help you feel less alone—and to give
                you ideas for what to write about next.
              </p>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
            >
              View all articles →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {journalTeasers.map((post) => (
              <Link
                key={post.slug}
                href={post.slug}
                className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-left transition hover:border-emerald-400/70 hover:bg-slate-900/70"
              >
                <h3 className="text-sm font-semibold text-slate-50 group-hover:text-emerald-200">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs text-slate-300 sm:text-sm">
                  {post.description}
                </p>
                <span className="mt-3 inline-block text-xs font-medium text-emerald-300">
                  Read article →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SOFT PREMIUM TEASER */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-950 px-6 py-8 text-center md:px-10 md:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Coming soon
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-50 md:text-3xl">
              Havenly Plus for deeper insight—when you are ready.
            </h2>
            <p className="mt-3 text-sm text-slate-200 md:text-base max-w-2xl mx-auto">
              Stay with the free journal as long as you like. When you are ready
              for sentiment trends, long-term patterns, and deeper AI guidance,
              Havenly Plus will be waiting—no pressure.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center rounded-full border border-emerald-400 px-5 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 transition"
              >
                See what&apos;s planned
              </Link>
              <Link
                href="/journal/new"
                className="text-xs text-slate-300 hover:text-emerald-200"
              >
                Or just keep journaling for free →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
