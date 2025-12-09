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
      try {
        const res = await fetch("/api/user/plan", { cache: "no-store" });
        const data = await res.json();

        if (data?.plan) {
          setPlanType(data.plan.planType);
          setCredits(data.plan.credits);
        }
      } catch (err) {
        console.error("Navbar load error:", err);
      }

      setLoading(false);
    }

    loadPlan();
  }, []);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 backdrop-blur">
      <Link href="/" className="text-xl font-bold text-brand-primary">
        Havenly
      </Link>

      {!loading && (
        <div className="flex items-center gap-6">
          <div className="text-sm text-slate-300">
            <span className="font-semibold">{planType}</span>

            {planType === "FREE" ? (
              <span className="ml-1">· {credits}/20 reflections left</span>
            ) : (
              <span className="ml-1 text-emerald-400">· Premium Access</span>
            )}
          </div>

          {planType === "FREE" && (
            <Link
              href="/upgrade"
              className="px-4 py-2 rounded-lg bg-brand-primary text-white hover:bg-brand-primary-dark text-sm transition"
            >
              Upgrade
            </Link>
          )}

          <div className="flex items-center gap-4 text-slate-300">
            <Link href="/journal">Journal</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/insights">Insights</Link>
          </div>

          <Link
            href="/logout"
            className="text-sm text-red-400 hover:text-red-300 font-medium"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
}
