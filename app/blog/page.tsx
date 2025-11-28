import Link from "next/link";
import posts from "./posts";

export const metadata = {
  title: "Blog | Havenly",
  description: "Guides, reflections, and calm-thinking strategies.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen px-6 py-16 bg-background text-foreground">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Havenly Blog</h1>
        <p className="text-center text-lg text-muted-foreground mb-12">
          Short, gentle insights to help you think clearly and feel grounded.
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-primary font-medium hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
