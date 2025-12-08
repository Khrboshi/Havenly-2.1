"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/insights", label: "Insights" },
    { href: "/tools", label: "Tools" },
  ];

  return (
    <div
      className={`
        fixed inset-0 z-40 bg-black/40 backdrop-blur-sm 
        transition-opacity duration-200
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={onClose}
    >
      <div
        className={`
          absolute right-0 top-0 h-full w-64 bg-slate-900 
          border-l border-slate-800 p-6 transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="flex flex-col gap-4 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                px-3 py-2 rounded-md text-sm font-medium
                ${pathname === item.href ? "text-emerald-400" : "text-slate-300"}
                hover:text-white
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
