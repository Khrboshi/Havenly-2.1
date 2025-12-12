"use client";

import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseSessionProvider";

type Props = {
  onDone?: () => void;
  className?: string;
};

export default function LogoutButton({ onDone, className }: Props) {
  const router = useRouter();
  const { supabase } = useSupabase();

  async function handleLogout() {
    try {
      await supabase.auth.signOut();

      // Close mobile drawer if needed
      onDone?.();

      // Immediate client redirect
      router.replace("/magic-login?logged_out=1");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ??
        "nav-link rounded-md px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-400/10"
      }
    >
      Logout
    </button>
  );
}
