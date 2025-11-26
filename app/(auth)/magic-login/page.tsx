"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MagicLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const code = params.get("code");
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");

  useEffect(() => {
    // If URL has a code param, complete the login automatically
    if (code && status === "idle") {
      setStatus("processing");

      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            console.error("Magic link error:", error);
            setStatus("error");
            return;
          }

          router.replace("/dashboard");
        });
    }
  }, [code, status, supabase, router]);

  // UI States
  if (status === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Logging you in securely…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-3">
        Login link expired or invalid.
        <a href="/magic-login" className="underline">Request a new link</a>
      </div>
    );
  }

  // Default (no code in URL)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h1>Get a secure login link</h1>
      <p>Enter your email to receive a magic link.</p>
      {/* Your existing form stays here */}
    </div>
  );
}
