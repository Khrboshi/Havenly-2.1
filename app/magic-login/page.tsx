// app/magic-login/page.tsx
// Magic link login – logged out

"use client";

import { useState } from "react";
import Link from "next/link";
import { sendMagicLink } from "./sendMagicLink";

type Status = "idle" | "loading" | "success" | "error";

export default function MagicLoginPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const redirectTo = "/dashboard";

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setMessage(null);

    try {
      const result = await sendMagicLink(formData);

      if (!result?.success) {
        setStatus("error");
        setMessage(
          result?.message ||
            "Something went wrong while sending your link. Please try again."
        );
        return;
      }

      setStatus("success");
      setMessage(
        "Magic link sent. Check your email and open the link on this device."
      );
    } catch (err) {
      console.error("Magic link error", err);
      setStatus("error");
      setMessage(
        "We couldn’t send the link right now. Please double-check your email and try again."
      );
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#050816] text-slate-100">
      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6 pt-10 pb-20 md:px-10 lg:px-24">
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          <div className="w-full rounded-2xl border border-slate-800 bg-[#050816] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <h1 className="text-center text-2xl font-semibold text-slate-50">
              Sign in to Havenly
            </h1>
            <p className="mt-2 text-center text-sm text-slate-300">
              We’ll send you a secure one-time login link.
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                formData.set("redirectTo", redirectTo);
                await handleSubmit(formData);
              }}
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-300"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2"
                />
              </div>

              <input type="hidden" name="redirectTo" value={redirectTo} />

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-70"
              >
                {status === "loading" ? "Sending..." : "Send Magic Link"}
              </button>

              <p className="mt-2 text-center text-[11px] text-slate-400">
                You will be redirected to <code>/dashboard</code> after signing
                in.
              </p>

              {message && (
                <p
                  className={`mt-3 text-center text-xs ${
                    status === "success" ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              <Link
                href="/"
                className="font-medium text-slate-300 hover:text-sky-300"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
