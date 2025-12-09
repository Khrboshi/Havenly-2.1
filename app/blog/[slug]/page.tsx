import Link from "next/link";
import { ARTICLES, getArticle } from "../articles";

type BlogArticlePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const article = getArticle(params.slug);

  if (!article) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 pt-24 text-center">
          <p className="text-sm text-slate-400">Article not found.</p>
          <Link
            href="/blog"
            className="mt-4 text-sm text-emerald-300 hover:text-emerald-200"
          >
            ← Back to all articles
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-24">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
          {article.category}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {article.title}
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          {article.minutes} min read
        </p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-200">
          {article.body.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-sm">
          <p className="font-semibold text-slate-100">
            Want deeper emotional reflections?
          </p>
          <p className="mt-2 text-xs text-slate-300">
            Premium unlocks AI-powered insights, richer analysis, and unlimited
            journaling—so your reflections don&apos;t just stay as ideas, they
            become patterns you can act on gently.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link
              href="/upgrade"
              className="rounded-full bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              See Premium benefits →
            </Link>
            <Link
              href="/magic-login"
              className="rounded-full border border-slate-700 px-4 py-2 font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-900"
            >
              Start free journaling
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-6 text-center text-xs text-slate-400">
          <Link
            href="/blog"
            className="text-emerald-300 hover:text-emerald-200"
          >
            ← Back to all articles
          </Link>
        </div>
      </section>
    </main>
  );
}
