"use client";

import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await supabaseClient.auth.signOut();
      router.replace("/?loggedout=1");
      router.refresh();
    }
    doLogout();
  }, [router]);

  return (
    <p className="text-slate-400 mt-6">Logging you out…</p>
  );
}
