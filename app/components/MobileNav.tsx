"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabaseSession } from "./SupabaseSessionProvider";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const session = useSupabaseSession();
  const isLoggedIn = !!session?.user;

  const navItems = [
    { href: "/", label: "Home", auth: false },
    { href: "/about", label: "About", auth: false },
    { href: "/blog", label: "Blog", auth: false },

    // Auth-only
    { href: "/dashboard", label: "Dashboard", auth: true },
    { href: "/journal", label: "Journal", auth: true },
    { href: "/insights", label: "Insights", auth: true },
    { href: "/tools", label: "Tools", auth: true },
  ];

  const visibleItems = navItems.filter(
    (item) => !item.auth || (item.auth && isLoggedIn)
  );

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200
      ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      <div
        className={`absolute right-0 top-0 h-full w-64 bg-slate-900 border-l border-slate-800 p-6 transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="flex flex-col gap-4 mt-4">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`px-3 py-2 rounded-md text-sm font-medium
                ${
                  pathname === item.href ? "text-emerald-400" : "text-slate-300"
                } hover:text-white`}
            >
              {item.label}
            </Link>
          ))}

          {/* Auth section */}
          {!isLoggedIn ? (
            <Link
              href="/magic-login"
              onClick={onClose}
              className="px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white"
            >
              Sign in
            </Link>
          ) : (
            <Link
              href="/logout"
              onClick={onClose}
              className="px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white"
            >
              Log out
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
