// app/blog/[slug]/page.tsx

import { blogPosts } from "../posts";
import MarkdownRenderer from "@/app/components/blog/MarkdownRenderer";
import ArticleHeader from "@/app/components/blog/ArticleHeader";
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
      <ArticleHeader title={post.title} readingTime={post.readingTime} />

      <div className="prose prose-invert max-w-none text-sm leading-relaxed">
        <MarkdownRenderer content={post.content} />
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
