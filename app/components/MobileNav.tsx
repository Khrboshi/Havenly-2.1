"use client";

import Link from "next/link";
import type { NavItem } from "./Navbar";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  isLoggedIn: boolean;
};

export default function MobileNav({
  open,
  onClose,
  items,
  isLoggedIn,
}: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="sm:hidden">
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-x-0 top-14 z-50 rounded-b-2xl border-b border-slate-800 bg-slate-950/98 shadow-lg shadow-slate-950/50">
        <nav className="flex flex-col gap-1 px-4 py-3 text-sm text-slate-100">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="rounded-lg px-3 py-2 hover:bg-slate-900"
            >
              {item.label}
            </Link>
          ))}

          {!isLoggedIn && (
            <div className="mt-2 flex gap-2">
              <Link
                href="/magic-login"
                onClick={onClose}
                className="flex-1 rounded-full border border-slate-600 px-3 py-1.5 text-center text-xs font-medium text-slate-100 hover:bg-slate-900"
              >
                Sign in
              </Link>
              <Link
                href="/upgrade"
                onClick={onClose}
                className="flex-1 rounded-full bg-emerald-400 px-3 py-1.5 text-center text-xs font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Try Premium
              </Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
