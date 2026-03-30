import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations, getLocaleFromCookieString } from "@/app/lib/i18n";

export default function NotFound() {
  const t = getTranslations(getLocaleFromCookieString(cookies().toString()));
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-950 px-4">
      <div className="mx-auto max-w-md text-center space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          404
        </p>
        <h1 className="font-display text-2xl font-semibold text-[color:var(--hvn-text-primary)]">
          Page not found
        </h1>
        <p className="text-sm leading-relaxed text-slate-400">
          This page doesn&apos;t exist. If you think this is a bug, try going
          back to where you came from.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="rounded-full bg-[color:var(--hvn-accent-mint)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--hvn-accent-mint-hover)]"
          >
            {t.nav.goToDashboard}
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
          >
            {t.nav.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
