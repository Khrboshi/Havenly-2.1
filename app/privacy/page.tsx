// app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-white/60">
          Last updated: November 2025
        </p>

        <p className="text-slate-300 text-sm leading-relaxed">
          Havenly is designed with privacy at the core. Your reflections,
          emotions, and personal notes belong entirely to you. We do not share,
          sell, or use your data for advertising or third-party analytics.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-emerald-300">
            Data ownership
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            All journal entries and personal reflections remain exclusively tied
            to your user account. They are not visible publicly and are never
            used to profile you or target you in any way.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-emerald-300">Security</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Your data is stored securely using industry-standard encryption
            through Supabase. Access to your data requires authentication, and
            no one—including the Havenly team—can view or retrieve your journal
            entries.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-emerald-300">
            AI reflections
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            When you submit a reflection for AI insight, only the text of your
            entry is sent to our AI provider. We do not store this text anywhere
            outside of your own account. No long-term logs or training data are
            created from your content.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-emerald-300">
            Your control
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            You may delete your journal entries or your entire account at any
            time. Deleting your account removes all personal data permanently
            from our systems.
          </p>
        </section>

        <p className="text-slate-400 text-xs pt-4">
          If you have any questions about this policy or how your data is
          handled, please contact us using the support channel linked in the
          app.
        </p>
      </div>
    </div>
  );
}
