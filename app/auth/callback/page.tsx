"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function finalize() {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error || !data?.session) {
        console.error("Final auth session missing", error);
        router.replace("/magic-login?error=session_missing");
        return;
      }

      router.replace("/dashboard");
    }

    finalize();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      Finalizing your login…
    </div>
  );
}
