"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-3 py-1 rounded-md bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
    >
      Log out
    </button>
  );
}
