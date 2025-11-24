"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [error, setError] = useState("");

  async function handlePasswordLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoadingPassword(true);

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setError(error.message || "Unable to log in.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoadingPassword(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-8 pt-10">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">
          Welcome back to Havenly
        </h1>
        <p className="text-sm text-slate-300">
          Log in to continue your reflections. Most people use{" "}
          <span className="font-medium text-emerald-300">
            email magic links
          </span>{" "}
          so they never have to remember a password.
        </p>
      </header>

      {/* Magic link promo */}
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-900/10 p-4">
        <h2 className="mb-1 text-sm font-semibold text-emerald-200">
          Password-free login ✉️
        </h2>
        <p className="mb-3 text-xs text-emerald-100/80">
          Get a secure one-time login link by email. No password, no friction.
        </p>
        <Link
          href="/magic-login"
          className="inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
        >
          Continue with email link
        </Link>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <div className="h-px flex-1 bg-slate-800" />
        <span>or use your password</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      {/* Password login form */}
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs rounded-lg border border-red-600/50 bg-red-950/40 px-3 py-2 text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loadingPassword}
            className="w-full rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white disabled:opacity-60"
          >
            {loadingPassword ? "Signing you in…" : "Log in with password"}
          </button>
        </form>

        <p className="text-[11px] text-slate-500">
          Password login is mainly for{" "}
          <span className="text-slate-300">existing / premium users</span>.  
          New users can just use the email link above.
        </p>
      </section>

      {/* Bottom link */}
      <p className="text-center text-xs text-slate-400">
        New to Havenly?{" "}
        <Link href="/signup" className="text-emerald-300 hover:underline">
          Create a free account
        </Link>
      </p>
    </div>
  );
}
