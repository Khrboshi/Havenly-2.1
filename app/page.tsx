import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Havenly | A calmer way to check in with yourself",
  description:
    "Learn how Havenly helps you write short reflections, see gentle AI summaries, and notice patterns in your inner world — without pressure or judgment.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-300 uppercase">
          About Havenly
        </p>

        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          A calm, private space to{" "}
          <span className="text-emerald-300">check in</span>{" "}
          <span className="block md:inline text-emerald-100">
            with yourself.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300">
          Havenly is a lightweight micro-journal designed for real life — the
          tired evenings, in-between meetings, and quiet moments when you just
          need a safe place to think out loud for a few minutes.
        </p>

        {/* What Havenly is */}
        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-slate-50">
            What Havenly is
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Havenly helps you write short, honest reflections and then shows a
            gentle AI summary of what you wrote — not advice or judgement, just
            a clearer mirror. Over time, those small check-ins can make it
            easier to notice patterns, name emotions, and decide what you want
            to protect or change.
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
            <li>• Quick daily reflections in a calm, distraction-free space.</li>
            <li>
              • A soft AI summary that highlights what felt important in your
              own words.
            </li>
            <li>• No streaks, no charts judging you, and no public profile.</li>
          </ul>
        </section>

        {/* Gentle AI section */}
        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-slate-50">
            A gentle use of AI you can trust.
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            The AI in Havenly is intentionally quiet. Its role is to mirror back
            what you wrote, ask kinder questions, or surface themes you might
            have missed — not to optimize your life or tell you what to do.
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
            <li>• No ads, no social feed, and no “growth-hacking” alerts.</li>
            <li>
              • Reflections are used only to generate your summaries and
              insights, not for advertising or social media content.
            </li>
            <li>
              • You stay in control — you choose what to write, when to write,
              and when to step away.
            </li>
          </ul>
        </section>

        {/* Future / Plus section */}
        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-slate-50">
            Free today, with deeper insights coming soon.
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Right now, Havenly focuses on making daily journaling feel as simple
            and low-pressure as possible. The free plan gives you a private
            space to write and revisit your reflections.
          </p>
          <p className="text-sm leading-relaxed text-slate-300">
            We are working on{" "}
            <span className="font-semibold text-emerald-300">Havenly Plus</span>
            , which will introduce:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
            <li>• Richer AI insights and weekly summaries.</li>
            <li>• Emotional patterns and mood timelines over time.</li>
            <li>• Backup, history, and advanced reflection tools.</li>
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            When Havenly Plus is ready, you will be able to keep using the free
            plan and optionally upgrade if the deeper insights feel helpful.
          </p>
        </section>

        {/* Human sized product */}
        <section className="mt-10 border-t border-slate-800 pt-8">
          <h2 className="text-lg font-semibold text-slate-50">
            A small, human-sized product.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Havenly is being built carefully and incrementally — with a focus on
            calm design, emotional safety, and clear boundaries around how AI is
            used. The goal is not to keep you online longer, but to give you a
            few honest minutes with yourself and then let you get back to your
            day.
          </p>
          <p className="mt-4 text-xs text-slate-400">
            If Havenly helps you exhale a little, notice one feeling more
            clearly, or speak to yourself with a bit more kindness, then it is
            doing its job.
          </p>
        </section>
      </section>
    </main>
  );
}
