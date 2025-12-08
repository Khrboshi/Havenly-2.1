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

/**
 * SupabaseSessionProvider
 *
 * Responsibilities:
 * - Create a single browser Supabase client.
 * - Bootstrap its session from the server-provided initialSession.
 * - On mount, explicitly call getSession() to hydrate from existing
 *   auth cookies/local storage (in case initialSession was null).
 * - Listen to onAuthStateChange and:
 *    - Update local session state.
 *    - Call /api/auth/refresh to keep server + middleware cookies in sync.
 */
export function SupabaseSessionProvider({
  initialSession = null,
  children,
}: Props) {
  // Create browser client once
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [session, setSession] = useState<any>(initialSession);

  // 1) On initial mount, ensure we hydrate from any existing session
  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (isMounted && currentSession) {
          setSession(currentSession);
        }
      } catch (err) {
        console.error("SupabaseSessionProvider.getSession error:", err);
      }
    }

    // If we didn't get a session from the server, or just to be safe,
    // hydrate from the browser.
    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // 2) Keep session + cookies in sync when auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);

      try {
        // This hits /api/auth/refresh which uses the middleware helper
        // to refresh auth cookies so server + middleware see the same user.
        await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("SupabaseSessionProvider.refresh error:", err);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

/**
 * Hook for any client component that needs Supabase + session.
 */
export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) {
    throw new Error("useSupabase must be used inside SupabaseSessionProvider");
  }
  return ctx;
}
