"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";

export default function MagicLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"form" | "sent" | "verifying">("form");

  const supabase = createBrowserClient();

  // Handle magic link callback
  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      setStatus("verifying");

      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (error) {
            console.error("Magic link verification error:", error);
            setStatus("form");
            return;
          }

          router.replace("/dashboard");
        });
    }
  }, [searchParams, supabase, router]);

  // Send magic link email
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      console.error("Magic link send error:", error);
      return;
    }

    setStatus("sent");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center text-white">
      <h1 className="text-2xl font-semibold mb-4">Get a secure login link</h1>

      {status === "form" && (
        <>
          <p className="text-gray-300 mb-6">
            No password needed — we'll email you a one-time link to open your journal.
          </p>

          <form onSubmit={handleSend} className="w-full max-w-sm space-y-4">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-600 text-white"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-md bg-emerald-500 hover:bg-emerald-600 font-medium"
            >
              Send magic link
            </button>
          </form>
        </>
      )}

      {status === "sent" && (
        <p className="text-emerald-400 mt-4 max-w-md">
          A login link has been sent to {email}. Please check your inbox and open Havenly from there.
        </p>
      )}

      {status === "verifying" && (
        <p className="text-blue-400 mt-4">
          Verifying your secure login link… please wait…
        </p>
      )}

      <button
        className="mt-8 text-emerald-400 underline"
        onClick={() => router.push("/")}
      >
        Return to home
      </button>
    </div>
  );
}
