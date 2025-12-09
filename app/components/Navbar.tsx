"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseSessionProvider";

export default function Navbar() {
  const { supabase, session } = useSupabase();

  const [planType, setPlanType] = useState<string>("FREE");
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const user = session?.user;

  // Load plan information
  useEffect(() => {
    async function loadPlan() {
      try {
        const res = await fetch("/api/user/plan", {
          credentials: "include",
        });

        const data = await res.json();

        if (data?.plan) {
          setPlanType(data.plan.planType);
          setCredits(data.plan.credits);
        }
      } catch (err) {
        console.error("Navbar plan load error:", err);
      }

      setLoading(false);
    }

    loadPlan();
  }, []);

  // FIX: logout must explicitly call the server route and then refresh UI
  async function handleLogout() {
    try {
      await fetch("/logout", {
        method: "GET",
        credentials: "include",
      });

      if (typeof window !== "undefined") {
        window.location.href = "/"; // Hard navigation ensures full session reset
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="text-xl font-bold text-brand-primary">
        Havenly
      </Link>

      {!loading && user && (
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">{planType}</span>

            {planType === "FREE" && (
              <span className="ml-1">· {credits}/20 reflections left</span>
            )}

            {planType !== "FREE" && (
              <span className="ml-1 text-green-700">· Premium Access</span>
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

          <div className="flex items-center gap-4 text-gray-700">
            <Link href="/journal">Journal</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/insights">Insights</Link>
          </div>

          {/* FIXED LOGOUT: now always works */}
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
