"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import Navbar from "./Navbar";
import type { User } from "@supabase/supabase-js";

export default function ClientNavWrapper({ initialUser }: { initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const { data: { subscription } } =
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    setLoaded(true);

    return () => subscription.unsubscribe();
  }, []);

  if (!loaded) return null;

  return <Navbar user={user} />;
}
