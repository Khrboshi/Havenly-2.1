import { notFound } from "next/navigation";
import { posts } from "../posts";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <div className="px-4 pb-20 pt-20 sm:px-6 lg:px-8 bg-transparent">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs text-hvn-text-muted">
          {post.date} • {post.minutes} min read
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-hvn-text-primary sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-hvn-text-muted">
          <p>
            This is placeholder content. I can automatically generate full
            high-quality blog articles for each post if you want.
          </p>
          <p>
            Havenly’s writing style focuses on softness, clarity, and emotional
            safety. No pressure, no optimization — just a clearer mirror.
          </p>
        </div>
      </div>
    </div>
  );
}
