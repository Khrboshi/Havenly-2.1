"use client";
// app/not-found.tsx
// Client component — Next.js 15 does not support async request APIs
// (cookies, headers) in not-found.tsx, so we read locale from localStorage
// via the shared detectLocale() utility from @/app/lib/i18n.

/**
 * app/not-found.tsx
 *
 * Global 404 page — rendered by Next.js for any unmatched route.
 */
import Link from "next/link";
import { useState } from "react";
import { CONFIG } from "@/app/lib/config";
import { detectLocale, getTranslations } from "@/app/lib/i18n";

export default function NotFound() {
  // Lazy initializer: reads localStorage on first render (client only).
  // Avoids the extra render + useEffect while still guarding against
  // window being undefined during SSR.
  const [locale] = useState(() => detectLocale());
  const t = getTranslations(locale);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-qm-bg px-4">
      <div className="mx-auto max-w-md text-center space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qm-faint">
          404
        </p>
        <h1 className="font-display text-2xl font-semibold text-qm-primary">
          {t.errors.notFoundTitle}
        </h1>
        <p className="text-sm leading-relaxed text-qm-muted">
          {t.errors.notFoundBody}
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
