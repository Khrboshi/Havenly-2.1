import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 pt-28 pb-20 flex flex-col md:flex-row items-center gap-12">

        {/* LEFT SIDE */}
        <div className="flex-1">
          <div className="text-emerald-300 text-xs font-semibold tracking-widest uppercase mb-4">
            Havenly 2.1 • Early Access
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            A calm space to{" "}
            <span className="text-emerald-300">understand your day</span>{" "}
            in just a few minutes.
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            Havenly is a private micro-journal with gentle AI reflections that
            help you see your day with clarity and compassion — no pressure,
            no streaks, and no public feed. Just a quiet place to slow down
            and breathe.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              href="/magic-login"
              className="rounded-full bg-emerald-400 px-6 py-2.5 text-slate-900 font-semibold hover:bg-emerald-300 transition"
            >
              Start journaling free
            </Link>

            <Link
              href="/about"
              className="px-5 py-2.5 border border-slate-700 rounded-full text-slate-200 hover:border-emerald-400 transition"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 w-full">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="text-emerald-300 text-sm font-medium mb-3">
              Today’s gentle reflection
            </div>

            <div className="text-slate-300 text-sm leading-relaxed mb-4">
              “It sounds like today brought a lot to your plate. What helped
              you get through it? What made things even a little lighter?”
            </div>

            <div className="text-slate-400 text-xs">
              Private • AI-assisted • No tracking • No judgments
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-emerald-300 text-sm font-semibold tracking-widest uppercase mb-10">
          How Havenly Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/40">
            <h3 className="text-emerald-300 text-sm font-semibold mb-2">1 — Check In</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Once a day (or whenever you like), you answer a gentle prompt
              and jot down a few honest sentences.
            </p>
          </div>

          <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/40">
            <h3 className="text-emerald-300 text-sm font-semibold mb-2">2 — Reflect</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Havenly’s AI offers a soft reflection — not advice, just a kind
              angle that helps you see your day with more compassion.
            </p>
          </div>

          <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/40">
            <h3 className="text-emerald-300 text-sm font-semibold mb-2">3 — Notice Patterns</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Over time, you begin to see what energizes you, what drains you,
              and what you want to protect or change.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">
          Built for real life, not perfect habits
        </h3>

        <p className="text-slate-300 leading-relaxed mb-8">
          Havenly is designed for the nights you open your laptop feeling tired,
          the mornings when you have three minutes before a meeting, and the days
          you don’t have energy for a big routine. There are no streaks to break,
          no charts judging you — just a quiet space waiting when you need it.
        </p>

        <h3 className="text-xl font-semibold mb-4">A gentle use of AI</h3>

        <p className="text-slate-300 leading-relaxed">
          Havenly’s AI isn’t trying to tell you how to live or optimize your day.
          It mirrors what you write, highlights what seems important, and invites
          kinder questions. Your text stays private and is used only to generate
          your reflections — not for ads or social feeds.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-6 mt-10 text-center text-slate-500 text-xs">
        Havenly 2.1 — Your personal calm space to reflect.
      </footer>
    </main>
  );
}
