// app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "About Havenly",
  description: "Havenly is a private AI journaling companion — built for people who want to understand themselves better, not optimize themselves harder.",
  openGraph: {
    title: "About Havenly — Private AI Journaling",
    description: "Built for people who want to understand themselves better, not optimize themselves harder.",
    url: "https://havenly-2-1.vercel.app/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-hvn-bg text-hvn-text-primary bg-hvn-page-gradient">
      <section className="pt-16 pb-20 sm:pt-24">
        <div className="mx-auto max-w-3xl px-6">

          {/* HERO */}
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/70 mb-4">
              About Havenly
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl leading-tight mb-5">
              A private journal that notices what you carry — and helps you see it clearly.
            </h1>
            <p className="text-base leading-relaxed text-slate-400 max-w-2xl">
              Not a productivity tool. Not a mood tracker. Havenly is a place to write honestly,
              get a gentle reflection back, and — over time — see the patterns that have quietly
              been shaping your weeks.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Start journaling free
              </Link>
              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/15 transition-colors"
              >
                See what Premium adds →
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-600">No credit card required. Free is fully usable on its own.</p>
          </div>

          {/* FOUNDER STORY */}
          <div className="mb-14">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-5">
              Why it exists
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-300/80">
              <p>
                I built Havenly because I kept noticing the same thing in myself and in people around me:
                we carry a lot. The emotional labour of relationships, the low hum of work stress,
                the way the same arguments and patterns seem to come back no matter how much
                we try to do things differently.
              </p>
              <p>
                Journaling helped me — but I always felt like I was writing into a void.
                I'd pour something out, close the notebook, and still not quite understand
                what I was actually feeling or why it kept happening.
              </p>
              <p>
                Havenly exists to close that loop. You write. It reflects.
                And over time, it shows you the thread — not to diagnose you,
                not to fix you, but because understanding yourself is genuinely useful.
              </p>
            </div>

            {/* Pull quote */}
            <div className="mt-8 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] px-6 py-5">
              <p className="text-base font-medium text-slate-100 leading-relaxed">
                "Your inner life isn't content. It's yours. Havenly is built around that idea."
              </p>
            </div>
          </div>

          {/* WHAT MAKES IT DIFFERENT */}
          <div className="mb-14">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-5">
              What makes it different
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-300/80">
              <p>
                Most journaling apps store your entries. A few add reminders to write.
                Some let you tag your mood. Havenly does something different: it reads
                what you've written across time and looks for the things that quietly repeat —
                the emotions that keep surfacing, the themes you return to without realising,
                the patterns that have been there for weeks or months.
              </p>
              <p>
                You don't have to do anything to make this happen. You just write honestly,
                and Havenly does the noticing.
              </p>
            </div>

            {/* Is / Is Not */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80 mb-3">
                  Havenly is
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  {[
                    "A private space to write without judgment",
                    "A gentle reflection on what you wrote",
                    "A way to see patterns across weeks and months",
                    "Respectful of your pace and privacy",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-emerald-500">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/70 mb-3">
                  Havenly is not
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  {[
                    "Therapy or a substitute for clinical care",
                    "A productivity or self-optimisation tool",
                    "A public or social platform",
                    "Something you have to use every day",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-slate-600">&mdash;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* HOW AI WORKS */}
          <div className="mb-14">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-5">
              How the AI actually works
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-300/80">
              <p>
                When you write an entry and request a reflection, the AI reads what you've written
                and responds with a short, thoughtful paragraph — not advice, not a diagnosis.
                More like a mirror held up gently: it names what it noticed in your words,
                reflects an emotion back, and sometimes asks a quiet question.
              </p>
              <p>
                Over time, the AI looks across your entries to find recurring threads.
                Which emotions appear most often. Which themes keep coming up.
                Whether things have been shifting or staying the same.
                Premium members see this as a full insights view — their personal pattern, updated as they write.
              </p>
              <p>
                The AI is a tool for your reflection — not a replacement for the people in your life,
                and not a substitute for professional support if you need it.
              </p>
            </div>
          </div>

          {/* PRIVACY */}
          <div className="mb-14 rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Privacy
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-400">
              <p>
                Your journal is private. Your entries are never used to train AI models,
                never shared with third parties, and never shown to anyone but you.
              </p>
              <p>
                We don't run ads. We don't sell data. Havenly earns revenue from Premium subscriptions —
                that's the entire business model, and it's designed that way deliberately.
              </p>
              <p>
                <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Read our full Privacy Policy →
                </Link>
              </p>
            </div>
          </div>

          {/* BOTTOM CTA */}
          <div className="border-t border-slate-800 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 max-w-sm">
              Havenly works best when you use it honestly, at your own pace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Start free
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900 transition-colors"
              >
                Read the blog →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
