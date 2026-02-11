"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSupabase } from "@/components/SupabaseSessionProvider";

type NavLink = { href: string; label: string };

export default function Navbar() {
  const pathname = usePathname();
  const { session, supabase } = useSupabase();

  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!session;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const publicLinks: NavLink[] = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/magic-login", label: "Log in" },
    ],
    []
  );

  const authLinks: NavLink[] = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/journal", label: "Journal" },
      { href: "/tools", label: "Tools" },
      { href: "/insights", label: "Insights" },
    ],
    []
  );

  const links = isLoggedIn ? authLinks : publicLinks;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      await fetch("/logout", { method: "GET" });
      window.location.href = "/magic-login?logged_out=1";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/magic-login";
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020617]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="relative h-7 w-7 overflow-hidden rounded-md">
            <Image
              src="/icon.svg"
              alt="Havenly"
              fill
              sizes="28px"
              priority
            />
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            Havenly
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                "text-sm font-medium transition-colors",
                isActive(l.href) ? "text-emerald-400" : "text-slate-300 hover:text-emerald-300",
              ].join(" ")}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}

          {!isLoggedIn ? (
            <Link
              href="/magic-login"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Start free journal
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-md p-2 text-slate-200 hover:bg-white/5"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#020617] px-4 pb-4 pt-2">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  isActive(l.href)
                    ? "bg-white/5 text-emerald-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-emerald-300",
                ].join(" ")}
              >
                {l.label}
              </Link>
            ))}

            {!isLoggedIn ? (
              <Link
                href="/magic-login"
                className="mt-2 rounded-lg bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Start free journal
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="mt-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/15"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
