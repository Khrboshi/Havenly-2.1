import Link from "next/link";

export const metadata = {
  title: "Premium — Coming Soon | Havenly",
};

export default function UpgradeConfirmedPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-slate-200">
      <h1 className="text-2xl font-semibold text-white">Premium is coming soon</h1>

      <p className="mt-3 max-w-xl text-sm text-slate-400">
        Premium payments are temporarily disabled while we finish the feature set and
        make the experience stable. You can keep using Havenly on Free for now.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/insights/preview"
          className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Preview Premium insights
        </Link>

        <Link href="/dashboard" className="text-sm text-slate-400 hover:underline">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
