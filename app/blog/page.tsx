import Link from "next/link";
import { ARTICLES } from "./articles";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Havenly Journal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Gentle articles for overloaded minds.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          These pieces are for people who are doing their best with a lot on
          their plate. No productivity hacks, no optimization—just softer ways
          to understand what you&apos;re feeling and why it makes sense.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">
            Emotional load
          </span>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">
            Journaling
          </span>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">
            Rest &amp; burnout
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link
            href="/magic-login"
            className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Start free journaling
          </Link>
          <Link
            href="/upgrade"
            className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-900"
          >
            See Premium reflections
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-sm"
            >
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  {article.category}
                </p>
                <h2 className="mt-2 text-base font-semibold text-slate-100">
                  {article.title}
                </h2>
                <p className="mt-2 text-xs text-slate-300">
                  {article.summary}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{article.minutes} min read</span>
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-emerald-300 hover:text-emerald-200"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-sm">
          <p className="font-semibold text-slate-100">
            Turn what you&apos;re reading into a space that remembers you.
          </p>
          <p className="mt-2 text-xs text-slate-300 max-w-xl">
            Havenly isn&apos;t just a set of ideas—it&apos;s a private place to
            put what you&apos;re carrying, and gentle AI that helps you notice
            what&apos;s been happening underneath your weeks.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link
              href="/magic-login"
              className="rounded-full bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Start a free reflection
            </Link>
            <Link
              href="/upgrade"
              className="rounded-full border border-slate-700 px-4 py-2 font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-900"
            >
              Explore Premium insights
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
