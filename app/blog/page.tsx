// app/blog/page.tsx

import Link from "next/link";
import { blogPosts } from "./posts";

export const metadata = {
  title: "Havenly Journal — Emotional Micro-Articles",
  description:
    "Short, emotional, calming micro-articles written to help you pause, feel understood, and breathe again.",
};

export default function BlogIndexPage() {
  return (
    <div className="px-4 pt-20 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-hvn-accent-mint">
            Havenly Journal
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-hvn-text-primary">
            Emotional reflections for real, tired humans.
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-hvn-text-muted">
            Micro-articles that blend emotional clarity, self-compassion, and gentle healing —
            written for the days you need softness the most.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-hvn-card bg-hvn-bg-elevated/80 p-5 transition hover:border-hvn-accent-mint-soft hover:bg-hvn-bg-soft/90 flex flex-col"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-hvn-accent-blue">
                {post.category}
              </p>

              <h3 className="mt-2 text-base font-semibold text-hvn-text-secondary group-hover:text-hvn-accent-mint">
                {post.title}
              </h3>

              <p className="mt-2 text-xs sm:text-[13px] text-hvn-text-muted flex-1">
                {post.description}
              </p>

              <p className="mt-4 text-[11px] text-hvn-text-muted">
                {post.readingTime}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
