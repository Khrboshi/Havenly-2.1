"use client";

import { useState } from "react";
import Link from "next/link";

export default function MagicLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to send magic link.");
      }

      setStatus("sent");
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      {/* Dark, elegant login card */}
      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-semibold text-center text-white">
          Magic Login
        </h1>

        <p className="mt-3 text-center text-gray-300 text-sm">
          Enter your email and we’ll send you a secure one-time login link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="
              w-full px-4 py-3 rounded-lg
              bg-gray-800 text-white border border-gray-600
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]
            "
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="
              w-full py-3 rounded-lg
              text-white font-semibold shadow-lg
              bg-[var(--brand-primary)]
              hover:bg-[var(--brand-primary-dark)]
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {status === "loading"
              ? "Sending..."
              : status === "sent"
              ? "Magic Link Sent!"
              : "Send Magic Link"}
          </button>

          {errorMessage && (
            <p className="text-red-400 text-center text-sm">{errorMessage}</p>
          )}

          {status === "sent" && (
            <p className="text-green-400 text-center text-sm">
              Check your inbox for the login link!
            </p>
          )}
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-[var(--brand-primary-light)] hover:underline text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
