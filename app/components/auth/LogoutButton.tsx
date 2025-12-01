"use client";

import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

/**
 * Small client-side logout button.
 * Signs the user out in Supabase and returns them to the home page.
 */
export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await supabaseClient.auth.signOut();
      // Send user back to the marketing home
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if something goes wrong, send them home
      router.push("/");
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-xs sm:text-sm px-3 py-1 rounded-full border border-slate-600/70 text-slate-200 hover:bg-slate-800/80 hover:border-slate-400 transition"
    >
      Log out
    </button>
  );
}
