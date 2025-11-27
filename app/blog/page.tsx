// app/blog/page.tsx

export const metadata = {
  title: "Havenly Journal — Blog",
  description:
    "Articles and reflections on gentle journaling, emotional health, and calm use of AI.",
};

export default function BlogPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      {/* Hero */}
      <section className="space-y-4">
        <p className="text-sm font-medium tracking-[0.18em] text-emerald-300 uppercase">
          Blog
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-50 leading-tight">
          Notes on{" "}
          <span className="text-emerald-300">gentle journaling</span> and calm
          technology.
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl">
          The Havenly blog will share short, practical pieces on reflection
          habits, emotional awareness, and using AI in a way that feels
          supportive — not overwhelming.
        </p>
      </section>

      {/* Coming soon card */}
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-slate-50">
          Coming soon — first articles are on the way
        </h2>
        <p className="text-slate-300">
          We’re currently focused on making the core journaling experience feel
          as smooth and reliable as possible. Once that foundation is fully
          settled, this space will host:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li>Simple prompts to make writing feel less intimidating.</li>
          <li>Ideas for checking in with yourself in busy seasons.</li>
          <li>
            Behind-the-scenes notes on how Havenly uses AI in a careful, human-
            first way.
          </li>
        </ul>
        <p className="text-slate-400 text-sm">
          For now, the best way to explore Havenly is simply to{" "}
          <span className="text-emerald-300">
            start a reflection from your dashboard
          </span>{" "}
          and see how it feels.
        </p>
      </section>
    </main>
  );
}
