// app/magic-login/page.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { sendMagicLink } from "./sendMagicLinkAction";

type MagicLoginPageProps = {
  searchParams?: {
    redirectedFrom?: string;
  };
};

export default function MagicLoginPage({ searchParams }: MagicLoginPageProps) {
  const redirectTo = searchParams?.redirectedFrom || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);

    startTransition(async () => {
      const res = await sendMagicLink(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10 relative">

      {/* Soft gradient background behind the card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-72 w-72 rounded-full bg-hvn-accent-blue-soft/30 blur-[120px]" />
      </div>

      {/* Login box */}
      <div className="relative w-full max-w-md rounded-2xl border border-hvn-card bg-hvn-bg-elevated/90 p-7 
                      shadow-[0_20px_70px_rgba(15,23,42,0.85)] backdrop-blur 
                      animate-fadeIn">
        
        <h1 className="text-center text-2xl font-semibold text-hvn-text-primary">
          Sign in to Havenly
        </h1>

        <p className="mt-2 text-center text-sm text-hvn-text-muted">
          {redirectTo !== "/dashboard"
            ? "Sign in to continue where you left off."
            : "We will send you a secure one-time login link."}
        </p>

        {/* Error message */}
        {error && (
          <p className="mt-4 text-center text-xs text-red-400 bg-red-950/30 py-2 px-3 rounded-lg border border-red-900/40">
            {error}
          </p>
        )}

        {/* Login form */}
        <form action={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-hvn-text-secondary"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="block w-full rounded-xl border border-hvn-subtle/60 bg-hvn-bg-soft/80 
                         px-3 py-2 text-sm text-hvn-text-primary outline-none transition
                         placeholder:text-hvn-text-muted 
                         focus:border-hvn-accent-mint focus:ring-2 focus:ring-hvn-accent-mint/70"
            />

            {/* Pass redirect destination to server */}
            <input type="hidden" name="redirectTo" value={redirectTo} />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint 
                       px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md 
                       shadow-emerald-500/25 transition hover:bg-emerald-300 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending…" : "Send Magic Link"}
          </button>
        </form>

        {/* Redirect info */}
        <p className="mt-4 text-center text-xs text-hvn-text-muted">
          You will be redirected to{" "}
          <span className="font-semibold text-hvn-text-secondary">
            {redirectTo}
          </span>{" "}
          after signing in.
        </p>

        {/* Back link */}
        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-hvn-accent-mint hover:text-hvn-accent-blue transition-colors underline-offset-4 hover:underline"
          >
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
