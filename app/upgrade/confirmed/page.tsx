import Link from "next/link";

export const metadata = {
  title: "Premium | Havenly",
};

export default function UpgradeConfirmedPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-slate-200">
      <h1 className="text-2xl font-semibold text-white">
        Premium is coming soon
      </h1>

      <p className="mt-3 max-w-xl text-sm text-slate-400">
        Payments are temporarily paused while we finalize stability.  
        You can continue journaling freely — and preview Premium insights today.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/insights/preview"
          className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Preview Premium insights
        </Link>

        <Link
          href="/dashboard"
          className="text-sm text-slate-400 hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
