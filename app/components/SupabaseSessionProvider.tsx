"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
  loading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function syncSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!alive) return;

        if (error) {
          // Treat as logged out (and stop spinner)
          setSession(null);
          setLoading(false);
          return;
        }

        setSession(data.session ?? null);
        setLoading(false);
      } catch {
        if (!alive) return;
        setSession(null);
        setLoading(false);
      }
    }

    // Initial load
    syncSession();

    // Keep React state in sync with auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!alive) return;
      setSession(newSession ?? null);
      setLoading(false); // important: never get stuck in loading after auth events
    });

    // iOS/PWA reliability: re-check on resume / tab focus
    const onVis = () => {
      if (document.visibilityState === "visible") {
        syncSession();
      }
    };
    window.addEventListener("focus", syncSession);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      data.subscription.unsubscribe();
      window.removeEventListener("focus", syncSession);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("useSupabase must be used within SupabaseSessionProvider");
  return ctx;
}
