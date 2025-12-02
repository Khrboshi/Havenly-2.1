"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./auth/LogoutButton";
import { useUserPlan } from "./useUserPlan";

export default function SiteHeader() {
  const pathname = usePathname();
  const { plan, credits } = useUserPlan();

  const isProtected =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/journal") ||
    pathname?.startsWith("/insights") ||
    pathname?.startsWith("/tools") ||
    pathname === "/settings" ||
    pathname === "/settings/billing";

  return (
    <header className="w-full border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="font-semibold text-lg text-white">
          Havenly
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link className="hover:text-white transition" href="/journal">
            Journal
          </Link>
          <Link className="hover:text-white transition" href="/blog">
            Blog
          </Link>
          <Link className="hover:text-white transition" href="/about">
            About
          </Link>
          <Link className="hover:text-white transition" href="/tools">
            Tools
          </Link>

          {/* Plan badge */}
          <span className="ml-3 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
            {plan ? `${plan} plan` : "Free plan"}
          </span>

          {/* Credits */}
          <span className="text-xs text-gray-300">
            Credits: {credits ?? 0}
          </span>

          {/* Upgrade */}
          <Link
            href="/upgrade"
            className="ml-2 rounded-full bg-emerald-500 px-3 py-1 text-xs text-black hover:bg-emerald-400 transition"
          >
            Upgrade
          </Link>

          {/* Logout only in protected areas */}
          {isProtected && <LogoutButton />}
        </nav>

        {/* Mobile badge */}
        <div className="md:hidden flex items-center gap-3">
          <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white">
            {plan ? `${plan} plan` : "Free"}
          </span>
        </div>
      </div>
    </header>
  );
}
