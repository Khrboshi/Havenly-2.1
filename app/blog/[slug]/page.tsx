import { notFound } from "next/navigation";
import { posts } from "../posts";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  return (
    <div className="px-4 pb-20 pt-16 sm:px-6 lg:px-8 bg-transparent">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs text-hvn-text-muted">
          {post.date} • {post.minutes} min read
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-hvn-text-primary sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-hvn-text-muted">
          <p>
            This is placeholder article text. You can later replace this with
            generated content, markdown, or a CMS.
          </p>

          <p>
            Havenly&apos;s blog is designed to be simple, quiet, and grounded —
            a place where users can feel encouraged rather than pressured.
          </p>

          <p>
            If you would like, I can auto-generate the full article content for
            each post as well.
          </p>
        </div>
      </div>
    </div>
  );
}
