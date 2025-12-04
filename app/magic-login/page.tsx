"use client";

import { useState } from "react";
import Link from "next/link";
import { sendMagicLink } from "./sendMagicLink";

type Status = "idle" | "loading" | "success" | "error";

export default function MagicLoginPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  // We now always redirect to dashboard after login
  const redirectTo = "/dashboard";

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setMessage(null);

    try {
      const result = await sendMagicLink(formData);

      if (!result.success) {
        setStatus("error");
        setMessage(
          result.message || "Something went wrong while sending the magic link."
        );
      } else {
        setStatus("success");
        setMessage(
          result.message ||
            "A secure magic link has been sent to your email. Please check your inbox."
        );
      }
    } catch (err) {
      console.error("Magic login error:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again in a moment.");
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-hvn-card bg-hvn-bg-elevated/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.85)] backdrop-blur-sm">
        <h1 className="text-center text-2xl font-semibold text-hvn-text-primary">
          Sign in to Havenly
        </h1>
        <p className="mt-2 text-center text-sm text-hvn-text-muted">
          We will send you a secure one-time login link.
        </p>

        {/* SUCCESS MESSAGE */}
        {status === "success" && message && (
          <div className="mt-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {status === "error" && message && (
          <div className="mt-4 rounded-xl border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {message}
          </div>
        )}

        {/* FORM */}
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
              className="block w-full rounded-xl border border-hvn-subtle/60 bg-hvn-bg-soft/80 px-3 py-2 text-sm text-hvn-text-primary outline-none ring-0 transition placeholder:text-hvn-text-muted focus:border-hvn-accent-mint focus:ring-2 focus:ring-hvn-accent-mint/70"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/25 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hvn-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {status === "loading" ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-hvn-text-muted">
          You will be redirected to{" "}
          <span className="font-semibold text-hvn-text-secondary">
            {redirectTo}
          </span>{" "}
          after signing in.
        </p>

        <p className="mt-4 text-center text-xs text-hvn-accent-blue">
          <Link href="/" className="hover:underline">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
