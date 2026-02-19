"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@/components/SupabaseSessionProvider";
import { sendMagicLink } from "./sendMagicLink";
import { sendOtp } from "./sendOtp";
import { verifyOtp } from "./verifyOtp";

type Status = "idle" | "loading" | "success" | "error";
type Mode = "link" | "code";

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

function MagicLoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { session } = useSupabase();

  const next = useMemo(() => {
    const raw = sp.get("next") || "/dashboard";
    if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
    return raw;
  }, [sp]);

  const callbackError = sp.get("callback_error") === "1";

  const ios = useMemo(() => isIOS(), []);
  const standalone = useMemo(() => isStandalone(), []);

  const [mode, setMode] = useState<Mode>(() => (ios ? "code" : "link"));
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  // shared fields
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  // If already logged in, go where you should go
  useEffect(() => {
    if (session?.user) router.replace(next);
  }, [session?.user, router, next]);

  useEffect(() => {
    if (!callbackError) return;
    setStatus("error");
    setMessage(
      "Sign-in didn’t complete in this browser tab. On iPhone, the installed app and Safari may not share sessions. Use the code option to sign in inside the same place you’re using."
    );
  }, [callbackError]);

  async function onSendLink() {
    setStatus("loading");
    setMessage(null);

    const fd = new FormData();
    fd.set("email", email);

    const res = await sendMagicLink(fd);
    if (!res.success) {
      setStatus("error");
      setMessage(res.message || "Failed to send link.");
      return;
    }

    setStatus("success");
    setMessage("Magic link sent. Open it in Safari/Chrome.");
  }

  async function onSendCode() {
    setStatus("loading");
    setMessage(null);

    const fd = new FormData();
    fd.set("email", email);

    const res = await sendOtp(fd);
    if (!res.success) {
      setStatus("error");
      setMessage(res.message || "Failed to send code.");
      return;
    }

    setStatus("success");
    setMessage("Code sent. Enter the 6-digit code from your email.");
  }

  async function onVerifyCode() {
    setStatus("loading");
    setMessage(null);

    const fd = new FormData();
    fd.set("email", email);
    fd.set("token", token);

    const res = await verifyOtp(fd);
    if (!res.success) {
      setStatus("error");
      setMessage(res.message || "Invalid code.");
      return;
    }

    router.replace(next);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0f172a] p-8 rounded-xl shadow-lg border border-white/10">
        <h1 className="text-2xl font-semibold text-center mb-2">Sign in to Havenly</h1>

        {standalone ? (
          <div className="mb-4 p-3 rounded bg-emerald-900/30 text-emerald-200 text-sm">
            You’re in the installed app. On iPhone, the email link may open in Safari and not sign
            you into the installed app. Use the <span className="font-semibold">code</span> option
            below to sign in here.
          </div>
        ) : null}

        {message ? (
          <div
            className={`mb-4 p-3 rounded ${
              status === "success"
                ? "bg-emerald-900/40 text-emerald-300"
                : status === "error"
                ? "bg-red-900/40 text-red-300"
                : "bg-white/5 text-slate-200"
            }`}
          >
            {message}
          </div>
        ) : null}

        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium border ${
              mode === "code"
                ? "bg-white/10 border-white/20 text-white"
                : "bg-transparent border-white/10 text-slate-300"
            }`}
          >
            Code (best on iPhone)
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium border ${
              mode === "link"
                ? "bg-white/10 border-white/20 text-white"
                : "bg-transparent border-white/10 text-slate-300"
            }`}
          >
            Magic link
          </button>
        </div>

        <label className="block text-sm mb-2">Email address</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md px-3 py-2 mb-4 bg-black/20 border border-white/20 text-white"
        />

        {mode === "link" ? (
          <button
            type="button"
            onClick={onSendLink}
            disabled={status === "loading" || !email}
            className="w-full bg-emerald-400 hover:bg-emerald-500 text-black font-semibold py-2 rounded-md transition"
          >
            {status === "loading" ? "Sending..." : "Send Magic Link"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onSendCode}
              disabled={status === "loading" || !email}
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-black font-semibold py-2 rounded-md transition"
            >
              {status === "loading" ? "Sending..." : "Send Code"}
            </button>

            <div className="mt-4">
              <label className="block text-sm mb-2">6-digit code</label>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                inputMode="numeric"
                placeholder="123456"
                className="w-full rounded-md px-3 py-2 mb-3 bg-black/20 border border-white/20 text-white"
              />
              <button
                type="button"
                onClick={onVerifyCode}
                disabled={status === "loading" || !email || !token}
                className="w-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold py-2 rounded-md transition"
              >
                {status === "loading" ? "Verifying..." : "Verify & Sign in"}
              </button>
            </div>
          </>
        )}

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-blue-300 hover:underline">
            ← Back to Home
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-3">
          Desktop: magic link is fine. iPhone installed app: use code.
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
