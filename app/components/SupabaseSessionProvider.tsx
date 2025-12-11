"use client";

import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SupabaseContext = createContext(null);

export function SupabaseSessionProvider({ children, initialSession }) {
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [session, setSession] = useState(initialSession);

  useEffect(() => {
    // Keep client session synced
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

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
