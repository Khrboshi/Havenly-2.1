"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import Navbar from "./Navbar";
import type { User } from "@supabase/supabase-js";

export default function ClientNavWrapper() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      setUser(session?.user ?? null);
      setLoaded(true);
    }

    load();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!loaded) return null;

  return <Navbar user={user} />;
}
