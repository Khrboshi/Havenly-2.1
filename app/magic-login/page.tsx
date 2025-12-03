// app/magic-login/page.tsx
"use client";

import { FormEvent, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function MagicLoginInner() {
  const searchParams = useSearchParams();

  // Where to send the user AFTER they click the magic link in email
  const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email) return;

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          redirectedFrom, // must match API contract
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          (data && (data.error as string)) ||
          "Failed to send magic link. Please try again.";
        throw new Error(message);
      }

      setStatus("sent");
    } catch (err: any) {
      console.error("Magic link error:", err);
      setStatus("error");
      setError(
        err?.message || "Something went wrong. Please try again in a moment."
      );
    }
  }

  const disabled = status === "sending";

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Sign in to Havenly
        </h1>
        <p className="text-sm text-slate-300 text-center mb-6">
          Enter your email and we&apos;ll send you a secure one-time login link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-200">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "Sending magic link..." : "Send Magic Link"}
          </button>
        </form>

        {status === "sent" && (
          <p className="mt-4 text-sm text-emerald-300 text-center">
            Magic link sent! Check your inbox and click the link to finish
            signing in.
          </p>
        )}

        {status === "error" && (
          <p className="mt-4 text-sm text-red-400 text-center">
            {error || "Something went wrong. Please try again."}
          </p>
        )}

        <p className="mt-6 text-xs text-slate-500 text-center">
          You&apos;ll be redirected to{" "}
          <span className="font-medium text-slate-300">
            {redirectedFrom || "/dashboard"}
          </span>{" "}
          after you sign in.
        </p>
      </div>
    </div>
  );
}

export default function MagicLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <p className="text-sm text-slate-200">Loading sign-in...</p>
        </div>
      }
    >
      <MagicLoginInner />
    </Suspense>
  );
}
