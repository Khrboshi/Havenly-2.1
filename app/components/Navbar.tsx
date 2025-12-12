"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSupabase } from "@/components/SupabaseSessionProvider";
import LogoutButton from "./auth/LogoutButton";

export default function Navbar() {
  const pathname = usePathname();
  const { session } = useSupabase();
  const [open, setOpen] = useState(false);

  const isLoggedIn = !!session;

  /** Logged-out navigation (public pages only) */
  const linksLoggedOut = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  /** Logged-in navigation (app section only) */
  const linksLoggedIn = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/tools", label: "Tools" },
    { href: "/insights", label: "Insights" },
  ];

  const isActive = (href: string) => pathname === href;

  /** Prevent background scroll when mobile drawer is open */
  useEffect(() => {
    if (open) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [open]);

  const navLinks = isLoggedIn ? linksLoggedIn : linksLoggedOut;

  return (
    <>
      {/* ==============================
          TOP NAVBAR (DESKTOP & MOBILE)
         ============================== */}
      <header className="relative z-50 w-full border-b border-hvn-subtle bg-hvn-bg/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-hvn-text-primary"
          >
            Havenly
          </Link>

          {/* -------- DESKTOP NAV -------- */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  nav-link rounded-md px-3 py-1.5 text-sm font-medium
                  ${
                    isActive(item.href)
                      ? "nav-link-active"
                      : "text-hvn-text-secondary"
                  }
                `}
              >
                {item.label}
              </Link>
            ))}

            {/* Right-side actions when LOGGED OUT */}
            {!isLoggedIn && (
              <div className="ml-3 flex items-center gap-3">
                <Link
                  href="/magic-login"
                  className="nav-link rounded-md px-3 py-1.5 text-sm font-medium text-hvn-text-secondary"
                >
                  Log in
                </Link>

                <Link
                  href="/magic-login"
                  className="rounded-md bg-hvn-accent-mint px-4 py-1.5 text-sm font-semibold text-hvn-bg transition hover:bg-hvn-accent-mint/90"
                >
                  Start free journal
                </Link>
              </div>
            )}

            {/* Right-side action when LOGGED IN */}
            {isLoggedIn && <LogoutButton />}
          </nav>

          {/* -------- MOBILE HAMBURGER -------- */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden text-hvn-text-secondary transition hover:text-hvn-accent-mint"
            aria-label="Open navigation menu"
            aria-expanded={open}
          >
            <svg
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h20M3 13h20M3 20h20" />
            </svg>
          </button>
        </div>
      </header>

      {/* ===========================================
          MOBILE MENU DRAWER (LOGGED OUT / LOGGED IN)
         =========================================== */}
      {open && (
        <div className="animate-fadeIn fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm md:hidden">
          <div className="animate-slideDown absolute left-0 top-0 flex h-full w-72 flex-col border-r border-hvn-subtle bg-hvn-bg-elevated shadow-2xl">
            {/* Drawer header */}
            <div className="flex h-16 items-center justify-between border-b border-hvn-subtle px-5">
              <span className="text-lg font-semibold text-hvn-text-primary">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-hvn-text-secondary transition hover:text-hvn-accent-mint"
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    nav-link block w-full rounded-md px-3 py-3 text-sm font-medium
                    ${
                      isActive(item.href)
                        ? "nav-link-active"
                        : "text-hvn-text-secondary"
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}

              {/* CTA buttons when LOGGED OUT */}
              {!isLoggedIn && (
                <>
                  <Link
                    href="/magic-login"
                    onClick={() => setOpen(false)}
                    className="mt-3 block rounded-md bg-hvn-accent-mint px-4 py-3 text-center text-sm font-semibold text-hvn-bg hover:bg-hvn-accent-mint/90"
                  >
                    Start free journal
                  </Link>

                  <Link
                    href="/magic-login"
                    onClick={() => setOpen(false)}
                    className="mt-2 block rounded-md px-4 py-3 text-center text-sm font-medium text-hvn-text-secondary nav-link"
                  >
                    Log in
                  </Link>
                </>
              )}

              {/* Logout when LOGGED IN */}
              {isLoggedIn && (
                <LogoutButton
                  onDone={() => setOpen(false)}
                  className="mt-3 block w-full rounded-md px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-red-400/10"
                />
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
