"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    match: (pathname) => pathname === "/",
  },
  {
    label: "Journal",
    href: "/journal",
    match: (pathname) => pathname.startsWith("/journal") || pathname === "/dashboard",
  },
  {
    label: "About",
    href: "/about",
    match: (pathname) => pathname === "/about",
  },
  {
    label: "Tools",
    href: "/tools",
    match: (pathname) => pathname === "/tools",
  },
];

function isActive(item: NavItem, pathname: string) {
  return item.match(pathname);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-400/40">
            <span className="text-sm font-semibold text-emerald-400">H</span>
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-50">
            Havenly
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item, pathname ?? "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "transition-colors",
                  active
                    ? "text-emerald-300"
                    : "text-slate-300 hover:text-emerald-200",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-emerald-400 hover:text-emerald-300 md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="animate-fade-in border-t border-slate-800 bg-slate-950/95 px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-2 text-sm font-medium">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item, pathname ?? "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-md px-2 py-1.5",
                    active
                      ? "bg-emerald-500/10 text-emerald-200"
                      : "text-slate-200 hover:bg-slate-800/80",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
