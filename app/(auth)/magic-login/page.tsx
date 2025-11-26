"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser-client";

export default function MagicLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"form" | "sent" | "processing" | "error">("form");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Handle magic link callback with ?code=
  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      const processMagicLink = async () => {
        setStatus("processing");
        const supabase = createBrowserClient();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Magic link error:", error);
          setStatus("error");
          return;
        }

        // Redirect to dashboard once authenticated
        router.push("/dashboard");
      };

      processMagicLink();
    }
  }, [searchParams, router]);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/magic-login`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setStatus("sent");
    }
  };

  // STATE RENDERING ------------------------------------------------

  if (status === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Authenticating…
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-white">
        <p>A login link has been sent to {email}. Check your inbox.</p>
        <a href="/" className="mt-4 underline">Return to home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-xl mb-6">Get a secure login link</h1>

      <form onSubmit={sendMagicLink} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded px-3 py-2 bg-gray-800 border border-gray-600"
          required
        />

        <button
          type="submit"
          className="bg-emerald-500 py-2 rounded font-medium"
        >
          Send magic link
        </button>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
      </form>

      <a href="/" className="mt-6 underline">Return to home</a>
    </div>
  );
}
