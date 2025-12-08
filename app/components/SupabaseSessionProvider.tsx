"use client";

import { createBrowserClient } from "@supabase/ssr";
import { createContext, useContext, useEffect, useState } from "react";

type SupabaseContextType = {
  supabase: ReturnType<typeof createBrowserClient>;
  session: any;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export function SupabaseSessionProvider({
  initialSession,
  children,
}: {
  initialSession: any;
  children: React.ReactNode;
}) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState(initialSession);

  // CRITICAL: Heartbeat for session persistence
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);

      // IMPORTANT: Re-sync cookies with server
      await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
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
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("useSupabase must be inside a provider");
  return ctx;
}
