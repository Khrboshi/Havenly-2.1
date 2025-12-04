"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabase } from "./SupabaseSessionProvider";
import LogoutButton from "./auth/LogoutButton";
import { useState, useRef, useEffect } from "react";

/**
 * Navigation links visible to all users.
 */
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/journal", label: "Journal" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/tools", label: "Tools" },
];

/**
 * The SiteHeader accepts `accountStatus` from Navbar.
 * This prevents duplication and keeps all plan/credit logic in one place.
 */
export default function SiteHeader({
  accountStatus,
}: {
  accountStatus?: string;
}) {
  const pathname = usePathname();
  const { session } = useSupabase();

  // Avatar dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userInitial = session?.user?.email?.[0]?.toUpperCase() ?? "☺";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Highlight active link
  function isActive(href: string) {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

      {/* LEFT SIDE — LOGO + NAVIGATION */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
        >
          Havenly
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                isActive(link.href)
                  ? "text-white border-b-2 border-emerald-400 pb-1"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* RIGHT SIDE — ACCOUNT STATUS + AVATAR DROPDOWN */}
      <div className="flex items-center gap-4">

        {/* Account status text (from Navbar) */}
        {accountStatus && (
          <span className="hidden sm:inline text-xs text-white/70">
            {accountStatus}
          </span>
        )}

        {/* Premium upgrade button */}
        <Link
          href="/upgrade"
          className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Upgrade
        </Link>

        {/* Avatar dropdown (only if signed in) */}
        {session && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition"
            >
              {userInitial}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-slate-900 shadow-xl py-2 z-50">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-white/80 hover:bg-slate-800"
                >
                  Dashboard
                </Link>

                <Link
                  href="/insights"
                  className="block px-4 py-2 text-sm text-white/80 hover:bg-slate-800"
                >
                  Insights
                </Link>

                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-white/80 hover:bg-slate-800"
                >
                  Settings
                </Link>

                <div className="border-t border-white/10 my-2" />

                <div className="px-4 py-2">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
