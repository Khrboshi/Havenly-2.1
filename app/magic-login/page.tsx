// app/magic-login/page.tsx
"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { sendMagicLink } from "./sendMagicLink";

type MagicLoginPageProps = {
  searchParams?: {
    redirectedFrom?: string;
  };
};

export default function MagicLoginPage({ searchParams }: MagicLoginPageProps) {
  // We still capture this for future use, but we don't promise it in the UI.
  const redirectTo = searchParams?.redirectedFrom || "/dashboard";

  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(formData: FormData) {
    setStatus("idle");
    setErrorMessage("");

    // Pass redirectTo through the form so the server action can use it if needed.
    formData.set("redirectTo", redirectTo);

    startTransition(async () => {
      const result = await sendMagicLink(formData);

      if (result?.error) {
        setStatus("error");
        setErrorMessage(result.error);
      } else {
        setStatus("success");
      }
    });
  }

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-hvn-card bg-hvn-bg-elevated/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.85)] backdrop-blur-sm">
        <h1 className="text-center text-2xl font-semibold text-hvn-text-primary">
          Sign in to Havenly
        </h1>
        <p className="mt-2 text-center text-sm text-hvn-text-muted">
          We will send you a secure one-time login link.
        </p>

        {/* Status messages */}
        {status === "success" && (
          <div className="mt-4 rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            A secure magic link has been sent to your email. Please check your
            inbox.
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {errorMessage || "We could not send the magic link. Please try again."}
          </div>
        )}

        <form
          action={handleSubmit}
          className="mt-6 space-y-4"
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
              className="block w-full rounded-xl border border-hvn-subtle/60 bg-hvn-bg-soft/80 px-3 py-2 text-sm text-hvn-text-primary outline-none ring-0 transition placeholder:text-hvn-text-muted focus:border-hvn-accent-mint focus:ring-2 focus:ring-hvn-accent-mint/70"
              placeholder="you@example.com"
            />

            {/* Hidden field for optional redirect target (used by server action if needed) */}
            <input type="hidden" name="redirectTo" value={redirectTo} />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/25 transition hover:bg-emerald-300 disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hvn-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {pending ? "Sending…" : "Send Magic Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-hvn-text-muted">
          After you open the magic link in your email, you&apos;ll be signed in and
          taken back into Havenly.
        </p>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-hvn-accent-mint hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
