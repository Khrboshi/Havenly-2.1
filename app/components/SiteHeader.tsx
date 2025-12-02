"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./auth/LogoutButton";
import { useSupabase } from "./SupabaseSessionProvider";
import { useUserPlan } from "./useUserPlan";

type NavLink = {
  label: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Journal", href: "/journal" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Tools", href: "/tools" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { session } = useSupabase();
  const { planLabel } = useUserPlan(session ?? undefined);

  const isActive = (href: string) => {
    if (!pathname) return false;

    // Home = only "/"
    if (href === "/") {
      return pathname === "/";
    }

    // Other links are "startsWith" so /blog/article/123 still highlights Blog
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-6 px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Brand / logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-50"
        >
          Havenly
        </Link>

        {/* Primary navigation */}
        <nav className="flex items-center gap-4 text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={[
                "transition-colors",
                isActive(href)
                  ? "font-semibold text-slate-50"
                  : "text-slate-300 hover:text-slate-50",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side: plan, credits, upgrade, logout */}
        <div className="ml-auto flex items-center gap-3 text-xs">
          {/* Plan pill (always visible; falls back to "free") */}
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-300">
            {planLabel ?? "free"}
          </span>

          {/* Credits pill (static for now) */}
          <span className="rounded-full border border-slate-500/40 bg-slate-900/60 px-3 py-1 font-medium text-slate-300">
            Credits: 0
          </span>

          {/* Upgrade button (always visible) */}
          <Link
            href="/upgrade"
            className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950 shadow-sm hover:bg-emerald-400"
          >
            Upgrade
          </Link>

          {/* Logout only when session exists */}
          {session && (
            <div className="pl-3">
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
