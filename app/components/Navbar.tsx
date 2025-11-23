// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";

type NavbarProps = {
  user: User | null;
};

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthed = !!user;

  const displayName =
    (user?.user_metadata as any)?.full_name ||
    user?.email ||
    "";

  const initials =
    displayName?.trim()?.charAt(0)?.toUpperCase() || "H";

  const go = (href: string) => {
    setMobileOpen(false);
    router.push(href);
  };

  const mainLinks = isAuthed
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/journal", label: "Journal" },
        { href: "/settings", label: "Settings" },
      ]
    : [];

  const linkClass = (href: string) =>
    `text-sm ${
      pathname === href ? "text-emerald-300" : "text-slate-300"
    } hover:text-white transition`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* LEFT: Logo */}
        <button
          type="button"
          onClick={() => go("/")}
          className="flex items-center gap-2 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-slate-950 group-hover:opacity-80 transition-opacity">
            {initials}
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-100 group-hover:text-emerald-300 transition-colors">
            Havenly
          </span>
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 md:flex">
          {mainLinks.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => go(link.href)}
              className={linkClass(link.href)}
            >
              {link.label}
            </button>
          ))}

          {isAuthed && (
            <button
              type="button"
              onClick={() => go("/logout")}
              className="text-sm text-slate-300 hover:text-emerald-300 transition"
            >
              Logout
            </button>
          )}

          {!isAuthed && (
            <div className="flex items-center gap-3">
              <Link href="/login" className={linkClass("/login")}>
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-slate-950 hover:bg-emerald-400"
              >
                Get started
              </Link>
            </div>
          )}
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-700 p-1.5 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-[3px]">
            <span className="block h-[2px] w-4 bg-slate-300" />
            <span className="block h-[2px] w-4 bg-slate-300" />
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3">
            {isAuthed && (
              <>
                {mainLinks.map((link) => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => go(link.href)}
                    className={linkClass(link.href)}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => go("/logout")}
                  className="mt-1 text-left text-sm text-slate-300 hover:text-emerald-300"
                >
                  Logout
                </button>
              </>
            )}

            {!isAuthed && (
              <>
                <button
                  type="button"
                  onClick={() => go("/login")}
                  className={linkClass("/login")}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => go("/signup")}
                  className="mt-1 w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400"
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
