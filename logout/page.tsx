"use client";

import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function runLogout() {
      // Clear Supabase session
      await supabaseClient.auth.signOut();

      // Redirect to home page
      router.replace("/");
      router.refresh();
    }

    runLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[60vh] text-slate-300">
      Logging you out…
    </div>
  );
}
