"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSupabase } from "@/components/SupabaseSessionProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { session } = useSupabase();
  const [open, setOpen] = useState(false);

  const isLoggedIn = !!session;

  /** Logged-out navigation (public pages) */
  const linksLoggedOut = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  /** Logged-in navigation (app section) */
  const linksLoggedIn = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/tools", label: "Tools" },
    { href: "/insights", label: "Insights" },
  ];

  const isActive = (href: string) => pathname === href;

  /** Prevent background scroll when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      {/* ==============================
           TOP NAVBAR (DESKTOP + MOBILE)
         ============================== */}
      <header className="w-full border-b border-hvn-subtle bg-hvn-bg/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md relative z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Brand */}
          <Link href="/" className="text-lg font-semibold tracking-tight text-hvn-text-primary">
            Havenly
          </Link>

          {/* ---------------- DESKTOP NAV ---------------- */}
          <nav className="hidden md:flex items-center gap-6">

            {(isLoggedIn ? linksLoggedIn : linksLoggedOut).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  nav-link px-3 py-1.5 text-sm font-medium rounded-md
                  ${isActive(item.href) ? "nav-link-active" : "text-hvn-text-secondary"}
                `}
              >
                {item.label}
              </Link>
            ))}

            {/* Right side actions (logged out) */}
            {!isLoggedIn && (
              <div className="flex items-center gap-3 ml-3">
                <Link
                  href="/magic-login"
                  className="nav-link text-sm px-3 py-1.5 font-medium rounded-md text-hvn-text-secondary"
                >
                  Log in
                </Link>

                <Link
                  href="/magic-login"
                  className="rounded-md bg-hvn-accent-mint px-4 py-1.5 text-sm font-semibold text-hvn-bg hover:bg-hvn-accent-mint/90 transition"
                >
                  Start free journal
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <Link
                href="/logout"
                className="nav-link text-sm px-3 py-1.5 text-red-400 hover:bg-red-400/10 rounded-md"
              >
                Logout
              </Link>
            )}
          </nav>

          {/* ---------------- MOBILE HAMBURGER ---------------- */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-hvn-text-secondary hover:text-hvn-accent-mint transition"
          >
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h20M3 13h20M3 20h20" />
            </svg>
          </button>
        </div>
      </header>

      {/* ===========================================
           MOBILE MENU DRAWER — FULL HEIGHT FIXED
         =========================================== */}
      {open && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm md:hidden animate-fadeIn">
          {/* Drawer panel */}
          <div className="absolute left-0 top-0 h-full w-72 bg-hvn-bg-elevated border-r border-hvn-subtle shadow-2xl animate-slideDown flex flex-col">

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-hvn-subtle">
              <span className="text-lg font-semibold text-hvn-text-primary">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="text-hvn-text-secondary hover:text-hvn-accent-mint transition"
              >
                ✕
              </button>
            </div>

            {/* Scrollable navigation area */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">

              {(isLoggedIn ? linksLoggedIn : linksLoggedOut).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    block w-full rounded-md px-3 py-3 text-sm font-medium nav-link
                    ${isActive(item.href) ? "nav-link-active" : "text-hvn-text-secondary"}
                  `}
                >
                  {item.label}
                </Link>
              ))}

              {/* CTA Buttons */}
              {!isLoggedIn && (
                <>
                  <Link
                    href="/magic-login"
                    onClick={() => setOpen(false)}
                    className="block rounded-md bg-hvn-accent-mint px-4 py-3 mt-2 text-center text-sm font-semibold text-hvn-bg"
                  >
                    Start Free Journal
                  </Link>

                  <Link
                    href="/magic-login"
                    onClick={() => setOpen(false)}
                    className="block rounded-md nav-link px-4 py-3 text-center text-sm font-medium text-hvn-text-secondary"
                  >
                    Log in
                  </Link>
                </>
              )}

              {isLoggedIn && (
                <Link
                  href="/logout"
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10"
                >
                  Logout
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
