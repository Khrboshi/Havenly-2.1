// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";
import { posts } from "@/lib/posts";
import ArticleHeader from "@/app/components/blog/ArticleHeader";
import MarkdownRenderer from "@/app/components/blog/MarkdownRenderer";

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: "Article not found — Havenly Journal",
    };
  }

  return {
    title: `${post.title} — Havenly Journal`,
    description: post.description,
  };
}

export default function BlogArticlePage({ params }: PageProps) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <ArticleHeader
        title={post!.title}
        description={post!.description}
        date={post!.date}
        readingTime={post!.readingTime}
      />
      <MarkdownRenderer content={post!.content} />
    </main>
  );
}
