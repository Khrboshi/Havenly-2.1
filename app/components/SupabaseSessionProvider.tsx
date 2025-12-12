"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js";

type SupabaseContextType = {
  supabase: ReturnType<typeof createBrowserClient>;
  session: Session | null;
  isReady: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

type Props = {
  initialSession?: Session | null;
  children: ReactNode;
};

export function SupabaseSessionProvider({
  initialSession = null,
  children,
}: Props) {
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [session, setSession] = useState<Session | null>(initialSession);
  const [isReady, setIsReady] = useState(false);

  /**
   * 1️⃣ Hydrate session on mount
   *    This guarantees correctness after:
   *    - hard refresh
   *    - magic link redirect
   *    - tab restore
   */
  useEffect(() => {
    let mounted = true;

    async function hydrateSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);
      setIsReady(true);
    }

    hydrateSession();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /**
   * 2️⃣ Listen for auth state changes
   *    Covers:
   *    - login
   *    - logout
   *    - token refresh
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * 3️⃣ Re-sync when tab regains focus
   *    Prevents stale sessions when user switches tabs
   */
  useEffect(() => {
    async function handleFocus() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [supabase]);

  const value = useMemo(
    () => ({
      supabase,
      session,
      isReady,
    }),
    [supabase, session, isReady]
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error(
      "useSupabase must be used within SupabaseSessionProvider"
    );
  }
  return context;
}
