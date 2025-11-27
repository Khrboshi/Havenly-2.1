"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const supabase = supabaseClient;

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("free");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;

      setUser(sessionUser);
      setRole(sessionUser?.user_metadata?.role ?? "free");
    }
    loadSession();
  }, [supabase]);

  const isPremiumUser = role === "premium";
  const isLoggedIn = !!user;

  /* NAVIGATION CONFIG */
  const PUBLIC_LINKS = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  const FREE_LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/tools", label: "Tools" },
    { href: "/insights", label: "Insights (Coming Soon)", comingSoon: true },
    { href: "/settings", label: "Settings (Coming Soon)", comingSoon: true },
  ];

  const PREMIUM_LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/tools", label: "Tools+" },
    { href: "/insights", label: "Insights (Coming Soon)", comingSoon: true },
    { href: "/settings", label: "Settings (Coming Soon)", comingSoon: true },
  ];

  function lockedLink(link) {
    return (
      <Link
        key={link.href}
        href="/premium"
        className="text-slate-400 hover:text-emerald-300 transition"
      >
        {link.label}
      </Link>
    );
  }

  function activeLink(link) {
    const isActive = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`${
          isActive ? "text-emerald-300" : "text-slate-300"
        } hover:text-emerald-300 transition`}
      >
        {link.label}
      </Link>
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/magic-login?logged_out=1";
  }

  const LINKS_TO_RENDER = isLoggedIn
    ? isPremiumUser
      ? PREMIUM_LINKS
      : FREE_LINKS
    : PUBLIC_LINKS;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-emerald-300">
          Havenly
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          {LINKS_TO_RENDER.map((link) =>
            link.comingSoon
              ? lockedLink(link)
              : activeLink(link)
          )}

          {/* UPGRADE */}
          {isLoggedIn && role === "free" && (
            <Link
              href="/premium"
              className="rounded-full bg-emerald-400 text-slate-900 px-4 py-1.5 text-sm font-semibold hover:bg-emerald-300 transition"
            >
              Upgrade
            </Link>
          )}

          {/* AUTH BUTTONS */}
          {!isLoggedIn && (
            <Link
              href="/magic-login"
              className="border border-slate-700 text-slate-300 px-4 py-1.5 rounded-full hover:border-emerald-300 hover:text-emerald-300 transition"
            >
              Magic Login
            </Link>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition ml-3"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-300"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 space-y-4 bg-slate-950 border-t border-slate-800">
          {LINKS_TO_RENDER.map((link) =>
            link.comingSoon
              ? lockedLink(link)
              : activeLink(link)
          )}

          {isLoggedIn && role === "free" && (
            <Link
              href="/premium"
              className="block rounded-full bg-emerald-400 text-slate-900 px-4 py-1.5 text-sm font-semibold text-center hover:bg-emerald-300 transition"
            >
              Upgrade
            </Link>
          )}

          {!isLoggedIn && (
            <Link
              href="/magic-login"
              className="block border border-slate-700 text-slate-300 px-4 py-1.5 rounded-full text-center hover:border-emerald-300 hover:text-emerald-300 transition"
            >
              Magic Login
            </Link>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="block text-left text-slate-400 hover:text-red-400 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
