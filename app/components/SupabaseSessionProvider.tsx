"use client";

import { Session, SupabaseClient } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabaseClient } from "@/lib/supabase/client";

type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

/**
 * Provides a live Supabase client + session to the whole app.
 * - Fetches the current session on mount.
 * - Subscribes to auth changes (login / logout / token refresh).
 * - Ensures Navbar and other consumers update without manual refresh.
 */
export function SupabaseSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialSession() {
      try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (!isMounted) return;
        if (!error) {
          setSession(data.session ?? null);
        }
      } catch (err) {
        console.error("SupabaseSessionProvider getSession error:", err);
      }
    }

    loadInitialSession();

    const {
      data: authListener,
    } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      // Called on magic-link login, logout, refresh, etc.
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase: supabaseClient, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) {
    throw new Error("useSupabase must be used inside <SupabaseSessionProvider>");
  }
  return ctx;
}
