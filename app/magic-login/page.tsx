"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sendMagicLink } from "./sendMagicLink";
import { useSupabase } from "@/components/SupabaseSessionProvider";

type Status = "idle" | "loading" | "success" | "error";

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
    (window.navigator as any).standalone === true
  );
}

// Rough detection of in-app browsers that commonly break auth cookies
function isInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /(fbav|fb_iab|instagram|line|wv|snapchat|gsa|gmail|outlook)/.test(ua);
}

function MagicLoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { session } = useSupabase();

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const next = useMemo(() => {
    const raw = sp.get("next") || "/dashboard";
    // only allow internal paths
    if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
    return raw;
  }, [sp]);

  const callbackError = sp.get("callback_error") === "1";

  const ios = useMemo(() => isIOS(), []);
  const standalone = useMemo(() => isStandalone(), []);
  const inApp = useMemo(() => isInAppBrowser(), []);

  // If session exists, do not stay on magic-login.
  useEffect(() => {
    if (session?.user) {
      router.replace(next);
    }
  }, [session?.user, router, next]);

  // Surface a helpful message if callback failed (common on iOS in-app browsers)
  useEffect(() => {
    if (!callbackError) return;

    if (ios && inApp) {
      setStatus("error");
      setMessage(
        "It looks like you opened the magic link inside an in-app browser (Gmail/Outlook/Instagram). iPhone often blocks the sign-in cookie there. Please open the email link in Safari (Share → Open in Safari) and try again."
      );
      return;
    }

    setStatus("error");
    setMessage(
      "We couldn’t complete sign-in in this browser tab. Please try opening the magic link again in Safari/Chrome, or request a new link."
    );
  }, [callbackError, ios, inApp]);

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
    setMessage("A secure magic link has been sent to your email. Open it in Safari/Chrome.");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0f172a] p-8 rounded-xl shadow-lg border border-white/10">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Sign in to Havenly
        </h1>

        {/* Standalone note (installed app) */}
        {standalone ? (
          <div className="mb-4 p-3 rounded bg-emerald-900/30 text-emerald-200 text-sm">
            You’re using the installed app. If you requested a magic link from email,
            iPhone will usually open the link in Safari. After signing in, return to the
            Havenly app from your Home Screen.
          </div>
        ) : null}

        {/* iOS + in-app browser warning (preemptive) */}
        {!standalone && ios && inApp && !message ? (
          <div className="mb-4 p-3 rounded bg-amber-900/30 text-amber-200 text-sm">
            Tip: If you open the magic link inside Gmail/Outlook’s built-in browser,
            sign-in may fail. Use Share → <span className="font-semibold">Open in Safari</span>.
          </div>
        ) : null}

        {message ? (
          <div
            className={`mb-4 p-3 rounded ${
              status === "success"
                ? "bg-emerald-900/40 text-emerald-300"
                : "bg-red-900/40 text-red-300"
            }`}
          >
            {message}
          </div>
        ) : null}

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

        <div className="text-center mt-4 flex items-center justify-center gap-3">
          <Link href="/" className="text-sm text-blue-300 hover:underline">
            ← Back to Home
          </Link>

          {/* If callback error happened, offer quick retry navigation */}
          {callbackError ? (
            <button
              onClick={() => router.replace(`/magic-login?next=${encodeURIComponent(next)}`)}
              className="text-sm text-emerald-300 hover:underline"
              type="button"
            >
              Try again
            </button>
          ) : null}
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
    <Suspense
      fallback={<div className="text-center p-10 text-white">Loading…</div>}
    >
      <MagicLoginInner />
    </Suspense>
  );
}
