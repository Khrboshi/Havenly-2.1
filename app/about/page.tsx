// app/about/page.tsx
// About Havenly – logged out

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-[#050816] text-slate-100">
      <section className="px-6 pb-24 pt-24 md:px-10 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Intro */}
          <header className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              About Havenly
            </p>
            <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
              A calm, private space to{" "}
              <span className="text-emerald-300">check in</span> with yourself.
            </h1>
            <p className="text-sm text-slate-300 sm:text-base">
              Havenly is a lightweight micro-journal designed for real life—the
              tired evenings, in-between meetings, and quiet moments where you
              just need a safe place to think out loud for a few minutes.
            </p>
          </header>

          {/* What it is / is not */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-[#050816] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.45)]">
              <h2 className="text-sm font-semibold text-slate-50">
                What Havenly is
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>
                  • A distraction-free page where a few honest sentences are
                  enough.
                </li>
                <li>
                  • Gentle AI reflections that highlight what felt important in
                  your own words.
                </li>
                <li>
                  • A private way to notice emotional patterns without charts
                  judging you.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#050816] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.45)]">
              <h2 className="text-sm font-semibold text-slate-50">
                What Havenly is not
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• No public feed, comments, or “likes.”</li>
                <li>
                  • No streaks, productivity scores, or pushy reminders trying
                  to keep you “engaged.”
                </li>
                <li>
                  • No optimization or life-hacking advice from the AI. Just
                  kinder questions and reflections.
                </li>
              </ul>
            </div>
          </section>

          {/* Gentle AI block */}
          <section className="rounded-2xl border border-slate-800 bg-[#050816] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.45)]">
            <h2 className="text-sm font-semibold text-slate-50">
              A gentle use of AI you can trust
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              The AI in Havenly is intentionally quiet. Its role is to mirror
              back what you wrote, ask kinder questions, or surface themes you
              might have missed—not to tell you what to do. Reflections are used
              only to generate your summaries and insights, not for advertising
              or social media content.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• No ads or growth-hacking notifications.</li>
              <li>• No selling your entries as “engagement data.”</li>
              <li>
                • You stay in control—you choose what to write, and when.
              </li>
            </ul>
          </section>

          {/* Havenly Plus teaser */}
          <section className="rounded-2xl border border-slate-800 bg-[#050816] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.45)]">
            <h2 className="text-sm font-semibold text-slate-50">
              Free today, with deeper insights coming soon
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Right now, Havenly focuses on making daily journaling feel as
              simple and low-pressure as possible. The free plan gives you a
              private space to write and revisit your reflections.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              We are working on <span className="text-emerald-300">Havenly Plus</span>, which will add:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Richer AI insights and weekly summaries.</li>
              <li>• Emotional patterns and mood timelines over time.</li>
              <li>• Backup, history, and advanced reflection tools.</li>
            </ul>
          </section>

          {/* Human-sized product */}
          <section className="rounded-2xl border border-slate-800 bg-[#050816] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.45)]">
            <h2 className="text-sm font-semibold text-slate-50">
              A small, human-sized product
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Havenly is being built carefully and incrementally, with a focus
              on calm design, emotional safety, and clear boundaries around how
              AI is used. The goal is not to keep you online longer, but to give
              you a few honest minutes with yourself and then let you get back
              to your day.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              If Havenly helps you exhale a little, notice one feeling more
              clearly, or speak to yourself with a bit more kindness, then it is
              doing its job.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
