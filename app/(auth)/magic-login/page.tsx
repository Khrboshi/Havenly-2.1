"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser-client";

export default function MagicLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "verifying" | "done" | "error">("idle");

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) return;

    async function verifyMagicLink() {
      setStatus("verifying");

      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.verifyOtp({
        type: "magiclink",
        token_hash: code,
      });

      if (error) {
        setStatus("error");
        return;
      }

      setStatus("done");
      router.push("/dashboard");
    }

    verifyMagicLink();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      {status === "verifying" && <p>Verifying your secure login link…</p>}
      {status === "done" && <p>Redirecting to your journal…</p>}
      {status === "error" && (
        <p className="text-red-400">
          Your link has expired or is invalid. Request a new login link.
        </p>
      )}
      {status === "idle" && (
        <>
          <h1 className="text-2xl mb-4">Get a secure login link</h1>
          <p>No password needed — check your inbox for your magic link.</p>
        </>
      )}
    </div>
  );
}
