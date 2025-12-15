import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Privacy & Data Use
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your words are yours. Always.
        </h1>

        <p className="mt-4 max-w-2xl text-sm text-slate-300">
          Havenly was built for people who need a calm, protected space to
          reflect — without worrying about who might be watching, training on,
          or extracting meaning from their inner life.
        </p>

        {/* Divider */}
        <div className="my-10 border-t border-slate-800" />

        {/* Core Principles */}
        <section className="space-y-6 text-sm text-slate-300">
          <div>
            <h2 className="font-semibold text-slate-100">
              1. Your journal is private by default
            </h2>
            <p className="mt-2">
              Everything you write in Havenly belongs to you. Your reflections
              are stored securely and are only accessible from your account.
              No one at Havenly reads your entries.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-100">
              2. Your data is not used to train public AI models
            </h2>
            <p className="mt-2">
              Your journal entries are <strong>not</strong> used to train public
              or shared AI models. The purpose of Havenly is to support your
              reflection — not to turn your inner life into data for others.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-100">
              3. AI responses are generated only when you ask
            </h2>
            <p className="mt-2">
              Havenly’s AI responds only when you request a reflection. It does
              not monitor you in the background, analyze your behavior, or
              generate insights without your consent.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-100">
              4. Havenly is not therapy — and does not pretend to be
            </h2>
            <p className="mt-2">
              Havenly is a journaling and reflection companion. It is not a
              medical, clinical, or crisis service. It can sit alongside therapy,
              coaching, or personal practices — but it does not replace them.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-100">
              5. You stay in control
            </h2>
            <p className="mt-2">
              You can delete your journal entries at any time. When you do,
              they are removed from your account. Havenly is designed to give
              you agency, not dependency.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="my-10 border-t border-slate-800" />

        {/* Calm reassurance */}
        <section className="max-w-2xl text-sm text-slate-300">
          <p>
            Havenly is intentionally quiet. No ads. No social sharing. No
            algorithmic feeds. No performance metrics about your inner life.
          </p>
          <p className="mt-3">
            This is a space designed for honesty, not optimization.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center gap-3 text-xs">
          <Link
            href="/magic-login"
            className="rounded-full bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Start a private journal
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-slate-700 px-4 py-2 font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-900"
          >
            Read how reflection works →
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-slate-500">
          Last updated: 2025 · Havenly 2.1
        </p>
      </section>
    </main>
  );
}
