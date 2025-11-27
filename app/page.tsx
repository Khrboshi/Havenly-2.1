import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Hero */}
        <h1 className="text-5xl font-bold leading-tight text-white">
          Slow down. Check in.  
          <span className="block text-brand-primary">
            Feel a little lighter.
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 leading-relaxed">
          Havenly helps you reflect gently, in just a few minutes a day.  
          No pressure. No goals. Just honest check-ins supported by quiet, kind AI.
        </p>

        <div className="mt-8">
          <Link
            href="/magic-login"
            className="inline-block rounded-full bg-brand-primary px-6 py-3 text-white font-medium hover:bg-brand-primary-dark transition"
          >
            Start now — it’s free
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-16" />

        {/* ▌ START HERE — Blog Recommendation */}
        <section>
          <p className="uppercase tracking-wide font-medium text-brand-primary mb-3">
            Start here
          </p>

          <h2 className="text-3xl font-semibold text-white mb-4">
            A short read before you begin
          </h2>

          <p className="text-gray-300 leading-relaxed mb-8">
            A gentle introduction to why tiny check-ins matter — and how a few
            honest sentences can already change how you feel today.
          </p>

          <Link href="/blog/why-gentle-journaling-works" className="block group">
            <div className="rounded-xl bg-white/[0.05] border border-white/[0.08] p-6 hover:bg-white/[0.08] transition">
              <p className="text-sm text-gray-400 mb-1">Jan 1, 2025 · 5 min read</p>

              <h3 className="text-xl font-semibold text-white group-hover:text-brand-primary transition">
                Why gentle journaling works (even if you only write for 5 minutes)
              </h3>

              <p className="mt-2 text-gray-400">
                A tiny check-in can shift your whole day. Here’s why.
              </p>

              <span className="inline-block mt-4 text-brand-primary font-medium">
                Read the article →
              </span>
            </div>
          </Link>
        </section>

        {/* Divider */}
        <div className="h-px bg-white/10 my-16" />

        {/* ABOUT / PROMISE */}
        <section className="mt-10">
          <h2 className="text-3xl font-semibold text-white mb-4">
            A calmer way to use technology
          </h2>

          <p className="text-gray-300 leading-relaxed">
            Havenly stays intentionally simple — no streaks, no pressure, no
            achievement systems. Just a quiet space made for real people having
            real days.
          </p>
        </section>
      </div>
    </main>
  );
}
