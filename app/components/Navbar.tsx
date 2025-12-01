"use client";

import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  // Detect logged-in user on the client
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
  }, []);

  return (
    <header className="w-full border-b border-slate-800/40 bg-slate-900/40 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        
        {/* Left side: Brand */}
        <Link href="/" className="text-xl font-semibold tracking-tight text-white">
          Havenly
        </Link>

        {/* Center navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <Link href="/">Home</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link href="/tools">Tools</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 text-sm">

          {/* Always visible */}
          <Link href="/upgrade" className="text-emerald-400 font-medium">
            Upgrade
          </Link>

          {/* Show logout if logged in */}
          {user && <LogoutButton />}

          {/* Show login if logged out */}
          {!user && (
            <Link href="/magic-login" className="text-slate-300 hover:text-white">
              Log in
            </Link>
          )}
        </div>

      </nav>
    </header>
  );
}
