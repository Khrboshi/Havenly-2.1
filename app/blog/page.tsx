import Link from "next/link";
import { posts } from "./posts";

export const metadata = {
  title: "Havenly Journal – Gentle Notes",
  description:
    "Short, gentle pieces to help you feel less alone and support your daily journaling practice.",
};

export default function BlogPage() {
  return (
    <div className="px-4 pb-20 pt-16 sm:px-6 lg:px-8 bg-transparent">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold tracking-tight text-hvn-text-primary sm:text-5xl">
          Notes on{" "}
          <span className="text-hvn-accent-mint">gentle journaling</span> and
          calm technology.
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-hvn-text-muted">
          Short pieces that explore why small, honest check-ins matter — and how
          AI can support reflection without overwhelming you.
        </p>

        <div className="mt-12 space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-hvn-subtle/40 bg-hvn-bg-elevated/60 p-6 transition hover:bg-hvn-bg-elevated/90"
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
