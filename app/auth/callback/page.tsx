// app/auth/callback/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function finishSignIn() {
      const supabase = supabaseClient;

      // Support both redirect_to and redirectTo, with a safe default
      const redirectTo =
        searchParams.get("redirect_to") ||
        searchParams.get("redirectTo") ||
        "/dashboard";

      const code = searchParams.get("code");

      try {
        // If we have a code from the magic link, exchange it for a session
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            console.error(
              "Callback exchangeCodeForSession error:",
              error.message
            );
            router.replace("/magic-login");
            return;
          }

          if (data.session) {
            router.replace(redirectTo);
            return;
          }
        }

        // Fallback: if no code or no session yet, just check the current session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Callback getSession error:", error.message);
          router.replace("/magic-login");
          return;
        }

        if (data.session) {
          router.replace(redirectTo);
        } else {
          router.replace("/magic-login");
        }
      } catch (err) {
        console.error("Callback unexpected error:", err);
        router.replace("/magic-login");
      }
    }

    finishSignIn();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="text-center text-slate-100">
        <p className="text-lg font-medium mb-2">Signing you in…</p>
        <p className="text-sm text-slate-300">
          Please wait a moment while we complete your login.
        </p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading…</div>}>
      <CallbackInner />
    </Suspense>
  );
}
