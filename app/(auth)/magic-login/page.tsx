"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function MagicLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // If user is already signed in (e.g. after clicking the email link),
  // redirect straight to the dashboard.
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();

        if (!isMounted) return;

        if (session?.user) {
          router.replace("/dashboard");
          return;
        }
      } catch (err) {
        console.error("Error checking session", err);
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function sendMagicLink(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          // After Supabase verifies the link, redirect back to /magic-login.
          // This page will then see the active session and send the user
          // straight to /dashboard.
          emailRedirectTo: `${window.location.origin}/magic-login`,
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

  const loggedOutFlag = searchParams?.get("logged_out") === "1";

  // While we are checking if a session already exists, show a simple message
  if (checkingSession) {
    return (
      <div className="mx-auto max-w-md space-y-6 pt-10 text-center text-slate-200">
        <p className="text-sm text-slate-300">Checking your session…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-10">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-50">
          Get a secure login link
        </h1>
        <p className="text-sm text-slate-300">
          No password needed — we&apos;ll email you a one-time link to open your
          journal.
        </p>

        {loggedOutFlag && (
          <p className="mt-2 text-xs text-slate-400">
            You&apos;ve been logged out. When you&apos;re ready to write again, request
            a new magic link below.
          </p>
        )}
      </header>

      {sent ? (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-900/20 p-4 text-sm text-emerald-100">
          A login link has been sent to{" "}
          <span className="font-semibold">{email}</span>. Please check your
          inbox and open Havenly from there.
          <p className="mt-2 text-xs text-emerald-100/80">
            Didn&apos;t get it? Check spam or request another link.
          </p>
        </div>
      ) : (
        <form onSubmit={sendMagicLink} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
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
            className="w-full rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? "Sending link…" : "Send magic link"}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-slate-400">
        Havenly works without passwords — just use your secure magic link.
      </p>

      <p className="text-center text-xs text-slate-500">
        <Link href="/" className="text-emerald-300 hover:underline">
          Return to home
        </Link>
      </p>
    </div>
  );
}
