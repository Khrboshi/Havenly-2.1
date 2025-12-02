"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./auth/LogoutButton";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/journal", label: "Journal" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/tools", label: "Tools" },
];

function NavLink({ href, label }: NavItem) {
  const pathname = usePathname();

  const isActive =
    pathname === href ||
    (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={[
        "text-sm transition-colors",
        isActive
          ? "text-white"
          : "text-slate-300/80 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();

  // Show "Log out" on all authenticated sections
  const showLogout =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/journal") ||
    pathname.startsWith("/tools") ||
    pathname.startsWith("/upgrade");

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-white"
        >
          Havenly
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Right side: plan, credits, upgrade, logout */}
        <div className="flex items-center gap-3 text-xs">
          {/* Plan pill – static for now (Free) */}
          <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-slate-200">
            free plan
          </span>

          {/* Credits – static 0 for now */}
          <span className="hidden text-slate-300/80 sm:inline">
            Credits:{" "}
            <span className="font-semibold text-slate-50">0</span>
          </span>

          {/* Upgrade button */}
          <Link
            href="/upgrade"
            className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-400"
          >
            Upgrade
          </Link>

          {/* Logout – only on logged-in sections */}
          {showLogout && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}
