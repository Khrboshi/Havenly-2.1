"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await supabaseClient.auth.signOut();

      // absolute guaranteed refresh + redirect
      router.replace("/login?logged_out=1");
      window.location.reload(); 
    }

    doLogout();
  }, [router]);

  return (
    <div className="flex h-40 items-center justify-center text-slate-400">
      Logging you out…
    </div>
  );
}
