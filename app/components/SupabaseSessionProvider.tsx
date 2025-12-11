"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { createBrowserClient } from "@supabase/ssr";

export const SupabaseContext = createContext(null);

export function SupabaseSessionProvider({ initialSession, children }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState(initialSession);

  useEffect(() => {
    async function loadSession() {
      // THIS CALL IS CRITICAL — it triggers /api/auth/refresh.
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();

      setSession(activeSession);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  return useContext(SupabaseContext);
}
