import { notFound } from "next/navigation";
import Link from "next/link";
import { blogArticles } from "../posts";

export default function ArticlePage({ params }) {
  const article = blogArticles.find((a) => a.slug === params.slug);

  if (!article) return notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <Link
          href="/blog"
          className="text-xs text-emerald-300 hover:underline mb-6 inline-block"
        >
          ← Back to Blog
        </Link>

        <div className="text-xs text-emerald-300 font-semibold mb-3">
          {article.category.toUpperCase()}
        </div>

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-sm text-slate-500 mb-10">{article.readTime} min read</p>

        <article className="prose prose-invert prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
      </section>

      <footer className="border-t border-slate-800 py-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Havenly 2.1. All rights reserved.  
        <Link href="/privacy" className="ml-4 hover:underline">
          Privacy Policy
        </Link>
      </footer>
    </main>
  );
}
