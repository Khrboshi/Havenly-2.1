// app/blog/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPostBySlug, getSortedPosts } from "../posts";

type BlogPostPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} – Havenly`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Basic “you may also like” section: other posts, newest first
  const related = getSortedPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <article className="max-w-3xl mx-auto px-4 pt-20 pb-16">
        <p className="text-emerald-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          {post.category}
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          {post.title}
        </h1>
        <p className="text-slate-300 text-base md:text-lg mb-4">
          {post.subtitle}
        </p>
        <p className="text-xs text-slate-500 mb-8">
          {post.date} · {post.readTime}
        </p>

        <div className="prose prose-invert prose-slate max-w-none prose-headings:scroll-mt-24">
          <p>{post.intro}</p>

          {post.sections.map((section, idx) => (
            <section key={idx} className="mt-8">
              {section.heading && <h2>{section.heading}</h2>}
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {section.list && section.list.length > 0 && (
                <ul>
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="mt-10">
            <h2>A small invitation</h2>
            <p>{post.takeaway}</p>
          </section>
        </div>

        {/* CTA back into the product */}
        <div className="mt-10 rounded-2xl border border-emerald-700/40 bg-emerald-900/10 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Ready for a gentle check-in?
            </p>
            <p className="text-sm text-slate-300">
              Open Havenly, write for 3–5 minutes, and let the AI reflect back
              one kind sentence you can carry with you.
            </p>
          </div>
          <Link
            href="/magic-login"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-sm font-semibold px-5 py-2 hover:bg-emerald-400 transition-colors"
          >
            Start journaling free
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-14 border-t border-slate-800 pt-8">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-[0.16em] mb-4">
              You may also like
            </h3>
            <div className="space-y-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="block rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900/80 transition-colors px-5 py-4"
                >
                  <p className="text-xs text-slate-500 mb-1">
                    {rel.date} · {rel.readTime}
                  </p>
                  <h4 className="text-base md:text-lg font-semibold text-slate-50 mb-1">
                    {rel.title}
                  </h4>
                  <p className="text-sm text-slate-300 line-clamp-2">
                    {rel.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
