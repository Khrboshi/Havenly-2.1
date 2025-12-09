export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="max-w-3xl mx-auto px-4 pt-28 pb-24">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-slate-300 leading-relaxed mb-4">
          Havenly was built for people who need a calm, protected space to write.
        </p>

        <p className="text-slate-400 leading-relaxed mb-4">
          Your entries are private, encrypted, and never used for advertising or shared with
          third parties. Your reflections always remain in your account unless you delete them.
        </p>

        <p className="text-slate-400 leading-relaxed">
          We keep Havenly quiet, distraction-free, and designed for your wellbeing.
        </p>
      </section>

      <footer className="border-t border-slate-800 py-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Havenly 2.1. All rights reserved.
      </footer>
    </main>
  );
}
