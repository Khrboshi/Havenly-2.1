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
      console.error("Logout failed:", err);
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

          {/* Desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? "nav-link-active" : ""}
              >
                {item.label}
              </Link>
            ))}

            {!isLoggedIn && (
              <>
                <Link href="/magic-login">Log in</Link>
                <Link
                  href="/magic-login"
                  className="rounded bg-hvn-accent-mint px-4 py-1.5"
                >
                  Start free journal
                </Link>
              </>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile */}
          <button onClick={() => setOpen(true)} className="md:hidden">
            ☰
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[999] bg-black/50 md:hidden">
          <div className="absolute left-0 top-0 h-full w-72 bg-hvn-bg-elevated">
            <nav className="p-4 space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
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
                  onClick={async () => {
                    setOpen(false);
                    await handleLogout();
                  }}
                  className="text-red-400"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
