"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseSessionProvider";

type PlanInfo = {
  planType: "FREE" | "PREMIUM" | "TRIAL";
  credits: number;
};

export default function Navbar() {
  const { supabase } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PlanInfo>({
    planType: "FREE",
    credits: 0,
  });

  useEffect(() => {
    let active = true;

    async function loadPlan() {
      try {
        const res = await fetch("/api/user/plan", { cache: "no-store" });
        const data = await res.json();

        if (active && data?.plan) {
          setPlan({
            planType: data.plan.planType,
            credits: data.plan.credits,
          });
        }
      } catch (err) {
        console.error("Navbar plan error:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPlan();
    return () => {
      active = false;
    };
  }, []);

  const isFree = plan.planType === "FREE";
  const isPremium = plan.planType === "PREMIUM" || plan.planType === "TRIAL";

  return (
    <nav className="w-full bg-slate-950/90 backdrop-blur border-b border-slate-800">
      {/* INNER CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* LEFT — Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-brand-primary"
        >
          Havenly
        </Link>

        {/* RIGHT SECTION — Desktop only */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {/* PLAN STATUS */}
          {!loading && (
            <div className="text-slate-300">
              <span className="font-medium">{plan.planType}</span>

              {isFree ? (
                <span className="ml-1 text-slate-400">
                  · {plan.credits}/20 reflections left
                </span>
              ) : (
                <span className="ml-1 text-emerald-400">· Premium Access</span>
              )}
            </div>
          )}

          {/* NAVIGATION LINKS */}
          <Link
            href="/journal"
            className="hover:text-brand-primary transition-colors"
          >
            Journal
          </Link>

          <Link
            href="/tools"
            className="hover:text-brand-primary transition-colors"
          >
            Tools
          </Link>

          <Link
            href="/insights"
            className="hover:text-brand-primary transition-colors"
          >
            Insights
          </Link>

          {/* UPGRADE BUTTON FOR FREE USERS */}
          {!loading && isFree && (
            <Link
              href="/upgrade"
              className="px-3 py-1.5 rounded-lg bg-brand-primary text-white hover:bg-brand-primary-dark transition"
            >
              Upgrade
            </Link>
          )}

          {/* LOGOUT */}
          <Link
            href="/logout"
            className="text-red-500 hover:text-red-400 font-medium transition"
          >
            Logout
          </Link>
        </div>

        {/* MOBILE MENU (compact) */}
        <div className="md:hidden flex items-center gap-4 text-sm">
          {!loading && (
            <span className="text-slate-400 text-xs">
              {isFree
                ? `${plan.credits}/20 left`
                : "Premium"}
            </span>
          )}

          <Link
            href="/logout"
            className="text-red-500 hover:text-red-400 font-medium transition text-xs"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
