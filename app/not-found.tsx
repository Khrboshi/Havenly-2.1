import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-10 text-center space-y-3">
      <h1 className="text-2xl font-semibold text-slate-100">
        Page not found
      </h1>
      <p className="text-sm text-slate-400">
        This page doesn&apos;t exist. If you think this is a bug, try going
        back to your{" "}
        <Link
          href="/dashboard"
          className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors"
        >
          dashboard
        </Link>
        .
      </p>
    </div>
  );
}
