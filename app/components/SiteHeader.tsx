// app/components/SiteHeader.tsx
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

  const NAV_LINKS = [
    { href: "/", label: "Home" },
    ...(session
      ? [
          { href: "/journal", label: "Journal" },
          { href: "/tools", label: "Tools" },
        ]
      : []),
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

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
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* LEFT — Logo + Nav */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
        >
          Havenly
        </Link>

        <nav className="hidden md:flex items-center gap-4 sm:gap-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition ${
                isActive(l.href)
                  ? "text-white border-b-2 border-hvn-accent-mint pb-1"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* RIGHT — Upgrade + Avatar */}
      <div className="flex items-center gap-3">
        <Link
          href="/upgrade"
          className="rounded-full bg-hvn-accent-mint px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition"
        >
          Upgrade
        </Link>

        {session && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(148,163,184,0.35)] hover:bg-white/20 transition"
            >
              {userInitial}
            </button>

            {menuOpen && (
              <div className="animate-dropdown absolute right-0 mt-2 w-52 rounded-2xl border border-hvn-border-subtle bg-hvn-bg-elevated/95 py-2 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-sm z-[60]">
                {/* User info */}
                <div className="border-b border-hvn-border-subtle/60 px-4 pb-3 pt-2">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-hvn-text-muted">
                    Signed in as
                  </p>
                  <p className="mt-1 truncate text-sm text-hvn-text-secondary">
                    {session.user?.email}
                  </p>
                </div>

                {/* Links */}
                <nav className="py-1 text-sm text-hvn-text-secondary">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-hvn-bg-soft/80 hover:text-hvn-text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/insights"
                    className="block px-4 py-2 hover:bg-hvn-bg-soft/80 hover:text-hvn-text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Insights
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-hvn-bg-soft/80 hover:text-hvn-text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </nav>

                <div className="mt-1 border-t border-hvn-border-subtle/60" />

                {/* Logout */}
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
