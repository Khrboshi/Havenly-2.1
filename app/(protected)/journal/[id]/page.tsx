"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseSessionProvider";

export default function JournalEntryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session === null) {
      router.replace("/magic-login");
    }
  }, [session, router]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", session?.user?.id ?? "")
          .maybeSingle();

        if (!active) return;

        if (error) {
          console.error(error);
          setError("Unable to load this entry.");
          setLoading(false);
          return;
        }

        if (!data) {
          setError("Entry not found.");
          setLoading(false);
          return;
        }

        setEntry(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (active) {
          setError("Unexpected error loading the entry.");
          setLoading(false);
        }
      }
    }

    if (session?.user) load();

    return () => {
      active = false;
    };
  }, [supabase, params.id, session]);

  if (loading) {
    return <div className="px-4 py-10 text-slate-300">Loading your entry…</div>;
  }

  if (error) {
    return <div className="px-4 py-10 text-red-400">{error}</div>;
  }

  if (!entry) {
    return (
      <div className="px-4 py-10 text-slate-300">
        Entry could not be displayed.
      </div>
    );
  }

  const formatted = new Date(entry.created_at).toLocaleString();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 flex flex-col gap-8">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-semibold text-slate-100">
          {entry.title || "Untitled Entry"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{formatted}</p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
        <p className="whitespace-pre-wrap text-slate-200 text-[15px] leading-relaxed">
          {entry.content}
        </p>
      </section>

      {entry.reflection && (
        <section className="rounded-2xl border border-emerald-400/30 bg-slate-900/60 p-5">
          <h2 className="mb-2 text-sm font-semibold text-emerald-300">
            Havenly’s Reflection
          </h2>
          <p className="whitespace-pre-wrap text-slate-100 text-[15px] leading-relaxed">
            {entry.reflection}
          </p>
        </section>
      )}
    </div>
  );
}
TEST
