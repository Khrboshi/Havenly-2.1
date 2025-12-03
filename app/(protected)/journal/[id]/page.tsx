"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

type JournalEntry = {
  id: string;
  created_at: string;
  title: string | null;
  content: string | null;
  ai_response: string | null;
};

export default function JournalEntryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id || !session?.user) return;

    async function loadEntry() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("journal_entries")
          .select("id, created_at, title, content, ai_response")
          .eq("id", params.id)
          .eq("user_id", session.user.id)
          .single();

        if (fetchError || !data) {
          console.error(fetchError);
          throw new Error("Could not find this reflection.");
        }

        setEntry(data);
      } catch (err: any) {
        setError(err.message ?? "Error loading reflection.");
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [params?.id, supabase, session]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 pt-24 pb-24 text-slate-200">
        <p className="text-sm text-slate-400">Loading reflection…</p>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="mx-auto max-w-3xl px-6 pt-24 pb-24 text-slate-200 space-y-4">
        <p className="text-sm text-rose-400">{error ?? "Reflection not found."}</p>
        <button
          onClick={() => router.push("/journal")}
          className="inline-flex rounded-full bg-slate-800 px-5 py-2 text-sm hover:bg-slate-700"
        >
          Back to journal
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-24 text-slate-200">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">
        Reflection from
      </p>
      <h1 className="text-2xl font-semibold text-slate-50 mb-2">
        {new Date(entry.created_at).toLocaleString()}
      </h1>

      {entry.title && (
        <p className="text-lg font-medium text-slate-100 mb-4">
          {entry.title}
        </p>
      )}

      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 mb-8">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
          {entry.content}
        </p>
      </div>

      {entry.ai_response && (
        <div className="rounded-xl bg-emerald-950/40 border border-emerald-700/40 p-6 mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-2">
            Gentle AI reflection
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-emerald-50">
            {entry.ai_response}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/journal"
          className="rounded-full bg-slate-800 px-5 py-2 text-sm hover:bg-slate-700"
        >
          Back to journal history
        </Link>
        <Link
          href="/journal/new"
          className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
        >
          Write a new reflection
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full bg-slate-800 px-5 py-2 text-sm hover:bg-slate-700"
        >
          Return to dashboard
        </Link>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Your reflections are stored privately in your Havenly account.
      </p>
    </div>
  );
}
