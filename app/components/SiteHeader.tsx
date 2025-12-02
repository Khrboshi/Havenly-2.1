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

  const planLabel = plan ?? "free";

  // Active-state logic with perfect accuracy
  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LEFT SIDE — Logo + Pages */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            Havenly
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}

                {isActive(link.href) && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-emerald-400"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT SIDE — Plan + Credits + Upgrade + Logout */}
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/80">
            {planLabel}
          </span>

          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/80">
            Credits: {credits ?? 0}
          </span>

          <Link
            href="/upgrade"
            className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Upgrade
          </Link>

          {/* Logout only when authenticated */}
          {session && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}
