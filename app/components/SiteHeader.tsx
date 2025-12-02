"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./auth/LogoutButton";
import { useSession } from "./SupabaseSessionProvider";   // ✅ CORRECT IMPORT
import { useUserPlan } from "./useUserPlan";

const NAV_LINKS = [
  { href: "/journal", label: "Journal" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/tools", label: "Tools" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  // ✅ REAL login state from Supabase
  const { session, loading } = useSession();
  const isLoggedIn = !!session;

  // Plan & credits from your hook
  const planInfo = useUserPlan() as any;
  const planLabel =
    planInfo?.planLabel ??
    (planInfo?.plan ? `${String(planInfo.plan)} plan` : "free plan");
  const credits =
    typeof planInfo?.credits === "number" ? planInfo.credits : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo / brand */}
        <Link href="/" className="text-base font-semibold text-white">
          Havenly
        </Link>

        {/* Main navigation */}
        <nav className="ml-8 flex items-center gap-6 text-sm">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white/90"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3 text-xs sm:text-sm">
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            {planLabel}
          </span>

          <span className="hidden sm:inline text-white/60">
            Credits: {credits}
          </span>

          {/* Show Log out only when actually logged in */}
          {!loading && isLoggedIn && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}
