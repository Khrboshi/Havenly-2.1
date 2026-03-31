import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations, getLocaleFromCookieString } from "@/app/lib/i18n";
import { CONFIG, BRAND } from "@/app/lib/config";

export const metadata: Metadata = {
  title: `Page Not Found | ${CONFIG.appName}`,
  description: "The page you were looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const t = getTranslations(getLocaleFromCookieString(cookies().toString()));
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-qm-bg px-4">
      <div className="mx-auto max-w-md text-center space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qm-faint">
          404
        </p>
        <h1 className="font-display text-2xl font-semibold text-qm-primary">
          Page not found
        </h1>
        <p className="text-sm leading-relaxed text-qm-muted">
          This page doesn&apos;t exist. If you think this is a bug, try going
          back to where you came from.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="rounded-full bg-qm-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-qm-accent-hover"
          >
            {t.nav.goToDashboard}
          </Link>
          <Link
            href="/"
            className="rounded-full border border-qm-border-subtle px-5 py-2.5 text-sm font-medium text-qm-secondary transition-colors hover:bg-qm-soft"
          >
            {t.nav.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
