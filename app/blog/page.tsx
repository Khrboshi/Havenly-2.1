import Link from "next/link";
import { posts } from "./posts";

export default function BlogPage() {
  return (
    <div className="px-4 pb-20 pt-20 sm:px-6 lg:px-8 bg-transparent">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold tracking-tight text-hvn-text-primary sm:text-5xl">
          Havenly Journal
        </h1>

        <p className="mt-3 max-w-2xl text-lg text-hvn-text-muted">
          Gentle notes on reflection, emotions, calm technology, and tiny
          check-ins that make your days feel a little lighter.
        </p>

        <div className="mt-12 space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-hvn-card bg-hvn-bg-elevated/70 p-6 transition hover:bg-hvn-bg-elevated/90"
            >
              <p className="text-xs text-hvn-text-muted">
                {post.date} • {post.minutes} min read
              </p>
              <h2 className="mt-2 text-xl font-semibold text-hvn-text-primary">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-hvn-text-muted">{post.excerpt}</p>
              <p className="mt-3 text-sm font-medium text-hvn-accent-mint">
                Read article →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
