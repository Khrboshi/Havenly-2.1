"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./auth/LogoutButton";
import useUserPlan from "./blog/useUserPlan";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/journal", label: "Journal" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/tools", label: "Tools" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  // Safely read plan + credits from the hook
  const { plan, credits } = useUserPlan
    ? useUserPlan()
    : { plan: "Free", credits: 0 };

  const resolvedPlan = plan || "Free";
  const resolvedCredits = typeof credits === "number" ? credits : 0;

  // Where we want Logout to appear
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/journal") ||
    pathname.startsWith("/insights") ||
    pathname.startsWith("/settings");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-50"
          >
            Havenly
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "text-slate-50 font-medium"
                      : "hover:text-slate-50/90 transition"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: plan badge, credits, upgrade, logout */}
        <div className="flex items-center gap-3 text-xs md:text-sm">
          {/* Plan badge */}
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-300">
            {resolvedPlan} plan
          </span>

          {/* Credits */}
          <span className="hidden text-slate-300 md:inline">
            Credits:{" "}
            <span className="font-semibold text-slate-50">
              {resolvedCredits}
            </span>
          </span>

          {/* Upgrade button (hide for Premium) */}
          {resolvedPlan.toLowerCase() !== "premium" && (
            <Link
              href="/upgrade"
              className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950 shadow-sm hover:bg-emerald-400"
            >
              Upgrade
            </Link>
          )}

          {/* Logout only on protected pages */}
          {isProtected && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}
