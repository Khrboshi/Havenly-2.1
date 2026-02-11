"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSupabase } from "@/components/SupabaseSessionProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { session, supabase } = useSupabase();

  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!session;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const linkBase =
    "text-sm font-medium transition-colors hover:text-emerald-400";
  const activeLink = "text-emerald-400";
  const inactiveLink = "text-slate-300";

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/magic-login", label: "Log in" },
  ];

  const authLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/tools", label: "Tools" },
    { href: "/insights", label: "Insights" },
  ];

  async function handleLogout() {
    try {
      // 1️⃣ Immediately clear client-side Supabase session
      await supabase.auth.signOut();

      // 2️⃣ Clear server cookies
      await fetch("/logout", { method: "GET" });

      // 3️⃣ Hard reset navigation state
      window.location.href = "/magic-login?logged_out=1";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/magic-login";
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020617]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* ✅ Brand: Logo + Text (keeps all existing logic) */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon.svg"
            alt="Havenly"
            width={26}
            height={26}
            priority
            className="rounded-md"
          />
          <span className="text-lg font-semibold text-white">Havenly</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {(isLoggedIn ? authLinks : publicLinks).map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${linkBase} ${isActive ? activeLink : inactiveLink}`}
              >
                {link.label}
              </Link>
            );
          })}

          {!isLoggedIn ? (
            <Link
              href="/magic-login"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400"
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
          className="md:hidden text-slate-200"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#020617] px-4 pb-4 pt-2">
          <div className="flex flex-col gap-4">
            {(isLoggedIn ? authLinks : publicLinks).map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-2 py-2 text-base ${
                    isActive ? "bg-white/5 text-emerald-400" : "text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {!isLoggedIn ? (
              <Link
                href="/magic-login"
                className="mt-2 rounded-md bg-emerald-500 px-4 py-3 text-center text-sm font-medium text-black"
              >
                Start free journal
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="mt-2 rounded-md bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400"
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
