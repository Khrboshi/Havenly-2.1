import Link from "next/link";
import { CONFIG } from "@/app/lib/config";

// Note: Next.js 15 does not support async request APIs (cookies, headers)
// in not-found.tsx. This page falls back to English — it is a rare edge
// case and the nav links remain functional in all locales.

export default function NotFound() {
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
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="rounded-full border border-qm-border-subtle px-5 py-2.5 text-sm font-medium text-qm-secondary transition-colors hover:bg-qm-soft"
          >
            Back to {CONFIG.appName}
          </Link>
        </div>
      </div>
    </div>
  );
}
