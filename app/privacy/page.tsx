// app/privacy/page.tsx
// Soft Blue Calm v2.2 — Improved header spacing, no breaking changes

export default function PrivacyPage() {
  return (
    <main className="min-h-screen w-full bg-[#050816] text-gray-100 px-6 md:px-12 lg:px-24 pt-20 pb-24">

      <h1 className="text-3xl font-semibold text-gray-50 mb-4">
        Privacy Policy
      </h1>

      <p className="text-gray-300 text-sm mb-10">
        Last updated: November 2025
      </p>

      <div className="max-w-3xl space-y-10">

        <section>
          <h2 className="text-xl font-semibold text-teal-300 mb-2">
            Data ownership
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            All journal entries and reflections remain exclusively tied to your
            account. We do not share, sell, or use your data for advertising or
            third-party analytics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-teal-300 mb-2">
            Security
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your data is stored using industry-standard encryption via Supabase.
            Access requires authentication, and no one—including the Havenly
            team—can access your entries.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-teal-300 mb-2">
            AI reflections
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            When you request an AI reflection, only the text of your entry is
            sent to our AI provider. We do not store or reuse your content for
            training or analytics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-teal-300 mb-2">
            Your control
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            You may delete any entry or your entire account at any time. This
            permanently removes all personal data from our systems.
          </p>
        </section>

      </div>

      <p className="mt-16 text-xs text-gray-500 max-w-2xl">
        If you have any questions about this policy or how your data is handled,
        please contact us using the support channel linked in the app.
      </p>

    </main>
  );
}
