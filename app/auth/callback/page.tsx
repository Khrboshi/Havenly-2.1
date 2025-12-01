"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

/**
 * Auth callback page:
 * Triggered after the user clicks the magic link in the email.
 * Confirms Supabase session and redirects the user accordingly.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleAuthCallback() {
      // Use your existing browser Supabase client
      const supabase = supabaseClient;

      // Get the user session
      const { data, error } = await supabase.auth.getSession();

      // Default redirect is /dashboard unless specified
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";

      if (error) {
        console.error("Auth callback error:", error.message);
        router.replace("/magic-login");
        return;
      }

      if (data.session) {
        router.replace(redirectTo);
      } else {
        router.replace("/magic-login");
      }
    }

    handleAuthCallback();
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
