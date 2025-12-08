"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabase } from "./SupabaseSessionProvider";
import LogoutButton from "./auth/LogoutButton";
import { useState, useRef, useEffect } from "react";
import { useUserPlan } from "./useUserPlan";

type NavLink = {
  href: string;
  label: string;
  authOnly?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/dashboard", label: "Dashboard", authOnly: true },
  { href: "/journal", label: "Journal", authOnly: true },
  { href: "/insights", label: "Insights", authOnly: true },
  { href: "/tools", label: "Tools", authOnly: true },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { session } = useSupabase();
  const { planType } = useUserPlan();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isLoggedIn = !!session?.user;
  const email = session?.user?.email ?? "";
  const initial = email ? email.charAt(0).toUpperCase() : "U";

  const isPremium = planType === "PREMIUM" || planType === "TRIAL";
  const planLabel =
    planType === "PREMIUM"
      ? "Premium"
      : planType === "TRIAL"
      ? "Trial"
      : "Free";

  // Close mobile menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const visibleLinks = NAV_LINKS.filter((link) =>
    link.authOnly ? isLoggedIn : true
  );

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/90 text-xs font-bold text-slate-950 shadow-md">
              H
            </span>
            <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
              Havenly
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-xs font-medium text-slate-200 sm:flex sm:text-sm">
          {visibleLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  active
                    ? "text-emerald-300"
                    : "text-slate-300 hover:text-emerald-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: plan pill + auth controls */}
        <div className="flex items-center gap-3">
          {/* Plan pill (only for logged-in users) */}
          {isLoggedIn && (
            <span
              className={`hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-flex ${
                isPremium
                  ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40"
                  : "bg-slate-800 text-slate-200 border border-slate-600"
              }`}
            >
              {planLabel} plan
            </span>
          )}

          {/* Auth buttons / user menu */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/magic-login"
                className="hidden rounded-full border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/upgrade"
                className="inline-flex rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 sm:px-4 sm:text-sm"
              >
                Try Premium
              </Link>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-2 py-1 text-xs text-slate-100 hover:bg-slate-800 sm:px-3 sm:py-1.5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold">
                  {initial}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block max-w-[160px] truncate text-[11px] text-slate-200">
                    {email || "Account"}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {planLabel} · Settings
                  </span>
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-slate-700 bg-slate-900/95 p-1 text-sm shadow-lg shadow-slate-950/60">
                  <div className="px-3 py-2 text-[11px] text-slate-300">
                    Signed in as
                    <div className="truncate text-xs font-medium text-white">
                      {email || "Account"}
                    </div>
                  </div>

                  <div className="my-1 border-t border-slate-700" />

                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2 text-xs text-slate-100 hover:bg-slate-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block rounded-lg px-3 py-2 text-xs text-slate-100 hover:bg-slate-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    href="/settings/billing"
                    className="block rounded-lg px-3 py-2 text-xs text-slate-100 hover:bg-slate-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Billing
                  </Link>
                  <Link
                    href="/premium"
                    className="block rounded-lg px-3 py-2 text-xs text-slate-100 hover:bg-slate-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Premium hub
                  </Link>

                  <div className="my-1 border-t border-slate-700" />

                  <div className="px-3 py-2">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle (for small screens – currently just nav links controlled above) */}
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 sm:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1">
              <span className="block h-[1.5px] w-4 bg-slate-200" />
              <span className="block h-[1.5px] w-4 bg-slate-200" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav overlay for small screens */}
      {menuOpen && !isLoggedIn && (
        <nav className="border-t border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 sm:hidden">
          <div className="flex flex-col gap-2">
            {visibleLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-2 py-1.5 ${
                    active
                      ? "bg-slate-800 text-emerald-300"
                      : "hover:bg-slate-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-2 flex gap-2">
              <Link
                href="/magic-login"
                className="flex-1 rounded-full border border-slate-600 px-3 py-1.5 text-center text-xs font-medium text-slate-100 hover:bg-slate-800"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/upgrade"
                className="flex-1 rounded-full bg-emerald-500 px-3 py-1.5 text-center text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                onClick={() => setMenuOpen(false)}
              >
                Try Premium
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
