// app/components/blog/BlogCard.tsx

import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
}

export default function BlogCard({
  slug,
  title,
  description,
  date,
  readingTime,
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${slug}`}
      className="block rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:bg-slate-900/70 transition"
    >
      <p className="text-xs text-slate-400 mb-1">
        {formattedDate} · {readingTime}
      </p>
      <h2 className="text-lg font-semibold text-slate-50 mb-1">{title}</h2>
      <p className="text-sm text-slate-300">{description}</p>
    </Link>
  );
}
