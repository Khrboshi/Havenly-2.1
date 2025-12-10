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
   * Create browser Supabase client.
   * - PKCE enabled
   * - Cookie-based auth (storage: undefined)
   * - Persist session + auto refresh
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
            storage: undefined,
          },
        }
      ),
    []
  );

  const [session, setSession] = useState<any>(initialSession);

  /**
   * Hydrate session on mount.
   * If hydration fails (common after hard reload), trigger cookie refresh
   * and retry once.
   */
  useEffect(() => {
    let active = true;

    async function hydrate() {
      // First attempt
      const { data: initial } = await supabase.auth.getSession();
      if (active && initial?.session) {
        setSession(initial.session);
        return;
      }

      // Retry after refreshing cookies
      await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      const { data: retry } = await supabase.auth.getSession();
      if (active) {
        setSession(retry?.session ?? null);
      }
    }

    hydrate();
    return () => {
      active = false;
    };
  }, [supabase]);

  /**
   * Live auth state updates:
   * - SIGNED_OUT clears session immediately (NO cookie refresh)
   * - SIGNED_IN / TOKEN_REFRESHED sync cookies via /api/auth/refresh
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        return; // do not refresh cookies on logout
      }

      // Update local session
      setSession(currentSession);

      // Sync cookies for server-side access
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
