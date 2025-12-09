"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { PLAN_CREDIT_ALLOWANCES } from "@/lib/creditRules";

export default function Navbar() {
  const { supabase, session } = useSupabase();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [planType, setPlanType] = useState("FREE");
  const [credits, setCredits] = useState<number | null>(null);

  const isLoggedIn = !!session;

  useEffect(() => {
    async function loadPlan() {
      if (!isLoggedIn) return;

      try {
        const res = await fetch("/api/user/plan");
        const data = await res.json();

        if (data?.plan) {
          setPlanType(data.plan.planType);
          setCredits(data.plan.credits);
        }
      } catch (err) {
        console.error("Navbar plan load failed:", err);
      }
    }

    loadPlan();
  }, [isLoggedIn]);

  function handleLogout() {
    supabase.auth.signOut();
  }

  // ----- Mobile Button (hamburger) ------
  const MobileButton = (
    <button
      onClick={() => setMobileOpen(!mobileOpen)}
      className="md:hidden p-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
    >
      ☰
    </button>
  );

  // ---- Plan Display -----
  const PlanDisplay =
    planType === "FREE" ? (
      <span className="text-xs text-slate-400">
        Free · {credits ?? 0}/{PLAN_CREDIT_ALLOWANCES.FREE}
      </span>
    ) : (
      <span className="text-xs text-emerald-300">Premium Access</span>
    );

  // ---- Navigation Links ----
  const NavLinks = (
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      <Link href="/journal" className="hover:text-brand-primary">
        Journal
      </Link>
      <Link href="/tools" className="hover:text-brand-primary">
        Tools
      </Link>
      <Link href="/insights" className="hover:text-brand-primary">
        Insights
      </Link>
      <Link href="/upgrade" className="hover:text-brand-primary">
        Upgrade
      </Link>

      <button
        className="text-red-400 hover:text-red-300 md:ml-4"
        onClick={handleLogout}
      >
        Logout
      </button>

      <div className="md:hidden border-t border-slate-700 pt-4 mt-4">
        {PlanDisplay}
      </div>
    </div>
  );

  return (
    <nav className="w-full bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="text-xl font-semibold text-brand-primary tracking-tight"
        >
          Havenly
        </Link>

        {/* Desktop: Plan */}
        <div className="hidden md:block">{PlanDisplay}</div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">{NavLinks}</div>

        {/* Mobile Hamburger */}
        {MobileButton}
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden mt-4 p-4 bg-slate-900/95 border border-slate-800 rounded-xl animate-fadeIn">
          {NavLinks}
        </div>
      )}
    </nav>
  );
}
