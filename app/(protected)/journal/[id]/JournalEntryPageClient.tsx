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

export default function JournalEntryPageClient({ id }: { id: string }) {
  const { supabase } = useSupabase();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErrorMsg(null);

      // Ensure user session exists (so RLS works)
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        if (!cancelled) {
          setErrorMsg("Not authenticated. Please log in again.");
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("journal_entries")
        .select("id,title,content,created_at")
        .eq("id", id)
        .single();

      if (!cancelled) {
        if (error) {
          setErrorMsg(error.message);
          setEntry(null);
        } else {
          setEntry(data as JournalEntry);
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

  return <JournalEntryClient entry={entry} />;
}
