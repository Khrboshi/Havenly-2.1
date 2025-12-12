"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import Link from "next/link";
import { sendMagicLink } from "./sendMagicLink";

type Status = "idle" | "loading" | "success" | "error";

function MagicLoginInner() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

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
        <h1 className="text-2xl font-semibold text-center mb-6">
          Sign in to Havenly
        </h1>

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
          You will be redirected to your dashboard after signing in.
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
