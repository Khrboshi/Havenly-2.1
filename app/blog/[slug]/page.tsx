// app/blog/[slug]/page.tsx
// Blog article layout – logged out

import Link from "next/link";
import { notFound } from "next/navigation";

type Post = {
  slug: string;
  category: string;
  title: string;
  readTime: string;
  paragraphs: string[];
};

const posts: Post[] = [
  {
    slug: "why-your-mind-feels-heavy",
    category: "Emotional clarity",
    title: "Why your mind feels so heavy on quiet days",
    readTime: "1 min read",
    paragraphs: [
      "On quiet days, when life slows down, your thoughts get louder. The heaviness you feel isn’t a flaw — it’s the emotional backlog that finally has space to surface.",
      "Quiet heaviness is your mind asking for space, gentleness, and truth.",
      "Why it matters: When you see heaviness as accumulated emotional load instead of failure, you respond with compassion instead of pressure.",
    ],
  },
  {
    slug: "you-are-not-behind",
    category: "Burnout",
    title: "You’re not behind — you’re exhausted",
    readTime: "1 min read",
    paragraphs: [
      "People often believe they’re “behind,” but the truth is simpler: they’re exhausted emotionally, mentally, or physically.",
      "Functioning through exhaustion doesn’t mean you’re okay — it means you’ve adapted to running on empty.",
      "You don’t need to push harder. You need rest without guilt.",
      "Why it matters: Seeing exhaustion for what it is changes your self-talk from judgment to gentleness.",
    ],
  },
  {
    slug: "talk-to-yourself-when-unworthy",
    category: "Self-compassion",
    title: "How to talk to yourself on the days you feel unworthy",
    readTime: "1 min read",
    paragraphs: [
      "Feeling unworthy means your emotional bandwidth is low — not that something is wrong with you.",
      "A gentle inner voice can shift your entire state: “I’m having a hard moment. It’s okay. I don’t have to fix everything right now.”",
      "Why it matters: Self-compassion is emotional regulation.",
    ],
  },
  {
    slug: "small-emotional-wins",
    category: "Healing",
    title: "Small emotional wins count more than big breakthroughs",
    readTime: "1 min read",
    paragraphs: [
      "Healing rarely happens in dramatic moments. It comes through tiny choices: rest, truth, boundaries, reaching out.",
      "Small emotional wins accumulate quietly — and suddenly life feels lighter.",
      "Why it matters: Small wins create long-term emotional resilience.",
    ],
  },
];

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-[#050816] text-slate-100">
      <section className="px-6 pb-24 pt-24 md:px-10 lg:px-24">
        <article className="mx-auto max-w-3xl space-y-10">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {post.category}
            </p>
            <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
              {post.title}
            </h1>
            <p className="text-xs text-slate-400">{post.readTime}</p>
          </header>

          <div className="space-y-4 text-sm leading-relaxed text-slate-200 sm:text-base">
            {post.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Premium CTA */}
          <section className="mt-10 rounded-2xl border border-slate-800 bg-[#050816] p-6 text-center shadow-[0_10px_35px_rgba(0,0,0,0.45)]">
            <p className="text-sm font-medium text-slate-100">
              Want deeper emotional reflections?
            </p>
            <p className="mt-2 text-xs text-slate-300 sm:text-sm">
              Premium unlocks AI-powered insights, richer analysis, and
              unlimited journaling.
            </p>
            <Link
              href="/upgrade"
              className="mt-4 inline-flex items-center justify-center text-sm font-semibold text-emerald-300 hover:text-emerald-200"
            >
              See Premium benefits →
            </Link>
          </section>

          <div className="pt-4">
            <Link
              href="/blog"
              className="text-xs font-medium text-slate-300 hover:text-sky-300"
            >
              ← Back to all articles
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
