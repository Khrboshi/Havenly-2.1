// app/(protected)/journal/[id]/JournalEntryPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseSessionProvider";
import JournalEntryClient from "./JournalEntryClient";

type JournalEntry = {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
};

type Reflection = {
  summary: string;
  corepattern?: string;
  themes: string[];
  emotions: string[];
  gentlenextstep: string;
  questions: string[];
};

export default function JournalEntryPageClient({ id }: { id: string }) {
  const { supabase } = useSupabase();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [initialReflection, setInitialReflection] = useState<Reflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        if (!cancelled) {
          setErrorMsg("Not authenticated. Please log in again.");
          setLoading(false);
        }
        return;
      }

      // ✅ FIX: added ai_response to the select so saved reflections are loaded
      const { data, error } = await supabase
        .from("journal_entries")
        .select("id,title,content,created_at,ai_response")
        .eq("id", id)
        .single();

      if (!cancelled) {
        if (error) {
          setErrorMsg(error.message);
          setEntry(null);
        } else {
          const { ai_response, ...entryFields } = data as any;
          setEntry(entryFields as JournalEntry);

          // ✅ FIX: parse and pass the saved reflection
          try {
            setInitialReflection(ai_response ? JSON.parse(ai_response) : null);
          } catch {
            setInitialReflection(null);
          }
        }
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase, id]);

  if (loading) return <div className="px-6 py-10 text-slate-300">Loading…</div>;

  if (errorMsg)
    return (
      <div className="px-6 py-10 text-red-300">
        Could not load entry: {errorMsg}
      </div>
    );

  if (!entry)
    return (
      <div className="px-6 py-10 text-slate-300">Entry not found.</div>
    );

  // ✅ FIX: now passes initialReflection (was missing entirely before)
  return <JournalEntryClient entry={entry} initialReflection={initialReflection} />;
}
