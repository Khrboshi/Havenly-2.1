"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabase } from "./SupabaseSessionProvider";
import { useUserPlan } from "./useUserPlan";

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const { session } = useSupabase();
  const { plan, loading } = useUserPlan();

  const isAuthed = !!session;

  // Build a simple label like "Free · 0/20"
  let planLabel: string | null = null;
  if (!loading) {
    if (plan && typeof plan === "object") {
      const name =
        (plan as any).name ??
        (plan as any).tier ??
        "Free";
      const used = (plan as any).used ?? (plan as any).current ?? 0;
      const limit =
        (plan as any).limit ??
        (plan as any).max ??
        20;
      planLabel = `${name} · ${used}/${limit}`;
    } else {
      planLabel = "Free";
    }
  }

  const authedNav = [
    { href: "/journal", label: "Journal" },
    { href: "/tools", label: "Tools" },
    { href: "/insights", label: "Insights" },
    { href: "/upgrade", label: "Upgrade" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/80 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Left: brand + plan pill */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-slate-50"
          >
            Havenly
          </Link>

          {planLabel && (
            <span className="hidden items-center rounded-full border border-slate-800 bg-slate-900/80 px-3 py-[3px] text-[11px] font-medium text-slate-300 md:inline-flex">
              {planLabel}
            </span>
          )}
        </div>

        {/* Right: navigation (different for authed vs guest) */}
        {isAuthed ? (
          <nav className="flex items-center gap-4 text-xs font-medium text-slate-300">
            {authedNav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    "transition-colors hover:text-emerald-300",
                    active && "text-emerald-300"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/logout"
              className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-900"
            >
              Logout
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 text-xs font-medium text-slate-300">
            <Link
              href="/blog"
              className={classNames(
                "hidden text-slate-300 hover:text-emerald-300 sm:inline-block",
                pathname.startsWith("/blog") && "text-emerald-300"
              )}
            >
              Blog
            </Link>

            <Link
              href="/magic-login"
              className="text-slate-300 hover:text-emerald-300"
            >
              Log in
            </Link>

            <Link
              href="/magic-login"
              className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Start free journal
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
