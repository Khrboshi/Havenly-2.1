// app/magic-login/page.tsx
"use client";

import { useState } from "react";
import { sendMagicLink } from "./sendMagicLinkAction";

export default function MagicLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | string>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const result = await sendMagicLink(email);

    if (result?.error) {
      setStatus(result.error);
    } else {
      setStatus("sent");
    }
  }

  return (
    <main
      className="
        min-h-[calc(100vh-60px)] 
        flex items-center justify-center 
        px-4 py-14
      "
    >
      <div
        className="
          w-full max-w-md 
          rounded-2xl 
          bg-hvn-bg-elevated/90 
          border border-hvn-card 
          p-8 
          shadow-[0_20px_80px_rgba(15,23,42,0.75)]
          backdrop-blur
        "
      >
        <h1 className="text-center text-xl font-semibold text-white">
          Sign in to Havenly
        </h1>

        <p className="mt-2 text-center text-sm text-hvn-text-muted">
          We will send you a secure one-time login link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hvn-text-secondary mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              className="
                w-full rounded-lg 
                bg-black/20 border border-white/10 
                px-3 py-2 text-sm text-white 
                focus:outline-none focus:ring-2 focus:ring-hvn-accent-mint
              "
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="
              w-full rounded-full 
              bg-hvn-accent-mint 
              py-2.5 text-sm font-semibold text-slate-950 
              hover:bg-emerald-300 
              shadow-md shadow-emerald-500/20 
              transition
            "
          >
            Send Magic Link
          </button>

          {status === "loading" && (
            <p className="text-center text-sm text-hvn-text-muted">Sending…</p>
          )}
          {status === "sent" && (
            <p className="text-center text-sm text-emerald-400">
              Magic link sent!
            </p>
          )}
          {status && status !== "sent" && status !== "loading" && (
            <p className="text-center text-sm text-red-400">{status}</p>
          )}
        </form>

        <p className="mt-4 text-center text-xs text-hvn-text-muted">
          You will be redirected to <strong>/dashboard</strong> after signing in.
        </p>
      </div>
    </main>
  );
}
