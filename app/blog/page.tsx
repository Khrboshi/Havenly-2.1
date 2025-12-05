// app/blog/page.tsx
// Havenly Journal – Blog index (logged out)

import Link from "next/link";

const posts = [
  {
    slug: "why-your-mind-feels-heavy",
    category: "Emotional clarity",
    title: "Why your mind feels so heavy on quiet days",
    description:
      "Quiet moments make the emotional load louder. Here’s why that heaviness shows up — and what it really means.",
    readTime: "1 min read",
  },
  {
    slug: "you-are-not-behind",
    category: "Burnout",
    title: "You’re not behind — you’re exhausted",
    description:
      "Most people who feel “behind” are carrying exhaustion, not failure. Here’s how to recognize the difference.",
    readTime: "1 min read",
  },
  {
    slug: "talk-to-yourself-when-unworthy",
    category: "Self-compassion",
    title: "How to talk to yourself on the days you feel unworthy",
    description:
      "Unworthiness isn’t truth — it’s overwhelm. Here’s a softer way to speak to yourself when it happens.",
    readTime: "1 min read",
  },
  {
    slug: "small-emotional-wins",
    category: "Healing",
    title: "Small emotional wins count more than big breakthroughs",
    description:
      "Healing often looks like tiny honest choices — and they matter more than dramatic breakthroughs.",
    readTime: "1 min read",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen w-full bg-[#050816] text-slate-100">
      <section className="px-6 pb-24 pt-24 md:px-10 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-10">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Havenly Journal
            </p>
            <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
              Emotional reflections for real, tired humans.
            </h1>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              Micro-articles that blend emotional clarity, self-compassion, and
              gentle healing — written for the days you need softness the most.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-800 bg-[#050816] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:border-sky-500/70 hover:bg-slate-900/70"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {post.category}
                </p>
                <h2 className="mt-2 text-base font-semibold leading-snug text-slate-50 sm:text-lg group-hover:text-sky-200">
                  {post.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {post.description}
                </p>
                <span className="mt-4 text-[11px] text-slate-400">
                  {post.readTime}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
