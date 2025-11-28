"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  const nav = [
    { href: "/", label: "Home" },
    { href: "/journal", label: "Journal" },
    { href: "/blog", label: "Blog" },    // RESTORED
    { href: "/about", label: "About" },
    { href: "/tools", label: "Tools" },
  ];

  return (
    <header className="w-full border-b border-hvn-card bg-hvn-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-hvn-text-primary">
          Havenly
        </Link>

        <nav className="hidden gap-6 text-sm font-medium text-hvn-text-muted sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "text-hvn-accent-mint"
                  : "hover:text-hvn-text-primary"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
