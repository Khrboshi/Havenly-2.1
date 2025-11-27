// app/blog/page.tsx

import Link from "next/link";
import { getSortedPosts } from "./posts";

export const metadata = {
  title: "Blog – Havenly",
  description:
    "Notes on gentle journaling, calm technology, and tiny habits that actually fit into real life.",
};

export default function BlogPage() {
  const allPosts = getSortedPosts();
  const [featured, ...rest] = allPosts;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        <p className="text-emerald-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          Blog
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          Notes on{" "}
          <span className="text-emerald-300">gentle journaling</span> and calm
          technology.
        </h1>
        <p className="text-slate-300 text-base md:text-lg max-w-2xl">
          Short pieces that explore why small, honest check-ins matter — and how
          AI can support reflection without overwhelming you.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-10">
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="block rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-colors px-6 py-5 md:px-8 md:py-6 shadow-lg shadow-slate-950/40"
          >
            <p className="text-xs text-slate-400 mb-1">
              {featured.date} · {featured.readTime}
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-slate-50 mb-1">
              {featured.title}
            </h2>
            <p className="text-sm text-slate-300 mb-3">
              {featured.description}
            </p>
            <p className="text-sm text-emerald-300 font-medium">
              Read article →
            </p>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-[0.16em]">
              More from Havenly
            </h3>
            <div className="space-y-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900/80 transition-colors px-5 py-4"
                >
                  <p className="text-xs text-slate-500 mb-1">
                    {post.date} · {post.readTime}
                  </p>
                  <h4 className="text-base md:text-lg font-semibold text-slate-50 mb-1">
                    {post.title}
                  </h4>
                  <p className="text-sm text-slate-300 line-clamp-2">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
