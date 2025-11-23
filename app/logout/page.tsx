"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      try {
        await fetch("/auth/logout");
      } catch (e) {
        console.error("Logout error", e);
      } finally {
        router.replace("/login?logged_out=1");
      }
    }

    doLogout();
  }, [router]);

  return (
    <div className="mt-8 text-sm text-slate-300">
      Signing you out… one last deep breath, then you&apos;re free to close this
      tab.
    </div>
  );
}
