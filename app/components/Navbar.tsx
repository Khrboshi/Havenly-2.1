"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/browser-client";

// ---- USER TYPES ----
type UserTier = "guest" | "free" | "paid";

// ---- PUBLIC NAV LINKS ----
const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

// ---- PRIVATE FREE LINKS ----
const FREE_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/journal", label: "Journal" },
  { href: "/tools", label: "Tools" },
];

// ---- PRIVATE PAID LINKS ----
const PAID_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/journal", label: "Journal" },
  { href: "/tools", label: "Tools+" },
  { href: "/insights", label: "Insights" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const supabase = createClient();

  const [tier, setTier] = useState<UserTier>("guest");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Determine tier: guest → free → paid
  useEffect(() => {
    let active = true;

    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;

      if (!data.user) {
        setTier("guest");
        setUserEmail(null);
        return;
      }

      setUserEmail(data.user.email ?? null);

      // Very simple role detection (extend later with Stripe)
      const { data: sub } = await supabase
        .from("user_profiles")
        .select("tier")
        .eq("id", data.user.id)
        .maybeSingle();

      if (sub?.tier === "paid") {
        setTier("paid");
      } else {
        setTier("free");
      }
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(() => init());
    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Active link logic
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  const linkStyle = (active: boolean) =>
    `text-sm transition font-medium ${
      active ? "text-emerald-300" : "text-slate-300 hover:text-emerald-300"
    }`;

  // Determine visible nav links
  let navLinks = PUBLIC_LINKS;
  if (tier === "free") navLinks = FREE_LINKS;
  if (tier === "paid") navLinks = PAID_LINKS;

  // Auth buttons
  const renderAuth = () => {
    if (tier === "guest") {
      return (
        <>
          <Link href="/magic-login" className="text-sm text-slate-300 hover:text-emerald-300">Sign in</Link>
          <Link href="/magic-login"
            className="rounded-full bg-emerald-400 px-4 py-1.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300">
            Start journaling free
          </Link>
        </>
      );
    }

    if (tier === "free") {
      return (
        <>
          <Link href="/upgrade"
            className="rounded-full bg-emerald-400 px-4 py-1.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300">
            Upgrade
          </Link>

          <span className="text-xs text-slate-400 max-w-[100px] truncate">{userEmail}</span>
          <Link href="/logout"
            className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-emerald-400">
            Log out
          </Link>
        </>
      );
    }

    if (tier === "paid") {
      return (
        <>
          <span className="text-xs text-slate-400 max-w-[100px] truncate">{userEmail}</span>
          <Link href="/settings"
            className="rounded-full bg-slate-800 px-3 py-1.5 text-xs hover:bg-slate-700">
            Manage
          </Link>
          <Link href="/logout"
            className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-emerald-400">
            Log out
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* BRAND */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold">
            H
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold">Havenly 2.1</div>
            <div className="text-[10px] text-slate-400 tracking-wider">Reflect. Understand. Grow.</div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkStyle(isActive(link.href))}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT AUTH AREA */}
        <div className="hidden md:flex items-center gap-4">
          {renderAuth()}
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden p-2 rounded-full border border-slate-700 text-slate-200"
          onClick={() => setMobileOpen((x) => !x)}
        >
          <span className="sr-only">Toggle</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-4 bg-current"></span>
            <span className="block h-0.5 w-4 bg-current"></span>
            <span className="block h-0.5 w-4 bg-current"></span>
          </div>
        </button>
      </div>

      {/* MOBILE NAV */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-slate-800 bg-slate-950">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkStyle(isActive(link.href))}>
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-3">
              {renderAuth()}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
