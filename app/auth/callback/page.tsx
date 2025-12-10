// app/auth/callback/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function completeLogin() {
      const supabase = supabaseClient;

      // The final destination — ALWAYS dashboard for Havenly SaaS
      const redirectTo =
        searchParams.get("redirect_to") ||
        searchParams.get("redirectTo") ||
        "/dashboard";

      const code = searchParams.get("code");

      try {
        // Case 1: We have the magic link code → exchange for session
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error("exchangeCodeForSession error:", error.message);
            router.replace("/magic-login");
            return;
          }

          // SUCCESS → redirect immediately
          if (data.session) {
            router.replace(redirectTo);
            return;
          }
        }

        // Case 2: No code (user revisiting callback page) → check session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("getSession error:", sessionError.message);
          router.replace("/magic-login");
          return;
        }

        // If session exists → redirect
        if (sessionData.session) {
          router.replace(redirectTo);
          return;
        }

        // No session found at all → return user to login
        router.replace("/magic-login");
      } catch (err) {
        console.error("Unexpected callback error:", err);
        router.replace("/magic-login");
      }
    }

    completeLogin();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-hvn-bg text-hvn-text-primary">
      <div className="text-center">
        <p className="text-lg font-medium mb-2">Signing you in…</p>
        <p className="text-sm text-hvn-text-muted">
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
