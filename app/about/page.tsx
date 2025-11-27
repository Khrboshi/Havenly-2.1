// app/about/page.tsx

export const metadata = {
  title: "About Havenly",
  description:
    "Learn more about Havenly – a calm private space to reflect with gentle AI support.",
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      {/* Hero */}
      <section className="space-y-4">
        <p className="text-sm font-medium tracking-[0.18em] text-emerald-300 uppercase">
          About Havenly
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-50 leading-tight">
          A calm, private space to{" "}
          <span className="text-emerald-300">check in with yourself</span>.
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl">
          Havenly is a lightweight micro-journal designed for real life — the
          tired evenings, in-between meetings, and quiet moments when you just
          need a safe place to think out loud for a few minutes.
        </p>
      </section>

      {/* What Havenly is */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-50">What Havenly is</h2>
        <p className="text-slate-300">
          Havenly helps you write short, honest reflections and then offers a
          gentle AI summary of what you wrote — not advice, not judgement, just
          a clearer mirror. Over time, those small check-ins can make it easier
          to notice patterns, name emotions, and decide what you want to
          protect or change.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li>Write quick daily reflections in a calm, distraction-free space.</li>
          <li>
            See a soft AI summary that highlights what felt important in your
            own words.
          </li>
          <li>No streaks, no charts judging you, and no public profile.</li>
        </ul>
      </section>

      {/* How AI is used */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-50">
          A gentle use of AI
        </h2>
        <p className="text-slate-300">
          The AI in Havenly is intentionally quiet. Its role is to mirror back
          what you wrote, ask a kinder question, or surface themes you might
          have missed — not to optimise your life or tell you what to do.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li>No ads, no social feed, and no “growth-hacking” notifications.</li>
          <li>
            Reflections are used only to generate your summaries and insights,
            not for advertising or social media content.
          </li>
          <li>
            You stay in control — you choose what to write, when to write, and
            when to step away.
          </li>
        </ul>
      </section>

      {/* Plans: Free vs upcoming Plus */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-50">
          Free today, with deeper insights coming soon
        </h2>
        <p className="text-slate-300">
          Right now, Havenly focuses on making daily journaling feel as simple
          and low-pressure as possible. The free plan gives you a private space
          to write and revisit your reflections.
        </p>
        <p className="text-slate-300">
          We’re working on{" "}
          <span className="text-emerald-300 font-medium">Havenly Plus</span>,
          which will introduce:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li>Richer AI insights and weekly summaries.</li>
          <li>Emotional patterns and mood timelines over time.</li>
          <li>Backup, history, and advanced reflection tools.</li>
        </ul>
        <p className="text-slate-400 text-sm">
          When Havenly Plus is ready, you’ll be able to keep using the free plan
          and optionally upgrade if the deeper insights feel helpful.
        </p>
      </section>

      {/* Founder / intention */}
      <section className="space-y-4 border-t border-slate-800 pt-8">
        <h2 className="text-xl font-semibold text-slate-50">
          A small, human-sized product
        </h2>
        <p className="text-slate-300">
          Havenly is being built carefully and incrementally — with a focus on
          calm design, emotional safety, and clear boundaries around how AI is
          used. The goal is not to keep you online longer, but to give you a
          few honest minutes with yourself and then let you get back to your
          day.
        </p>
        <p className="text-slate-400 text-sm">
          If Havenly helps you exhale a little, notice one feeling more
          clearly, or speak to yourself with a bit more kindness, then it’s
          doing its job.
        </p>
      </section>
    </main>
  );
}
