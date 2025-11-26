"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";

export default function Navbar() {
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getUser().then(({ data }) => {
        setUserEmail(data.user?.email ?? null);
      });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <nav className="w-full flex justify-between px-6 py-4 text-sm">
      <Link href="/">Havenly</Link>

      <div className="flex gap-4">
        {userEmail ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/journal">Journal</Link>
            <span>{userEmail}</span>
            <Link href="/logout">Log out</Link>
          </>
        ) : (
          <Link href="/magic-login">Start journaling free</Link>
        )}
      </div>
    </nav>
  );
}
