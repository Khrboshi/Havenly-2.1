"use client";

import { useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function MagicLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        <h1 className="text-2xl font-semibold">Get a secure login link</h1>

        {!sent && (
          <>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              No password needed — we’ll email you a one-time link to open your journal.
            </p>

            <form onSubmit={handleSendLink} className="space-y-4">
              <input
                type="email"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                type="submit"
                className="w-full rounded-full bg-emerald-400 text-slate-950 font-semibold py-2 hover:bg-emerald-300"
              >
                Send magic link
              </button>
            </form>

            {error && (
              <p className="text-red-400 text-sm mt-2">
                {error}
              </p>
            )}

            <p className="text-xs text-slate-500">
              Havenly works without passwords — just use your secure magic link.
            </p>
          </>
        )}

        {sent && (
          <>
            <p className="rounded-xl border border-emerald-700 bg-emerald-900/30 px-4 py-3 text-sm text-emerald-200">
              A login link has been sent to <strong>{email}</strong>. Please check your inbox.
            </p>

            <p className="text-xs text-slate-500">
              Didn’t get it? Check spam or try again.
            </p>

            <button
              onClick={() => setSent(false)}
              className="text-slate-400 text-sm underline mt-2"
            >
              Send again
            </button>
          </>
        )}

        <Link
          href="/"
          className="block text-xs text-slate-500 hover:text-slate-300 mt-6"
        >
          Return to home
        </Link>
      </div>
    </main>
  );
}
