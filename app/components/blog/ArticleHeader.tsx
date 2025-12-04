// app/components/blog/ArticleHeader.tsx

interface ArticleHeaderProps {
  title: string;
  description?: string;
  date?: string;
  readingTime?: string;
}

export default function ArticleHeader({
  title,
  description,
  date,
  readingTime,
}: ArticleHeaderProps) {
  const formattedDate =
    date &&
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <header className="mb-10 space-y-3">
      <p className="text-xs font-medium tracking-[0.18em] text-emerald-300 uppercase">
        Havenly Journal
      </p>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-50 leading-tight">
        {title}
      </h1>

      {/* Render description only if it exists */}
      {description && (
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl">
          {description}
        </p>
      )}

      {/* Render date + reading time only if available */}
      {(formattedDate || readingTime) && (
        <p className="text-xs text-slate-400">
          {formattedDate ? formattedDate : ""}{" "}
          {formattedDate && readingTime ? "·" : ""}
          {readingTime ? readingTime : ""}
        </p>
      )}
    </header>
  );
}
