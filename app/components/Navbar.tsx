"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/browser-client";

type AuthState = "loading" | "authenticated" | "unauthenticated";

type NavLink = {
  href: string;
  label: string;
  protected?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard", protected: true },
  { href: "/journal", label: "Journal", protected: true },
  { href: "/tools", label: "Tools", protected: true },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings", protected: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const supabase = createClient();
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (data.user) {
        setUserEmail(data.user.email ?? null);
        setAuthState("authenticated");
      } else {
        setUserEmail(null);
        setAuthState("unauthenticated");
      }
    }

    loadUser();

    const {
      data: subscription,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUserEmail(session.user.email ?? null);
        setAuthState("authenticated");
      } else {
        setUserEmail(null);
        setAuthState("unauthenticated");
      }
    });

    return () => {
      isMounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, [supabase]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const filteredLinks = NAV_LINKS.filter((link) =>
    link.protected ? authState === "authenticated" : true
  );

  const linkBaseClass =
    "text-xs md:text-sm font-medium transition-colors hover:text-emerald-300";

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* Left: logo / brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 text-xs font-semibold text-emerald-300">
            H
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight md:text-base">
              Havenly 2.1
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Calm space to reflect
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {filteredLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${linkBaseClass} ${
                  isActive ? "text-emerald-300" : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side: auth / CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {authState === "loading" && (
            <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
          )}

          {authState === "authenticated" && (
            <>
              <span className="max-w-[180px] truncate text-xs text-slate-300">
                {userEmail}
              </span>
              <Link
                href="/logout"
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:border-emerald-400/60 hover:bg-slate-900/80 hover:text-emerald-200"
              >
                Log out
              </Link>
            </>
          )}

          {authState === "unauthenticated" && (
            <>
              <Link
                href="/magic-login"
                className="text-xs font-medium text-slate-300 hover:text-emerald-300"
              >
                Sign in
              </Link>
              <Link
                href="/magic-login"
                className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm transition-colors hover:bg-emerald-300"
              >
                Start journaling free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-700 p-2 text-slate-200 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
          </div>
        </button>
      </div>

      {/* Mobile nav panel */}
      {menuOpen && (
        <div className="border-t border-slate-800/60 bg-slate-950/95 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            {filteredLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${linkBaseClass} ${
                    isActive ? "text-emerald-300" : "text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-2 flex flex-wrap items-center gap-3">
              {authState === "authenticated" && (
                <>
                  <span className="w-full truncate text-xs text-slate-300">
                    {userEmail}
                  </span>
                  <Link
                    href="/logout"
                    className="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-center text-xs font-medium text-slate-100 transition-colors hover:border-emerald-400/60 hover:bg-slate-900/80 hover:text-emerald-200"
                  >
                    Log out
                  </Link>
                </>
              )}

              {authState === "unauthenticated" && (
                <>
                  <Link
                    href="/magic-login"
                    className="w-full rounded-full bg-emerald-400 px-4 py-2 text-center text-xs font-semibold text-slate-950 shadow-sm transition-colors hover:bg-emerald-300"
                  >
                    Start journaling free
                  </Link>
                  <Link
                    href="/magic-login"
                    className="w-full text-center text-xs font-medium text-slate-300 hover:text-emerald-300"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
