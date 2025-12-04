// app/blog/[slug]/page.tsx

import { blogPosts } from "../posts";
import MarkdownRenderer from "@/app/components/blog/MarkdownRenderer";
import Link from "next/link";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-xl pt-20 text-center text-hvn-text-muted">
        <p>Article not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-20 pb-28">
      <div className="space-y-2 mb-10">
        <p className="text-xs uppercase tracking-[0.18em] text-hvn-accent-blue">
          {post.category}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">
          {post.title}
        </h1>
        <p className="text-xs text-hvn-text-muted">
          {post.readingTime}
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-sm leading-relaxed">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Soft CTA */}
      <div className="mt-12 rounded-2xl border border-hvn-card bg-hvn-bg-elevated/70 p-6 text-center space-y-2">
        <p className="text-sm text-hvn-text-primary font-semibold">
          Want deeper emotional reflections?
        </p>
        <p className="text-xs text-hvn-text-muted">
          Premium unlocks AI-powered insights, richer analysis and unlimited journaling.
        </p>
        <Link
          href="/upgrade"
          className="inline-block mt-3 text-xs font-medium text-hvn-accent-mint underline-offset-4 hover:underline"
        >
          See Premium benefits →
        </Link>
      </div>

      <div className="mt-10 border-t border-hvn-subtle/40 pt-6 text-center">
        <Link
          href="/blog"
          className="text-xs text-hvn-accent-blue underline-offset-4 hover:underline"
        >
          ← Back to all articles
        </Link>
      </div>
    </div>
  );
}
