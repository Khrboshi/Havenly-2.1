"use client";

import { createBrowserClient } from "@supabase/ssr";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SupabaseContextType = {
  supabase: ReturnType<typeof createBrowserClient>;
  session: any;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

type Props = {
  initialSession?: any;
  children: ReactNode;
};

export function SupabaseSessionProvider({
  initialSession = null,
  children,
}: Props) {
  /**
   * FIXED:
   * Create browser client WITH correct PKCE settings + persistent cookie storage.
   */
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: "pkce",
            storage: undefined, // use browser cookies instead of localStorage
          },
        }
      ),
    []
  );

  const [session, setSession] = useState<any>(initialSession);

  /**
   * FIXED:
   * On mount, hydrate session from cookies + Supabase storage.
   */
  useEffect(() => {
    let active = true;

    async function hydrate() {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();

      if (active && s) {
        setSession(s);
      }
    }

    hydrate();
    return () => {
      active = false;
    };
  }, [supabase]);

  /**
   * FIXED:
   * Whenever session changes → refresh cookies so middleware stays synced.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);

      try {
        await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Cookie refresh failed:", err);
      }
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
  if (!ctx) {
    throw new Error("useSupabase must be used inside SupabaseSessionProvider");
  }
  return ctx;
}
