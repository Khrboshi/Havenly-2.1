"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-bg)] relative px-4">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.1)] to-transparent pointer-events-none" />

      <Card className="w-full max-w-md shadow-xl border-none bg-white rounded-2xl relative z-10">
        <CardContent className="py-10 px-8">
          <h1 className="text-2xl font-semibold text-center text-[var(--brand-text)]">
            Magic Login
          </h1>

          <p className="mt-2 text-center text-[var(--brand-text)]/70 text-sm">
            Enter your email to receive a secure one-time login link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
            />

            {/* VISIBLE BUTTON */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="
                w-full py-3 rounded-lg text-white font-semibold shadow-md
                bg-[var(--brand-primary)] 
                hover:bg-[var(--brand-primary-dark)]
                transition
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {status === "loading"
                ? "Sending..."
                : status === "sent"
                ? "Magic Link Sent!"
                : "Send Magic Link"}
            </button>

            {errorMessage && (
              <p className="text-red-600 text-center text-sm">{errorMessage}</p>
            )}

            {status === "sent" && (
              <p className="text-green-600 text-center text-sm">
                Check your inbox for the login link!
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[var(--brand-primary)] hover:underline text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
