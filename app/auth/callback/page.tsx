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

      // Get session from Supabase
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Callback error:", error.message);
        router.replace("/magic-login");
        return;
      }

      // 100% correct return path
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";

      if (data.session) {
        router.replace(redirectTo);
      } else {
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
