import Link from "next/link";

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-50">
          Billing & Premium
        </h1>
        <p className="text-sm text-slate-300">
          Havenly Premium is not live yet. Once launched, you&apos;ll see your
          plan details and upgrade options here.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
        <p className="mb-2 font-medium text-slate-100">
          Current status: Free early access
        </p>
        <p className="text-xs text-slate-400">
          You have access to the full early-access feature set. We&apos;ll
          notify you inside the app before introducing any paid plans.
        </p>
      </section>

      <Link
        href="/settings"
        className="inline-flex items-center rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-900/60"
      >
        ← Back to settings
      </Link>
    </div>
  );
}
