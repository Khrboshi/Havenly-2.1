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
  const { plan } = useUserPlan();

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-transparent">
      {/* Left: Logo */}
      <Link href="/" className="text-xl font-semibold text-white">
        Havenly
      </Link>

      {/* Middle: Navigation */}
      <nav className="hidden md:flex gap-6">
        {NAV_LINKS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`transition ${
                isActive ? "text-white font-semibold" : "text-gray-300"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right side: Plan + Credits + Login / Logout */}
      <div className="flex items-center gap-4">
        {/* Show plan badge only when logged in */}
        {session ? (
          <>
            <span className="px-3 py-1 text-sm bg-gray-800 text-gray-200 rounded-lg">
              {plan ?? "free plan"}
            </span>

            <LogoutButton />
          </>
        ) : (
          <Link
            href="/magic-login"
            className="text-gray-200 hover:text-white transition"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
