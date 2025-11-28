import posts from "../posts";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  return (
    <main className="min-h-screen px-6 py-16 bg-background text-foreground">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="text-primary hover:underline mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-muted-foreground mb-12">{post.date}</p>

        <article
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16">
          <Link
            href="/blog"
            className="text-primary font-medium hover:underline"
          >
            ← View more posts
          </Link>
        </div>
      </div>
    </main>
  );
}
