"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";

interface NavbarProps {
  user: User | null;
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "text-sm transition-colors",
        active ? "text-emerald-300" : "text-slate-300 hover:text-emerald-200",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const loggedIn = !!user;
  const meta = (user?.user_metadata ?? {}) as { role?: string };
  const role = meta.role ?? "free";
  const isPremium = role === "premium";

  const onDashboard = pathname.startsWith("/dashboard");
  const onJournal = pathname.startsWith("/journal");
  const onPremium = pathname.startsWith("/premium");

  // Detect landing page to avoid duplicate primary CTA
  const isLanding = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-900/70 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Left: brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/90 text-slate-950 text-sm font-semibold">
              H
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-100">
              Havenly
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {loggedIn ? (
            <>
              <NavItem href="/dashboard" label="Dashboard" active={onDashboard} />
              <NavItem href="/journal" label="Journal" active={onJournal} />
              <Link
                href="/premium"
                className={[
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  onPremium
                    ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-200 hover:border-emerald-400/70 hover:text-emerald-200",
                ].join(" ")}
              >
                <span>Premium</span>
                {isPremium ? (
                  <span className="rounded-full bg-emerald-400/20 px-2 py-[1px] text-[10px] text-emerald-200">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-800 px-2 py-[1px] text-[10px] text-slate-300">
                    Coming soon
                  </span>
                )}
              </Link>

              {/* User menu (simple version for now) */}
              <div className="ml-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/90 text-[11px] font-semibold text-slate-950">
                  {user?.email?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="max-w-[170px] truncate">{user?.email}</span>
                <Link
                  href="/logout"
                  className="ml-1 border-l border-slate-700 pl-2 text-[11px] text-slate-300 hover:text-emerald-200"
                >
                  Log out
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-slate-300 hover:text-emerald-200"
              >
                Log in
              </Link>

              {/* Only show Get started when NOT on the landing page */}
              {!isLanding && (
                <Link
                  href="/magic-login"
                  className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-200"
                >
                  Get started
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-200 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-slate-900 bg-slate-950/95 px-4 pb-4 pt-2 md:hidden">
          {loggedIn ? (
            <div className="space-y-3 text-sm">
              <NavItem href="/dashboard" label="Dashboard" active={onDashboard} />
              <NavItem href="/journal" label="Journal" active={onJournal} />
              <Link
                href="/premium"
                className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs text-slate-200"
              >
                <span>Premium</span>
                {isPremium ? (
                  <span className="rounded-full bg-emerald-400/20 px-2 py-[1px] text-[10px] text-emerald-200">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-800 px-2 py-[1px] text-[10px] text-slate-300">
                    Coming soon
                  </span>
                )}
              </Link>
              <div className="pt-1 text-xs text-slate-400">
                <div className="mb-1 truncate">{user?.email}</div>
                <Link href="/logout" className="text-emerald-300">
                  Log out
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <Link
                href="/login"
                className="block text-slate-200 hover:text-emerald-200"
              >
                Log in
              </Link>

              {/* Same logic on mobile: hide Get started on landing */}
              {!isLanding && (
                <Link
                  href="/magic-login"
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-300 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-200"
                >
                  Get started
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
