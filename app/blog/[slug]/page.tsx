import { notFound } from "next/navigation";
import { posts } from "../posts";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  return (
    <div className="px-4 pb-24 pt-20 sm:px-6 lg:px-8 bg-transparent">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs text-hvn-text-muted">
          {post.date} • {post.minutes} min read
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-hvn-text-primary sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-hvn-text-muted">
          <p>
            This is placeholder content. If you want, I can automatically
            generate full articles for every blog post in high-quality Havenly
            tone — warm, emotional, and calm.
          </p>

          <p>
            Havenly’s writing style focuses on emotional safety, clarity, and
            reflective gentleness. The goal is not to give advice, but to help
            you notice what matters inside your own experience.
          </p>

          <p>
            Let me know if you'd like me to generate full long-form versions for
            all posts.
          </p>
        </div>
      </div>
    </div>
  );
}
