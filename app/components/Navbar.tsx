"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseSessionProvider";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useSupabase();
  const [open, setOpen] = useState(false);

  const isLoggedIn = !!session;

  const linksLoggedOut = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  const linksLoggedIn = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/tools", label: "Tools" },
    { href: "/insights", label: "Insights" },
  ];

  const navLinks = isLoggedIn ? linksLoggedIn : linksLoggedOut;
  const isActive = (href: string) => pathname === href;

  /* Lock background scroll */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleLogout() {
    await fetch("/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });
    router.replace("/magic-login?logged_out=1");
    router.refresh();
  }

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-hvn-subtle bg-hvn-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Havenly
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium ${
                  isActive(item.href)
                    ? "nav-link-active"
                    : "text-hvn-text-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {!isLoggedIn && (
              <>
                <Link href="/magic-login" className="text-sm">
                  Log in
                </Link>
                <Link
                  href="/magic-login"
                  className="rounded-md bg-hvn-accent-mint px-4 py-1.5 text-sm font-semibold text-hvn-bg"
                >
                  Start free journal
                </Link>
              </>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-xl text-hvn-text-secondary"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      <div
        className={`fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* ================= MOBILE DRAWER ================= */}
      <aside
        className={`fixed left-0 top-0 z-[1000] h-full w-[80%] max-w-xs bg-hvn-bg-elevated shadow-xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-hvn-subtle px-4 py-4">
          <span className="text-lg font-semibold">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="text-xl text-hvn-text-secondary"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                isActive(item.href)
                  ? "nav-link-active"
                  : "text-hvn-text-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {!isLoggedIn && (
            <>
              <Link
                href="/magic-login"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-md px-3 py-2.5 text-sm text-center"
              >
                Log in
              </Link>

              <Link
                href="/magic-login"
                onClick={() => setOpen(false)}
                className="rounded-md bg-hvn-accent-mint px-3 py-2.5 text-center text-sm font-semibold text-hvn-bg"
              >
                Start free journal
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={async () => {
                setOpen(false);
                await handleLogout();
              }}
              className="mt-6 text-left text-sm font-medium text-red-400"
            >
              Logout
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}
