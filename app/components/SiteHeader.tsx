"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const nav = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold text-emerald-300">
          Havenly
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition ${
                pathname === item.href
                  ? "text-emerald-300"
                  : "text-slate-300 hover:text-emerald-200"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/magic-login"
            className="rounded-full border border-emerald-400 px-4 py-1.5 text-sm font-medium text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 transition"
          >
            Magic Login
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-300 hover:text-emerald-300"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="flex flex-col gap-3 px-4 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`text-sm ${
                  pathname === item.href
                    ? "text-emerald-300"
                    : "text-slate-300 hover:text-emerald-200"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/magic-login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-emerald-400 px-4 py-1.5 text-center text-sm font-medium text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 transition"
            >
              Magic Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
