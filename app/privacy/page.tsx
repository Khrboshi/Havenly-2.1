// app/privacy/page.tsx

import Link from "next/link";

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto max-w-3xl px-6 pt-24 pb-20">
        {/* Header */}
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
            Privacy & data
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Your writing stays yours.
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            Havenly is built for quiet, honest reflection. That only makes
            sense if your data is handled with care. This page explains, in
            plain language, what we collect, how it&apos;s used, and the choices
            you have.
          </p>
        </header>

        {/* CTA strip */}
        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-slate-200">
              Short version: we use your data only to run Havenly, improve your
              experience, and keep things secure. We don&apos;t sell your data
              or use your writing for ads.
            </p>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-[11px] font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Start free
              </Link>
              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-[11px] text-slate-100 hover:bg-slate-900"
              >
                Explore Premium
              </Link>
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <section className="space-y-8 text-sm text-slate-200">
          <div>
            <h2 className="text-base font-semibold text-slate-50">
              1. What we collect
            </h2>
            <p className="mt-2 text-slate-300">
              When you use Havenly, we collect only what we need to provide the
              service:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
              <li>
                <span className="font-medium">Account basics:</span> your email
                address and authentication details.
              </li>
              <li>
                <span className="font-medium">Journal entries:</span> the text
                you write in Havenly, which is stored securely in our database.
              </li>
              <li>
                <span className="font-medium">Usage signals:</span> basic app
                events such as when you log in, create an entry, or view
                insights. These help us keep the product reliable and improve
                it over time.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-50">
              2. How your data is used
            </h2>
            <p className="mt-2 text-slate-300">
              Your writing is used to provide reflections, insights, and
              timelines back to you. Specifically:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
              <li>
                To store and display your journal entries across sessions and
                devices.
              </li>
              <li>
                To generate AI reflections and summaries, when you request them.
              </li>
              <li>
                To calculate patterns and timelines if you&apos;re using
                Premium.
              </li>
            </ul>
            <p className="mt-2 text-slate-300">
              We don&apos;t use your entries to target ads, build marketing
              profiles, or sell to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-50">
              3. AI & your writing
            </h2>
            <p className="mt-2 text-slate-300">
              Havenly uses AI models to help you see patterns and receive
              reflections. When you ask for a reflection, parts of your entry
              may be sent securely to an AI provider to generate a response.
            </p>
            <p className="mt-2 text-slate-300">
              We aim to work with providers that respect user privacy and
              prohibit training on your data by default. If this changes in the
              future, we will update this page and give you clear options.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-50">
              4. Data retention
            </h2>
            <p className="mt-2 text-slate-300">
              Your entries remain in your account until you choose to delete
              them or request account deletion. Backups may persist for a short
              period as part of normal infrastructure operations.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-50">
              5. Your choices and controls
            </h2>
            <p className="mt-2 text-slate-300">
              You have meaningful control over your Havenly data:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
              <li>Export or copy your entries at any time.</li>
              <li>Edit or delete individual entries.</li>
              <li>
                Request account deletion if you no longer wish to use the
                service.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-50">
              6. Security
            </h2>
            <p className="mt-2 text-slate-300">
              Havenly is built on modern, well-supported infrastructure. We use
              secure connections (HTTPS) and industry-standard practices to
              protect your account and entries. No system is perfect, but we
              treat your writing as sensitive by default.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-50">
              7. Questions
            </h2>
            <p className="mt-2 text-slate-300">
              If you have questions about how your data is handled, or if you
              need help with deletion or export, please reach out through the
              same email you used to sign up.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-slate-200">
              Havenly only makes sense if it feels safe enough to be honest.
              This will always be the foundation of how we treat your data.
            </p>
            <div className="flex flex-wrap gap-3 sm:justify-end">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Start a private journal
              </Link>
              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-xs text-slate-100 hover:bg-slate-900"
              >
                Learn about Premium
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/95">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {currentYear} Havenly 2.1. All rights reserved.</p>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
