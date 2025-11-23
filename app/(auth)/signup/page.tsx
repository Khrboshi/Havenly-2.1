"use client";

import { FormEvent, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState("Stress relief");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Unable to sign up.");
      return;
    }

    // Supabase emails the user — show confirmation message
    setSuccess(
      `We’ve sent a confirmation link to ${email}. Please check your inbox and verify your account to continue.`
    );

    // Insert profile only *after* user confirms email
    if (data.user) {
      await supabaseClient
        .from("profiles")
        .insert({ id: data.user.id, main_focus: focus })
        .catch(() => {});
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-2">Create your Havenly</h1>
      <p className="text-sm text-slate-300 mb-6">
        A calm private space to check in with yourself each day.
      </p>

      {success && (
        <p className="text-sm text-emerald-300 border border-emerald-500/40 bg-emerald-900/30 rounded-lg px-3 py-2 mb-4">
          {success}
        </p>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-[10px] text-slate-500">
              Minimum 6 characters. You can change it later.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">
              What brings you here?
            </label>
            <select
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-emerald-400"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            >
              <option>Stress relief</option>
              <option>Clarity & decisions</option>
              <option>Gratitude</option>
              <option>Tracking my mood</option>
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-400 border border-red-500/40 bg-red-950/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating your space…" : "Create account"}
          </button>
        </form>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-300 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
