"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import Navbar from "./Navbar";
import type { User } from "@supabase/supabase-js";

interface Props {
  initialUser: User | null;
}

export default function ClientNavWrapper({ initialUser }: Props) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!hydrated) return null;

  return <Navbar user={user} />;
}
