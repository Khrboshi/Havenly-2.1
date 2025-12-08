"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sendMagicLink } from "./sendMagicLink";
import { supabaseClient } from "@/lib/supabase/client";

function MagicLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const defaultRedirect = "/dashboard";

  // Redirect IF user is already logged in
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const { data, error } = await supabaseClient.auth.getSession();

      if (cancelled) return;
      if (error) return;

      if (data.session) {
        const redirectedFrom =
          searchParams.get("redirectedFrom") ||
          searchParams.get("redirect_to");

        router.replace(redirectedFrom || defaultRedirect);
      }
    }

    checkSession();

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;
        if (session) {
          const redirectedFrom =
            searchParams.get("redirectedFrom") ||
            searchParams.get("redirect_to");

          router.replace(redirectedFrom || defaultRedirect);
        }
      }
    );

    return () => {
      cancelled = true;
      subscription?.subscription.unsubscribe();
    };
  }, [router, searchParams]);

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setMessage(null);

    try {
      const result = await sendMagicLink(formData);

      if (!result?.success) {
        setStatus("error");
        setMessage(result?.message || "We couldn’t send the magic link. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(result.message || "A secure magic link has been sent. Please check your inbox.");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Something went wrong.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-8">
        <h1 className="text-center text-2xl font-semibold">Sign in to Havenly</h1>

        {status === "success" && message && (
          <div className="mt-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            {message}
          </div>
        )}

        {status === "error" && message && (
          <div className="mt-4 rounded-xl border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {message}
          </div>
        )}

        <form action={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="w-full rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-900"
          >
            {status === "loading" ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          You will be redirected to {defaultRedirect} after signing in.
        </p>

        <p className="mt-4 text-center text-xs text-emerald-300">
          <Link href="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default function MagicLoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-300 p-10">Loading…</div>}>
      <MagicLoginInner />
    </Suspense>
  );
}
