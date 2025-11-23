export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-slate-100">Privacy Policy</h1>

      <p className="text-slate-300 text-sm leading-relaxed">
        Your privacy matters. Havenly is designed as a personal reflection
        space, not a social network and not a data-harvesting platform. We only
        collect the minimum information needed to provide you with a secure and
        seamless journaling experience.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-emerald-300">1. What we collect</h2>
        <p className="text-slate-400 text-sm">
          • Your email address (for login & account recovery).  
          • Your journal entries (stored securely in your private database).  
          • Anonymous usage analytics to improve reliability.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-emerald-300">
          2. What we never do
        </h2>
        <p className="text-slate-400 text-sm">
          • We never sell your data.  
          • We never share your journal entries with third parties.  
          • We never use your content to train external AI models.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-emerald-300">
          3. How your data is used
        </h2>
        <p className="text-slate-400 text-sm">
          Journal entries stay tied only to your account and are not visible to
          other users. Authentication is handled securely through Supabase.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-emerald-300">
          4. AI reflections
        </h2>
        <p className="text-slate-400 text-sm">
          When generating reflections, your inputs are sent temporarily to our
          AI provider (Groq) for processing only. They are **not stored** by the
          AI provider.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-emerald-300">
          5. Your rights
        </h2>
        <p className="text-slate-400 text-sm">
          At any time, you can request:  
          • deletion of your account  
          • deletion of all journal entries  
          • export of your data  
        </p>
      </section>

      <p className="text-slate-500 text-xs pt-10">
        Last updated: {new Date().getFullYear()}
      </p>
    </main>
  );
}
