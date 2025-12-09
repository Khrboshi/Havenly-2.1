// app/blog/page.tsx

import Link from "next/link";

type BlogPost = {
  slug: string;
  title: string;
  description: string;
  readingTime: string;
  category: string;
};

const POSTS: BlogPost[] = [
  {
    slug: "feeling-behind-on-your-own-life",
    title: "When you feel behind on your own life",
    description:
      "How to notice the quiet pressure you put on yourself, and what gentle pacing can look like in real days.",
    readingTime: "5 min read",
    category: "Emotional Load",
  },
  {
    slug: "tiny-checkins-busy-brain",
    title: "Tiny check-ins for a very busy brain",
    description:
      "You don’t need a perfect journaling habit. A few honest sentences are enough for patterns to emerge.",
    readingTime: "4 min read",
    category: "Journaling",
  },
  {
    slug: "difference-between-distraction-and-rest",
    title: "The difference between distraction and real rest",
    description:
      "Scrolling isn’t failure. But your body can feel the difference between numbing out and actually exhaling.",
    readingTime: "6 min read",
    category: "Rest",
  },
  {
    slug: "emotional-backlog",
    title: "Emotional backlog: why you feel so tired",
    description:
      "Your exhaustion often has less to do with tasks, and more to do with feelings that never got to land.",
    readingTime: "7 min read",
    category: "Self-awareness",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-24">
        {/* HERO */}
        <section className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-200">
            Havenly Journal
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Gentle articles for overloaded minds.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            These pieces are written for people who are doing their best with a
            lot on their plate. No productivity hacks, no optimization &mdash;
            just softer ways to understand what you&apos;re feeling and why it
            makes sense.
          </p>

          <div className="mt-6 inline-flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Emotional load
            </span>
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Journaling
            </span>
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Rest & burnout
            </span>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-100">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="max-w-xl text-slate-200">
              Reading is a good start. Havenly becomes most helpful when you
              have a quiet place to put what{" "}
              <span className="font-semibold">your</span> days actually feel
              like.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Start free journaling
              </Link>
              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-100 hover:bg-slate-900"
              >
                See Premium reflections
              </Link>
            </div>
          </div>
        </section>

        {/* POSTS GRID */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {POSTS.map((post) => (
            <article
              key={post.slug}
              className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-emerald-500/40 hover:bg-slate-900/80"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                {post.category}
              </p>
              <h2 className="mt-2 text-base font-semibold text-slate-50 group-hover:text-emerald-200">
                {post.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-300">
                {post.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{post.readingTime}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-emerald-300 hover:text-emerald-200"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* BOTTOM CONVERSION STRIP */}
        <section className="mt-16 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-sm text-slate-200">
          <div className="grid gap-6 md:grid-cols-[1.5fr,1fr] items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">
                Turn what you&apos;re reading into a space that remembers you.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-slate-300">
                Havenly isn&apos;t just a set of ideas &mdash; it&apos;s a
                private place to put what you&apos;re carrying, and a gentle AI
                that helps you notice what&apos;s been happening underneath your
                weeks.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Start a free reflection
              </Link>
              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-xs text-slate-100 hover:bg-slate-900"
              >
                Explore Premium insights
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
