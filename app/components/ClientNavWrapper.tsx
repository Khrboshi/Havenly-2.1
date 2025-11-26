"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import Navbar from "./Navbar";
import type { User } from "@supabase/supabase-js";

export default function ClientNavWrapper() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setUser(session?.user ?? null);

      // Listen to auth changes and update navbar
      const { data: listener } = supabaseClient.auth.onAuthStateChange(
        (_event, session) => setUser(session?.user ?? null)
      );

      return () => {
        listener.subscription.unsubscribe();
      };
    };

    load();
  }, []);

  return <Navbar user={user} />;
}
