"use client";

import { createBrowserClient } from "@supabase/ssr";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";

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
  children: ReactNode;
}) {
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
    // 1. ALWAYS refresh the session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setSession(data.session);
    });

    // 2. Listen for token refresh events continuously
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
          setSession(newSession);
        }

        if (event === "SIGNED_OUT") {
          setSession(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("SupabaseContext missing");
  return ctx;
}
