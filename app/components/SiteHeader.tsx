"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientNavWrapper from "./ClientNavWrapper";
import LogoutButton from "./auth/LogoutButton";

export default function SiteHeader() {
  const pathname = usePathname();

  // Hide the navbar on auth pages
  const hideOnAuth =
    pathname.startsWith("/magic-login") ||
    pathname.startsWith("/auth");

  if (hideOnAuth) return null;

  const navItems = [
    { href: "/journal", label: "Journal" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/tools", label: "Tools" },
  ];

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/journal") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/insights");

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      {/* LEFT SIDE */}
      <Link href="/" className="text-xl font-semibold text-white">
        Havenly
      </Link>

      {/* NAV LINKS */}
      <nav className="hidden md:flex items-center gap-6 text-slate-300">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hover:text-white transition ${
              pathname.startsWith(item.href) ? "text-white font-medium" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* Plan badge + Credits */}
        <ClientNavWrapper />

        {/* Show Logout only for logged-in sections */}
        {isProtected && <LogoutButton />}
      </div>
    </div>
  );
}
