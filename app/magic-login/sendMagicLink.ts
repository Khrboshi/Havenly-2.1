"use client";

import { useState } from "react";
import { sendMagicLink } from "./sendMagicLink";

export default function MagicLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await sendMagicLink(email);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSent(true);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">

      <h1 className="text-3xl font-bold">Get a secure login link</h1>

      {!sent && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 bg-[var(--brand-surface)]/60 p-8 rounded-xl border border-white/10 shadow-md"
        >
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full p-3 rounded-lg bg-[#0f1320] border border-white/10 text-[var(--brand-text)] placeholder-white/40"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[var(--brand-primary)] text-white font-semibold hover:bg-[var(--brand-primary-dark)] transition"
          >
            Send magic link
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <p className="text-center text-[var(--brand-text)]/70">
            <a href="/" className="underline hover:text-[var(--brand-primary)]">
              Return to home
            </a>
          </p>
        </form>
      )}

      {sent && (
        <div className="bg-[var(--brand-surface)]/60 p-8 rounded-xl border border-white/10 shadow-md text-center max-w-md">
          <p className="text-lg font-medium text-[var(--brand-primary-light)]">
            Magic link sent!
          </p>
          <p className="text-[var(--brand-text)]/75 mt-2">
            Check your inbox to continue.
          </p>
        </div>
      )}

    </main>
  );
}
