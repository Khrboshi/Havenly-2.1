"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      router.replace("/magic-login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-red-400 hover:text-red-300 transition"
    >
      Logout
    </button>
  );
}
