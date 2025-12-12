"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  async function handleLogout() {
    try {
      await fetch("/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      router.replace("/magic-login?logged_out=1");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  const navLinks = isLoggedIn ? linksLoggedIn : linksLoggedOut;

  return (
    <>
      <header className="relative z-50 w-full border-b border-hvn-subtle bg-hvn-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold">
            Havenly
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm ${
                  isActive(item.href)
                    ? "text-hvn-accent-mint"
                    : "text-hvn-text-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {!isLoggedIn && (
              <>
                <Link href="/magic-login">Log in</Link>
                <Link
                  href="/magic-login"
                  className="rounded bg-hvn-accent-mint px-4 py-1.5 text-sm font-semibold text-hvn-bg"
                >
                  Start free journal
                </Link>
              </>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="rounded px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-400/10"
              >
                Logout
              </button>
            )}
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[999] bg-black/50 md:hidden">
          <div className="absolute left-0 top-0 h-full w-72 bg-hvn-bg p-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3"
              >
                {item.label}
              </Link>
            ))}

            {!isLoggedIn && (
              <Link href="/magic-login" onClick={() => setOpen(false)}>
                Log in
              </Link>
            )}

            {isLoggedIn && (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="mt-4 text-red-400"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
