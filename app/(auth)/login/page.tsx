"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

type LoginMode = "magic" | "password";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<LoginMode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "magic") {
        // MAGIC LINK LOGIN (FREE)
        const redirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined;

        const { error } = await supabaseClient.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: redirectTo,
          },
        });

        if (error) {
          setError(error.message || "Unable to send magic link.");
        } else {
          setSuccess(
            "Check your inbox for a secure login link. It may take a few seconds."
          );
        }
      } else {
        // PASSWORD LOGIN (FOR PLUS USERS / LEGACY USERS)
        if (!password) {
          setError("Please enter your password.");
          return;
        }

        const { error } = await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setError(error.message || "Unable to log in with password.");
        } else {
          // Go straight to dashboard; server will read the session from cookies
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const magicActive = mode === "magic";
  const passwordActive = mode === "password";

  return (
    <div className="mx-auto mt-10 max-w-sm space-y-8">
      {/* Heading / context */}
      <div className="space-y-2">
        <p className="text-xs tracking-[0.16em] text-emerald-300">
          HAVENLY SIGN IN
        </p>
        <h1 className="text-2xl font-semibold text-slate-50">
          Welcome back to your space
        </h1>
        <p className="text-sm text-slate-300">
          Use a one-time link for fast, password-free access, or sign in with
          your password if you&apos;re on Havenly Plus.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-full bg-slate-900/70 p-1 text-xs">
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`flex-1 rounded-full px-3 py-2 transition ${
            magicActive
              ? "bg-emerald-400 text-slate-950 font-semibold"
              : "text-slate-300 hover:text-emerald-200"
          }`}
        >
          Email link (no password)
        </button>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-full px-3 py-2 transition ${
            passwordActive
              ? "bg-slate-800 text-slate-50 font-semibold"
              : "text-slate-300 hover:text-emerald-200"
          }`}
        >
          Password (Havenly Plus)
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email field */}
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Email</label>
          <input
            type="email"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>

        {/* Password field (only when mode=password) */}
        {passwordActive && (
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Password</label>
            <input
              type="password"
              required={passwordActive}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <p className="text-[11px] text-slate-400">
              Password login is part of{" "}
              <span className="font-medium text-emerald-300">
                Havenly Plus
              </span>{" "}
              and for existing password users.
            </p>
          </div>
        )}

        {/* Error / success messages */}
        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-200">
            {success}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? magicActive
              ? "Sending link…"
              : "Signing you in…"
            : magicActive
            ? "Send me a magic link"
            : "Sign in with password"}
        </button>
      </form>

      {/* Small footer under form */}
      <div className="space-y-2 text-xs text-slate-400">
        <p>
          Don&apos;t have an account yet?{" "}
          <Link
            href="/signup"
            className="font-medium text-emerald-300 hover:underline"
          >
            Start free in under 30 seconds
          </Link>
          .
        </p>
        <p className="text-[11px]">
          By continuing, you agree to Havenly&apos;s{" "}
          <Link
            href="/privacy"
            className="text-emerald-300 hover:underline"
          >
            privacy notice
          </Link>
          . Your reflections stay private and are never shared as a feed.
        </p>
      </div>
    </div>
  );
}
