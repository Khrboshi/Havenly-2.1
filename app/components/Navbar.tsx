"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSupabase } from "./SupabaseSessionProvider";

type NavLink = {
  href: string;
  label: string;
};

const LOGGED_OUT_PRIMARY: NavLink[] = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const LOGGED_IN_PRIMARY: NavLink[] = [
  { href: "/journal", label: "Journal" },
  { href: "/tools", label: "Tools" },
  { href: "/insights", label: "Insights" },
  { href: "/upgrade", label: "Upgrade" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!session?.user;

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      // Best-effort cookie refresh so middleware stays in sync
      try {
        await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
      } catch {
        // non-blocking
      }
    } finally {
      // Send user back to landing page after logout
      router.push("/");
      setMobileOpen(false);
    }
  }

  const desktopLinks = isLoggedIn ? LOGGED_IN_PRIMARY : LOGGED_OUT_PRIMARY;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-900/80 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        {/* LEFT: Brand + plan pill */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-50"
          >
            <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-400">
              Havenly
            </span>
          </Link>

          {/* Plan pill – only when logged in */}
          {isLoggedIn && (
            <div className="hidden items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-medium text-slate-100">Free</span>
              <span className="text-slate-400">· 0 / 20</span>
            </div>
          )}
        </div>

        {/* DESKTOP NAV (>= md) */}
        <nav className="hidden items-center gap-5 text-xs text-slate-300 md:flex">
          {desktopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-slate-50 ${
                pathname === link.href ? "text-slate-50" : "text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Right-side auth / CTA area */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/magic-login"
                className={`text-xs transition-colors hover:text-slate-50 ${
                  pathname === "/magic-login"
                    ? "text-slate-50"
                    : "text-slate-300"
                }`}
              >
                Log in
              </Link>
              <Link
                href="/magic-login"
                className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm hover:bg-emerald-400"
              >
                Start free journal
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-900"
            >
              Logout
            </button>
          )}
        </nav>

        {/* MOBILE: hamburger button ( < md ) */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-slate-700 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-900 md:hidden"
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="flex flex-col gap-0.5">
            <span className="h-0.5 w-4 rounded bg-slate-200" />
            <span className="h-0.5 w-4 rounded bg-slate-200" />
          </div>
        </button>
      </div>

      {/* MOBILE MENU (full width, slide-down) */}
      {mobileOpen && (
        <div className="border-t border-slate-900/80 bg-slate-950/98 md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3 text-sm text-slate-100">
            <div className="flex flex-col gap-2">
              {/* When logged out */}
              {!isLoggedIn && (
                <>
                  <MobileItem
                    href="/"
                    label="Home"
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />
                  <MobileItem
                    href="/about"
                    label="About"
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />
                  <MobileItem
                    href="/blog"
                    label="Blog"
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />

                  <div className="mt-1 h-px bg-slate-800" />

                  <MobileItem
                    href="/magic-login"
                    label="Log in"
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/magic-login");
                    }}
                    className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                  >
                    Start free journal
                  </button>
                </>
              )}

              {/* When logged in */}
              {isLoggedIn && (
                <>
                  <MobileItem
                    href="/dashboard"
                    label="Dashboard"
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />
                  <MobileItem
                    href="/journal"
                    label="Journal"
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />
                  <MobileItem
                    href="/tools"
                    label="Tools"
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />
                  <MobileItem
                    href="/insights"
                    label="Insights"
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />
                  <MobileItem
                    href="/settings"
                    label="Settings"
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />

                  <div className="mt-1 h-px bg-slate-800" />

                  <MobileItem
                    href="/upgrade"
                    label="Upgrade"
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-900"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

type MobileItemProps = {
  href: string;
  label: string;
  pathname: string | null;
  onClick: () => void;
};

function MobileItem({ href, label, pathname, onClick }: MobileItemProps) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-xs ${
        isActive
          ? "bg-slate-900 text-slate-50"
          : "text-slate-300 hover:bg-slate-900/70 hover:text-slate-50"
      }`}
    >
      <span>{label}</span>
    </Link>
  );
}
