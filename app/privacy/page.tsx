// app/privacy/page.tsx
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-hvn-bg text-hvn-text-primary bg-hvn-page-gradient">
      <section className="pt-16 pb-14 sm:pt-20 sm:pb-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border border-hvn-card bg-slate-950/50 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Privacy Policy
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your journal stays yours.
            </h1>

            <p className="mt-4 text-sm text-slate-200/80 sm:text-base">
              Havenly was built for people who need a calm, protected space to
              write. Your entries are private, stored securely, and never used
              for advertising.
            </p>

            <div className="mt-6 space-y-4 text-sm text-slate-200/75">
              <p>
                Your reflections remain in your account unless you delete them.
              </p>
              <p>
                We keep Havenly quiet, distraction-free, and designed for your
                wellbeing.
              </p>
              <p>
                If you are ready, you can start with the Free plan — no credit
                card required.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Start free journal
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 px-5 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-900"
              >
                Read About →
              </Link>
            </div>

            <div className="mt-8 border-t border-slate-800 pt-6 text-xs text-slate-400">
              Not a clinical or crisis service. If you need urgent help, please
              contact local emergency services.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
