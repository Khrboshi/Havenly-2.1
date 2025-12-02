"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./auth/LogoutButton";
import { useSupabase } from "./SupabaseSessionProvider";
import { useUserPlan } from "./useUserPlan";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/journal", label: "Journal" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/tools", label: "Tools" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { session } = useSupabase();
  const { plan, credits } = useUserPlan();

  const isLoggedIn = !!session;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b1529]/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold">
          Havenly
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">

          {/* Show plan + credits only for logged-in users */}
          {isLoggedIn && (
            <>
              <span className="text-xs text-white/70 px-2 py-1 rounded-md bg-white/10">
                {plan || "free plan"}
              </span>

              <span className="text-xs text-white/70 px-2 py-1 rounded-md bg-white/10">
                Credits: {credits ?? 0}
              </span>
            </>
          )}

          {/* Upgrade button only if logged in and not premium */}
          {isLoggedIn && plan !== "premium" && (
            <Link
              href="/upgrade"
              className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
            >
              Upgrade
            </Link>
          )}

          {/* Logout only when logged in */}
          {isLoggedIn && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}
