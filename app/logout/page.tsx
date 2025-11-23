"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function performLogout() {
      await supabase.auth.signOut();

      // Redirect with motivational toast
      router.push("/?logout=1");
      router.refresh();
    }

    performLogout();
  }, []);

  return (
    <div className="flex items-center justify-center h-[70vh] text-slate-400">
      Logging you out…
    </div>
  );
}
