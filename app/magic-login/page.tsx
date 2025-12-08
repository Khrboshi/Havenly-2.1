"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sendMagicLink } from "./sendMagicLink";
import { supabaseClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "success" | "error";

export default function MagicLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  // Default destination after login
  const defaultRedirect = "/dashboard";

  /**
   * If a session already exists (for example, after clicking the email link
   * and being redirected back here), immediately redirect the user away from
   * /magic-login to their actual destination.
   */
  useEffect(() => {
    let cancelled = false;

    async function checkSessionAndRedirect() {
      try {
        const { data, error } = await supabaseClient.auth.getSession();

        if (cancelled) return;

        if (error) {
          console.error("magic-login getSession error:", error.message);
          return;
        }

        if (data.session) {
          const redirectedFrom =
            searchParams.get("redirectedFrom") ||
            searchParams.get("redirect_to");
          const target = redirectedFrom || defaultRedirect;
          router.replace(target);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("magic-login unexpected error:", err);
        }
      }
    }

    checkSessionAndRedirect();

    // Also listen for auth changes while on this page (just in case)
    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;
        if (session) {
          const redirectedFrom =
            searchParams.get("redirectedFrom") ||
            searchParams.get("redirect_to");
          const target = redirectedFrom || defaultRedirect;
          router.replace(target);
        }
      }
    );

    return () => {
      cancelled = true;
      subscription?.subscription.unsubscribe();
    };
  }, [router, searchParams, defaultRedirect]);

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setMessage(null);

    try {
      const result = await sendMagicLink(formData);

      if (!result?.success) {
        setStatus("error");
        setMessage(
          result?.message ||
            "We couldn’t send the magic link. Please try again."
        );
        return;
      }

      setStatus("success");
      setMessage(
        result.message ||
          "A secure magic link has been sent to your email. Please check your inbox."
      );
    } catch (err) {
      console.error("Magic login submission error:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setStatus((prev) => (prev === "loading" ? "idle" : prev));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 px-4 py-10 text-slate-100">
      <div className="mx-auto flex max-w-3xl items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-8 shadow-xl shadow-slate-950/60">
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
                className="block w-full rounded-xl border border-hvn-border bg-slate-950 px-3 py-2 text-sm text-hvn-text-primary placeholder:text-slate-500 focus:border-hvn-accent-mint focus:outline-none focus:ring-2 focus:ring-hvn-accent-mint/70"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-80"
            >
              {status === "loading" ? "Sending..." : "Send Magic Link"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-hvn-text-muted">
            You will be redirected to{" "}
            <span className="font-semibold text-hvn-text-secondary">
              {defaultRedirect}
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
    </div>
  );
}
