"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Navbar from "./Navbar";

export default function ClientNavWrapper({
  initialUser,
}: {
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <Navbar />;
}
