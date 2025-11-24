"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function MagicLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMagicLink(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message || "Unable to send magic link.");
        return;
      }

      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md pt-10">
      <h1 className="mb-2 text-2xl font-semibold text-slate-50">
        Log in without a password
      </h1>
      <p className="mb-6 text-sm text-slate-300">
        Enter your email and we’ll send you a magic login link.
      </p>

      {sent ? (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-900/20 p-4 text-sm text-emerald-200">
          A login link has been sent to <strong>{email}</strong>.  
          Please check your inbox and click the link to continue.
        </p>
      ) : (
        <form onSubmit={sendMagicLink} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 outline-none"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <p className="text-xs rounded-lg border border-red-600/50 bg-red-950/40 px-3 py-2 text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send magic link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-xs text-slate-400 text-center">
        Prefer a traditional login?{" "}
        <Link href="/login" className="text-emerald-300 hover:underline">
          Use password instead
        </Link>
      </p>
    </div>
  );
}
