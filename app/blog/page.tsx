{/* FROM THE HAVENLY JOURNAL (BLOG PREVIEW) */}
<section className="px-4 pb-20 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-5xl space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-hvn-accent-mint">
          From the Havenly Journal
        </p>
        <h2 className="mt-2 text-xl font-semibold text-hvn-text-primary sm:text-2xl">
          Gentle, emotional articles designed to help you breathe again.
        </h2>
      </div>
      <Link
        href="/blog"
        className="text-xs font-medium text-hvn-accent-blue underline-offset-4 hover:underline"
      >
        Browse all articles →
      </Link>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {[
        blogPosts[0],
        blogPosts[1],
        blogPosts[2],
        blogPosts[3],
      ].map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex h-full flex-col rounded-2xl border border-hvn-card bg-hvn-bg-elevated/80 p-4 transition hover:border-hvn-accent-mint-soft hover:bg-hvn-bg-soft/90"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-hvn-accent-blue">
            Journal article
          </p>
          <h3 className="mt-2 text-sm font-semibold text-hvn-text-secondary group-hover:text-hvn-accent-mint">
            {post.title}
          </h3>
          <p className="mt-2 flex-1 text-xs text-hvn-text-muted sm:text-[13px]">
            {post.description}
          </p>
          <p className="mt-3 text-[11px] text-hvn-text-muted">{post.readingTime}</p>
        </Link>
      ))}
    </div>
  </div>
</section>
