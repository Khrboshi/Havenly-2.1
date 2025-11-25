"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { supabaseClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function ClientNavWrapper({
  initialUser,
}: {
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <Navbar user={user} />;
}
