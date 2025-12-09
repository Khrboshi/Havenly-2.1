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
   * IMPORTANT:
   * Browser Supabase client with PKCE, cookie-based auth, and no localStorage.
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
            storage: undefined, // ensures cookie-based session handling
          },
        }
      ),
    []
  );

  const [session, setSession] = useState<any>(initialSession);

  /**
   * HYDRATE on first mount.
   * This ensures the browser session is recovered after refresh or navigation.
   */
  useEffect(() => {
    let active = true;

    async function hydrate() {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();

      if (active) {
        setSession(s ?? null);
      }
    }

    hydrate();
    return () => {
      active = false;
    };
  }, [supabase]);

  /**
   * FIXED:
   * onAuthStateChange now handles logout correctly.
   * Previously, logout triggered a refresh call → recreated a session → infinite loop.
   *
   * Now:
   * - SIGNED_OUT clears the session AND skips refresh.
   * - Other auth events refresh `/api/auth/refresh` to sync cookies.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === "SIGNED_OUT") {
        // Fully reset state — this is what fixes logout
        setSession(null);
        return; // critical: do NOT refresh cookies on logout
      }

      // Update session for SIGNED_IN / TOKEN_REFRESHED / PASSWORD_RECOVERY
      setSession(currentSession);

      // Sync session cookies for middleware, server, RLS, etc.
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
