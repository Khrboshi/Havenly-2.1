"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseSessionProvider";

export default function Navbar() {
  const { supabase } = useSupabase();

  const [planType, setPlanType] = useState<string>("FREE");
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      const res = await fetch("/api/user/plan");
      const data = await res.json();

      if (data?.plan) {
        setPlanType(data.plan.planType);
        setCredits(data.plan.credits);
      }

      setLoading(false);
    }

    loadPlan();
  }, []);

  return (
    <nav className="flex w-full items-center justify-between py-3">

      {/* LEFT — BRAND */}
      <Link href="/dashboard" className="text-lg font-semibold text-brand-primary">
        Havenly
      </Link>

      {/* RIGHT SIDE CONTENT */}
      {!loading && (
        <div className="flex items-center gap-6 text-sm">

          {/* PLAN INDICATOR */}
          <div className="text-slate-300">
            <span className="font-semibold">{planType}</span>

            {planType === "FREE" && (
              <span className="ml-1 text-slate-400">
                · {credits}/20 reflections left
              </span>
            )}

            {planType !== "FREE" && (
              <span className="ml-1 text-emerald-400">
                · Premium Access
              </span>
            )}
          </div>

          {/* UPGRADE BUTTON */}
          {planType === "FREE" && (
            <Link
              href="/upgrade"
              className="rounded-lg bg-brand-primary px-3 py-1 text-xs font-medium text-white hover:bg-brand-primary-dark transition"
            >
              Upgrade
            </Link>
          )}

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <Link href="/journal">Journal</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/insights">Insights</Link>
          </div>

          {/* LOGOUT */}
          <Link
            href="/logout"
            className="font-medium text-red-400 hover:text-red-300 transition"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
}
