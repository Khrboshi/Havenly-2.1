"use client";

import { useState } from "react";
import { sendMagicLink } from "./sendMagicLink";

export default function MagicLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await sendMagicLink(email);

    if (result.success) {
      setStatus("sent");
    } else {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4 pt-28">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-xl font-semibold">Get a secure login link</h1>
        <p className="text-sm text-slate-300">
          No password needed — we’ll email you a one-time link to open your journal.
        </p>

        {status === "sent" ? (
          <p className="rounded-xl border border-emerald-400 bg-emerald-900/20 p-3 text-sm text-emerald-300">
            A login link has been sent. Please check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full bg-slate-900 border border-slate-700 px-4 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-300 text-slate-950 font-semibold py-2.5 text-sm"
            >
              Send magic link
            </button>
          </form>
        )}

        <p className="text-xs text-slate-500">
          Havenly works without passwords — just use your secure magic link.
        </p>
      </div>
    </main>
  );
}
