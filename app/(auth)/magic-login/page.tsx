"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser-client";

export default function MagicLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      },
    });

    if (!error) {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-xl mb-4">Get a secure login link</h2>

      {sent ? (
        <p className="text-green-400 max-w-md">
          A login link has been sent to {email}. Please check your inbox and open Havenly from there.
        </p>
      ) : (
        <form onSubmit={sendLink} className="flex flex-col gap-3 w-full max-w-sm">
          <input
            type="email"
            placeholder="you@example.com"
            className="px-3 py-2 rounded bg-gray-800 border border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded"
          >
            Send magic link
          </button>
        </form>
      )}

      <button
        onClick={() => router.push("/")}
        className="mt-6 text-sm underline"
      >
        Return to home
      </button>
    </div>
  );
}
