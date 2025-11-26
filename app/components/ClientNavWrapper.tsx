"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import Navbar from "./Navbar";
import type { User } from "@supabase/supabase-js";

export default function ClientNavWrapper() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setUser(session?.user ?? null);
    }
    load();
  }, []);

  return <Navbar user={user} />;
}
