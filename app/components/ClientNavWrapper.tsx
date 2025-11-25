"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Navbar from "./Navbar";

interface ClientNavWrapperProps {
  initialUser: User | null;
}

/**
 * Ensures Navbar updates after logout/login without manual refresh.
 * - Loads client-side session
 * - Falls back to initialUser from server
 */
export default function ClientNavWrapper({ initialUser }: ClientNavWrapperProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user: clientUser },
      } = await supabaseClient.auth.getUser();

      setUser(clientUser ?? null);
      setLoaded(true);
    }

    load();
  }, []);

  if (!loaded) return null;

  return <Navbar user={user} />;
}
