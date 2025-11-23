"use client";

import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await supabaseClient.auth.signOut();
      router.push("/login?msg=logout-success");
      router.refresh(); // ensures UI updates
    }
    doLogout();
  }, [router]);

  return null; // nothing visible
}
