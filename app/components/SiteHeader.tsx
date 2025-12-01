"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserPlan } from "./useUserPlan";

export default function SiteHeader() {
  const pathname = usePathname();
  const { authenticated, planType, credits, loading } = useUserPlan();

  const nav = [
    { href: "/", label: "Home" },
    { href: "/journal", label: "Journal" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/tools", label: "Tools" },
  ];

  const planLabel =
    planType === "PREMIUM"
      ? "Premium"
      : planType === "ESSENTIAL"
      ? "Essential"
      : "Free";

  const planBadgeClass =
    planType === "PREMIUM"
      ? "border-emerald-400 text-emerald-300 bg-emerald-500/10"
      : planType === "ESSENTIAL"
      ? "border-sky-400 text-sky-300 bg-sky-500/10"
      : "border-slate-600 text-slate-300 bg-slate-800/60";

  return (
    <header className="w-full border-b border-hvn-card bg-hvn-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-hvn-text-primary">
          Havenly
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden gap-6 text-sm font-medium text-hvn-text-muted sm:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href
                    ? "text-hvn-accent-mint"
                    : "hover:text-hvn-text-primary"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Plan + credits summary (only when logged in) */}
          {!loading && authenticated && (
            <div className="hidden items-center gap-2 text-xs sm:flex sm:text-sm">
              <span
                className={`rounded-full border px-3 py-1 font-medium ${planBadgeClass}`}
              >
                {planLabel} plan
              </span>
              <span className="text-hvn-text-muted">
                Credits: <span className="font-semibold">{credits}</span>
              </span>
              {planType !== "PREMIUM" && (
                <Link
                  href="/upgrade"
                  className="rounded-full bg-hvn-accent-mint px-3 py-1 font-semibold text-slate-900 hover:bg-hvn-accent-mint/90"
                >
                  Upgrade
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
