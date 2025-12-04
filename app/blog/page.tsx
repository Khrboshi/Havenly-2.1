// app/blog/page.tsx

import Link from "next/link";
import { blogPosts } from "./posts";

export const metadata = {
  title: "Havenly Journal – Emotional Micro-Articles",
  description:
    "Gentle, emotional, short-form articles designed to help you breathe, reflect, and feel understood.",
};

export default function BlogIndexPage() {
  return (
    <div className="px-4 pt-20 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-hvn-accent-mint">
            Havenly Journal
          </p>

          <h1 className="text-3xl font-semibold text-hvn-text-primary sm:text-4xl">
            A collection of gentle emotional reflections.
          </h1>

          <p className="text-sm text-hvn-text-muted sm:text-base max-w-2xl">
            Short, soft, emotional micro-articles — written to help you pause,
            understand yourself, and breathe again, even on difficult days.
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid gap-4 pt-4 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-hvn-card bg-hvn-bg-elevated/80 p-4 transition hover:border-hvn-accent-mint-soft hover:bg-hvn-bg-soft/90"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-hvn-accent-blue">
                Journal article
              </p>

              <h3 className="mt-2 text-sm font-semibold text-hvn-text-secondary group-hover:text-hvn-accent-mint">
                {post.title}
              </h3>

              <p className="mt-2 flex-1 text-xs text-hvn-text-muted sm:text-[13px]">
                {post.description}
              </p>

              <p className="mt-3 text-[11px] text-hvn-text-muted">
                {post.readingTime}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
