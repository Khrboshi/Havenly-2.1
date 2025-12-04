// app/magic-login/page.tsx
"use client";

import { useState, useTransition } from "react";
import { sendMagicLink } from "./sendMagicLinkAction";
import Link from "next/link";

export default function MagicLoginPage({ searchParams }) {
  const redirectTo = searchParams?.redirectedFrom || "/dashboard";

  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await sendMagicLink(formData);

      if (result?.error) {
        setStatus("error");
        setMessage(result.error);
        return;
      }

      setStatus("success");
      setMessage(
        "A secure magic link has been sent to your email. Please check your inbox."
      );
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10">
      <div className="animate-fadeIn w-full max-w-md rounded-2xl border border-hvn-card bg-hvn-bg-elevated/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.85)] backdrop-blur-sm">

        <h1 className="text-center text-2xl font-semibold text-hvn-text-primary">
          Sign in to Havenly
        </h1>
        <p className="mt-2 text-center text-sm text-hvn-text-muted">
          We will send you a secure one-time login link.
        </p>

        {/* SUCCESS MESSAGE */}
        {status === "success" && (
          <div className="mt-4 rounded-lg bg-hvn-accent-mint-soft/40 px-4 py-3 text-sm text-hvn-accent-mint border border-hvn-accent-mint/30 animate-fadeIn">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {status === "error" && (
          <div className="mt-4 rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-300 border border-red-500/40 animate-fadeIn">
            {message}
          </div>
        )}

        <form
          className="mt-6 space-y-4"
          action={handleSubmit}
        >
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
              disabled={isPending}
              className="block w-full rounded-xl border border-hvn-subtle/60 bg-hvn-bg-soft/80 px-3 py-2 text-sm text-hvn-text-primary placeholder:text-hvn-text-muted outline-none ring-0 transition focus:border-hvn-accent-mint focus:ring-2 focus:ring-hvn-accent-mint/70 disabled:opacity-50"
              placeholder="you@example.com"
            />

            <input type="hidden" name="redirectTo" value={redirectTo} />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/25 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-hvn-text-muted">
          You will be redirected to{" "}
          <span className="font-semibold text-hvn-text-secondary">
            {redirectTo}
          </span>{" "}
          after signing in.
        </p>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-hvn-accent-mint text-sm hover:underline"
          >
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
