export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <main className="space-y-16">

      <section className="pt-10">
        <h2 className="text-sm font-semibold tracking-wider text-[var(--brand-primary-light)]">
          ABOUT HAVENLY
        </h2>

        <h1 className="mt-4 text-4xl font-bold leading-snug">
          A calm, private space to{" "}
          <span className="text-[var(--brand-primary)]">check in</span> with yourself.
        </h1>

        <p className="mt-6 text-lg text-[var(--brand-text)]/80 max-w-3xl">
          Havenly is a lightweight micro-journal for real life — the tired evenings,
          in-between meetings, and quiet moments when you just need a safe place to
          think out loud for a few minutes.
        </p>
      </section>

      <section className="space-y-8">
        <h3 className="text-2xl font-semibold">What Havenly is</h3>

        <p className="text-[var(--brand-text)]/80 max-w-3xl">
          Havenly helps you write short, honest reflections and then shows a gentle AI
          summary of what you wrote — not advice or judgement, just a clearer mirror.
          Over time, these small check-ins can make it easier to notice patterns,
          name emotions, and decide what you want to protect or change.
        </p>

        <ul className="text-[var(--brand-text)]/80 space-y-4">
          <li>• Quick daily reflections in a calm, distraction-free space.</li>
          <li>• A soft AI summary that highlights what felt important in your own words.</li>
          <li>• No streaks, no charts judging you, and no public profile.</li>
        </ul>
      </section>

      <section className="space-y-8">
        <h3 className="text-2xl font-semibold">A gentle use of AI you can trust</h3>

        <p className="text-[var(--brand-text)]/80 max-w-3xl">
          The AI in Havenly is intentionally quiet. Its role is to mirror back what you
          wrote, ask kinder questions, or surface themes you might have missed — not to
          optimise your life or tell you what to do.
        </p>

        <ul className="text-[var(--brand-text)]/80 space-y-4">
          <li>• No ads, no social feed, and no “growth-hacking” notifications.</li>
          <li>
            • Reflections are used only for your summaries and insights — never for
            advertising or posting elsewhere.
          </li>
          <li>• You stay in control — you choose what to write and when to write.</li>
        </ul>
      </section>

      <section className="pt-4 space-y-8">
        <h3 className="text-2xl font-semibold">Free today, with deeper insights coming soon</h3>

        <p className="text-[var(--brand-text)]/80 max-w-3xl">
          Havenly focuses on making daily journaling feel as simple and low-pressure
          as possible. The free plan gives you a private space to write and revisit
          your reflections.
        </p>

        <p className="text-[var(--brand-primary-light)]">
          We are working on Havenly Plus, which will include:
        </p>

        <ul className="text-[var(--brand-text)]/80 space-y-4">
          <li>• Richer AI insights and weekly summaries.</li>
          <li>• Emotional patterns and mood timelines over time.</li>
          <li>• Backup, history, and advanced reflection tools.</li>
        </ul>

        <p className="text-[var(--brand-text)]/70 max-w-xl italic">
          When Havenly Plus is ready, you will be able to keep using the free plan and
          optionally upgrade if deeper insight feels helpful.
        </p>
      </section>

      <section className="pb-20 space-y-8">
        <h3 className="text-2xl font-semibold">A small, human-sized product</h3>

        <p className="text-[var(--brand-text)]/80 max-w-3xl">
          Havenly is being built carefully and incrementally — with a focus on calm
          design, emotional safety, and clear boundaries around how AI is used. The
          goal is not to keep you online longer, but to help you check in with yourself
          quickly and then get back to your day.
        </p>

        <p className="text-[var(--brand-text)]/60 italic">
          If Havenly helps you exhale a little, notice one feeling more clearly, or
          speak to yourself with a bit more kindness, then it’s doing its job.
        </p>
      </section>
    </main>
  );
}
