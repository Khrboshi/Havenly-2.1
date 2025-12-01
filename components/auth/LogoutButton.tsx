// components/auth/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Just navigate to the /logout route we already have
    router.push("/logout");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-slate-600 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800/70 transition"
    >
      Log out
    </button>
  );
}
