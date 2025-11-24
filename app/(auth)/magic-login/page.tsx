// app/(auth)/magic-login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function MagicLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { error } = await supabaseClient.auth.signInWithOtp({
        email: trimmed.toLowerCase(),
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setError(error.message || "Unable to send magic link right now.");
        return;
      }

      setSuccess(
        "Check your inbox for a secure login link. It usually arrives within a few seconds."
      );
    } catch (err) {
      console.error("Magic login error:", err);
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md pt-10">
      <h1 className="mb-2 text-2xl font-semibold text-slate-50">
        Your mindful moment is one tap away ✨
      </h1>
      <p className="mb-6 text-sm text-slate-300">
        Enter your email and we&apos;ll send you a one-time magic link. No
        password, no friction — just a private space to check in with yourself.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            placeholder="you@example.com"
          />
        </div>

        {success && (
          <p className="text-xs rounded-lg border border-emerald-500/50 bg-emerald-900/20 px-3 py-2 text-emerald-200">
            {success}
          </p>
        )}

        {error && (
          <p className="text-xs rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending magic link…" : "Send me a magic link"}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-400">
        We only use your email to sign you in. No public feed, no sharing, and
        you can delete your data anytime from Settings.
      </p>

      <div className="mt-6 space-y-2 text-xs text-slate-400">
        <p>
          Prefer a traditional login?{" "}
          <Link href="/login" className="text-emerald-300 hover:underline">
            Use email &amp; password
          </Link>
          .
        </p>
        <p>
          Already exploring Havenly on another device? Your entries stay synced
          to the same account as long as you use the same email.
        </p>
      </div>
    </div>
  );
}
