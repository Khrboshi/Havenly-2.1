// app/privacy/page.tsx
// Privacy Policy – Logged-out view

export default function PrivacyPage() {
  return (
    <main className="min-h-screen w-full bg-[#050816] text-slate-100">
      <section className="px-6 pb-24 pt-24 md:px-10 lg:px-24">
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-50">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-400">Last updated: November 2025</p>
          </header>

          <section className="space-y-4 text-sm leading-relaxed text-slate-200">
            <div>
              <h2 className="text-base font-semibold text-emerald-300">
                Data ownership
              </h2>
              <p className="mt-2">
                All journal entries and reflections remain exclusively tied to
                your account. We do not share, sell, or use your data for
                advertising or third-party analytics.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-emerald-300">
                Security
              </h2>
              <p className="mt-2">
                Your data is stored using industry-standard encryption via
                Supabase. Access requires authentication, and no one—including
                the Havenly team—can access your entries.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-emerald-300">
                AI reflections
              </h2>
              <p className="mt-2">
                When you request an AI reflection, only the text of your entry
                is sent to our AI provider. We do not store or reuse your
                content for training or analytics.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-emerald-300">
                Your control
              </h2>
              <p className="mt-2">
                You may delete any entry or your entire account at any time.
                This permanently removes all personal data from our systems.
              </p>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              If you have any questions about this policy or how your data is
              handled, please contact us using the support channel linked in the
              app.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
