"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSupabase } from "./SupabaseSessionProvider";
import { useUserPlan } from "./useUserPlan";
import MobileNav from "./MobileNav";
import LogoutButton from "./auth/LogoutButton";

export type NavItem = {
  href: string;
  label: string;
  authOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/dashboard", label: "Dashboard", authOnly: true },
  { href: "/journal", label: "Journal", authOnly: true },
  { href: "/insights", label: "Insights", authOnly: true },
  { href: "/tools", label: "Tools", authOnly: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { session } = useSupabase();
  const { planType } = useUserPlan();

  const [mobileOpen, setMobileOpen] = useState(false);

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

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.authOnly ? isLoggedIn : true
  );

  return (
    <>
      <header className="w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-400 text-xs font-bold text-slate-950 shadow-md">
                H
              </span>
              <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
                Havenly
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-xs font-medium text-slate-200 sm:flex sm:text-sm">
            {visibleItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    active
                      ? "text-emerald-300"
                      : "text-slate-300 hover:text-emerald-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: plan + auth */}
          <div className="flex items-center gap-3">
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

            {!isLoggedIn ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/magic-login"
                  className="rounded-full border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/upgrade"
                  className="rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
                >
                  Try Premium
                </Link>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-2 py-1.5 text-xs">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-100">
                    {initial}
                  </span>
                  <div className="flex flex-col">
                    <span className="max-w-[160px] truncate text-[11px] text-slate-100">
                      {email}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {planLabel} · Settings
                    </span>
                  </div>
                </div>

                <Link
                  href="/settings"
                  className="rounded-full border border-slate-600 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-900"
                >
                  Settings
                </Link>
                <LogoutButton />
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 sm:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
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
      </header>

      {/* Mobile navigation overlay */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={visibleItems}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
