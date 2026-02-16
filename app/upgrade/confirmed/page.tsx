import Link from "next/link";

export const metadata = {
  title: "Premium | Havenly",
};

export default function UpgradeConfirmedPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-slate-200">
      <h1 className="text-2xl font-semibold text-white">
        Premium is almost ready
      </h1>

      <p className="mt-3 max-w-xl text-sm text-slate-400">
        Payments are temporarily disabled while we finalize stability. You can keep
        journaling freely — and preview the kinds of patterns Premium will reveal.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/insights/preview"
          className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Preview insights
        </Link>

        <Link
          href="/dashboard"
          className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
        >
          Back to dashboard
        </Link>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Your journal remains private by default. Premium adds clarity — not pressure.
      </p>
    </main>
  );
}
