"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabase } from "./SupabaseSessionProvider";
import LogoutButton from "./auth/LogoutButton";
import { useState, useRef, useEffect } from "react";

export default function SiteHeader() {
  const pathname = usePathname();
  const { session } = useSupabase();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Navigation items
  const NAV_LINKS = [
    { href: "/", label: "Home" },
    ...(session
      ? [
          { href: "/journal", label: "Journal" },
          { href: "/tools", label: "Tools" },
        ]
      : []),
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function isActive(href: string) {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const userInitial = session?.user?.email?.charAt(0)?.toUpperCase() ?? "☺";

  return (
    <header className="w-full h-16 flex items-center border-b border-white/5 bg-slate-950/80 backdrop-blur z-40">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LEFT — Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            Havenly
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition ${
                  isActive(l.href)
                    ? "text-white border-b-2 border-emerald-400 pb-1"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT — Upgrade + Avatar Menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/upgrade"
            className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Upgrade
          </Link>

          {session && (
            <div className="relative" ref={menuRef}>
              {/* Avatar Button */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition"
              >
                {userInitial}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div
                  className="
                    absolute right-0 mt-3 
                    w-48 rounded-xl border border-white/10 bg-slate-900 shadow-2xl 
                    animate-dropdown py-2 z-50
                  "
                >
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-white/90 hover:bg-slate-800 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/insights"
                    className="block px-4 py-2 text-sm text-white/90 hover:bg-slate-800 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Insights
                  </Link>

                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-white/90 hover:bg-slate-800 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>

                  <div className="border-t border-white/10 my-2" />

                  <div className="px-4 py-1">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
