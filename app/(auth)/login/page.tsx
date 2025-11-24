"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const loggedOut = searchParams.get("logged_out") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setError(error.message || "Invalid credentials.");
        return;
      }

      // On success, redirect with client router
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md pt-10">
      <h1 className="mb-2 text-2xl font-semibold text-slate-50">
        Welcome back
      </h1>
      <p className="mb-6 text-sm text-slate-300">
        Log in to continue your Havenly reflections.
      </p>

      {loggedOut && (
        <p className="mb-6 rounded-lg border border-emerald-600/40 bg-emerald-900/20 px-3 py-2 text-sm text-emerald-200">
          You’ve been logged out. Thank you for checking in today — come back
          anytime you need a quiet moment.
        </p>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-xs rounded-lg border border-red-600/40 bg-red-950/40 px-3 py-2 text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-emerald-300 hover:underline">
          Sign up
        </Link>
      </p>

      <p className="mt-2 text-xs text-slate-400">
        Prefer logging in without a password?{" "}
        <Link href="/magic-login" className="text-emerald-300 hover:underline">
          Get a magic login link
        </Link>
        .
      </p>
    </div>
  );
}
