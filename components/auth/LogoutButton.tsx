"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    // Triggers the logout route you already have at (app/(auth)/logout/route.ts)
    const res = await fetch("/logout", { method: "GET" });

    // After logging out, redirect user home
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-300 hover:text-red-400 transition"
    >
      Log out
    </button>
  );
}
