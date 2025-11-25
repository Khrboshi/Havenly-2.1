"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase/client";
import Navbar from "./Navbar";

interface ClientNavWrapperProps {
  initialUser: User | null;
}

/**
 * Client-side wrapper for Navbar.
 *
 * Why it exists:
 * - The server layout passes the "initialUser" from Supabase cookies.
 * - On the client, we then:
 *   - fetch the fresh user via supabase.auth.getUser()
 *   - subscribe to auth state changes (login/logout)
 * So the navbar always matches the real auth state without manual refresh.
 */
export default function ClientNavWrapper({
  initialUser,
}: ClientNavWrapperProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const {
        data: { user: clientUser },
      } = await supabaseClient.auth.getUser();

      if (!isMounted) return;

      setUser(clientUser ?? null);
      setLoaded(true);
    }

    load();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Avoid flicker: don't show navbar until we've done at least one client check
  if (!loaded) return null;

  return <Navbar user={user} />;
}
