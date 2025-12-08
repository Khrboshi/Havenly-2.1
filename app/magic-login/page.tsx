"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sendMagicLink } from "./sendMagicLink";
import { supabaseClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "success" | "error";

function MagicLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  // Default redirect after login
  const defaultRedirect = "/dashboard";

  // If user tried to access a protected route, we stored ?redirectedFrom=/xxx
  const redirectedFrom = searchParams.get("redirectedFrom") || defaultRedirect;

  // Handle login redirection when Supabase session becomes valid
  useEffect(() => {
    const supabase = supabaseClient;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        router.replace(redirectedFrom); // instant redirect
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, redirectedFrom]);

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setMessage(null);

    const result = await sendMagicLink(formData);

    if (!result.success) {
      setStatus("error");
      setMessage(result.message || "Something went wrong.");
      return;
    }

    setStatus("success");
    setMessage("A secure magic link has been sent to your email.");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0f172a] p-8 rounded-xl shadow-lg border border-white/10">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign in to Havenly</h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              status === "success"
                ? "bg-emerald-900/40 text-emerald-300"
                : "bg-red-900/40 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form action={handleSubmit}>
          <label className="block text-sm mb-2">Email address</label>
          <input
            required
            type="email"
            name="email"
            placeholder="you@example.com"
            className="w-full rounded-md px-3 py-2 mb-4 bg-black/20 border border-white/20 text-white"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-emerald-400 hover:bg-emerald-500 text-black font-semibold py-2 rounded-md transition"
          >
            {status === "loading" ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-blue-300 hover:underline">
            ← Back to Home
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-3">
          You will be redirected to /dashboard after signing in.
        </p>
      </div>
    </div>
  );
}

export default function MagicLoginPage() {
  return (
    <Suspense fallback={<div className="text-center p-10 text-white">Loading…</div>}>
      <MagicLoginInner />
    </Suspense>
  );
}
