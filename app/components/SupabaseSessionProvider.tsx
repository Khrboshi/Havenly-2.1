"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase/client";

type SupabaseContextValue = {
  supabase: SupabaseClient;
  session: Session | null;
};

const SupabaseContext = createContext<SupabaseContextValue | undefined>(
  undefined
);

/**
 * Provides a live Supabase client + session to all client components.
 * - Loads initial session on mount.
 * - Subscribes to auth changes (magic link, logout, refresh).
 * - Ensures Navbar and other consumers update instantly without manual refresh.
 */
export function SupabaseSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (cancelled) return;
        if (!error) {
          setSession(data.session ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("SupabaseSessionProvider getSession error:", err);
        }
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      if (cancelled) return;
      setSession(newSession ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
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
    throw new Error(
      "useSupabase must be used within SupabaseSessionProvider"
    );
  }
  return ctx;
}
