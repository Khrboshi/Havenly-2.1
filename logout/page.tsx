"use client";

import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await supabaseClient.auth.signOut();
      router.replace("/?message=Hope to see you again soon!");
    }
    logout();
  }, [router]);

  return null;
}
