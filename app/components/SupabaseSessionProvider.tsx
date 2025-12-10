// app/components/SupabaseSessionProvider.tsx
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
   * Single browser Supabase client.
   * We let Supabase handle session persistence with its default storage,
   * and we just enable PKCE + auto refresh.
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
            // NOTE: DO NOT set `storage` here – we want Supabase to use
            // its default persistent storage so sessions survive hard refresh.
          },
        }
      ),
    []
  );

  const [session, setSession] = useState<any>(initialSession);

  /**
   * HYDRATE on first mount.
   * This recovers the persisted session after refresh or direct navigation.
   */
  useEffect(() => {
    let active = true;

    async function hydrate() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting initial Supabase session:", error.message);
        if (active) setSession(null);
        return;
      }

      if (!active) return;
      setSession(data.session ?? null);
    }

    hydrate();

    return () => {
      active = false;
    };
  }, [supabase]);

  /**
   * Keep React state + cookies in sync with Supabase auth events.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === "SIGNED_OUT") {
        // Clear state on logout
        setSession(null);
      } else {
        // SIGNED_IN, TOKEN_REFRESHED, etc.
        setSession(currentSession);
      }

      // Best-effort cookie sync for middleware / server usage.
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
