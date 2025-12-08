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
 * Creates the client-side Supabase client.
 * Hydrates from any existing auth cookie or local session.
 * Ensures session + cookies stay synced (middleware/server stay aligned).
 */
export function SupabaseSessionProvider({
  initialSession = null,
  children,
}: Props) {
  // Create Supabase browser client once
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            persistSession: true,
            detectSessionInUrl: true,
            autoRefreshToken: true,
            flowType: "pkce",
            storage: undefined, // required for SSR consistency
          },
        }
      ),
    []
  );

  const [session, setSession] = useState<any>(initialSession);

  // 1) On mount → hydrate session from cookies/local storage
  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (active && currentSession) {
          setSession(currentSession);
        }
      } catch (err) {
        console.error("SupabaseSessionProvider.getSession error:", err);
      }
    }

    hydrate();
    return () => {
      active = false;
    };
  }, [supabase]);

  // 2) Listen for Supabase auth changes → sync cookie using API route
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);

      try {
        // Refresh server-side + middleware cookies
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

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) {
    throw new Error("useSupabase must be used inside SupabaseSessionProvider");
  }
  return ctx;
}
