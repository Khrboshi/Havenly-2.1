// app/blog/page.tsx

import { posts } from "@/lib/posts";
import BlogCard from "@/app/components/blog/BlogCard";

export const metadata = {
  title: "Havenly Journal — Articles",
  description:
    "Short, gentle articles about journaling, emotional clarity, and calm use of AI.",
};

export default function BlogIndexPage() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      {/* Hero */}
      <section className="space-y-4">
        <p className="text-sm font-medium tracking-[0.18em] text-emerald-300 uppercase">
          Blog
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-50 leading-tight">
          Notes on{" "}
          <span className="text-emerald-300">gentle journaling</span> and calm
          technology.
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl">
          Short pieces that explore why small, honest check-ins matter — and
          how AI can support reflection without overwhelming you.
        </p>
      </section>

      {/* Articles list */}
      <section className="space-y-4">
        {sorted.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300 text-sm">
            No articles yet. New pieces will appear here as they are published.
          </div>
        )}

        {sorted.length > 0 && (
          <div className="grid gap-4">
            {sorted.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                description={post.description}
                date={post.date}
                readingTime={post.readingTime}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
