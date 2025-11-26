"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

interface EntryData {
  id: string;
  created_at: string;
  content: string | null;
  mood: number | null;
  reflection: string | null;
}

export default function JournalEntryPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const entryId = params?.id as string;
  const shouldGenerate = searchParams?.get("reflect") === "1";

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [entry, setEntry] = useState<EntryData | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const { data } = await supabaseClient
        .from("journal_entries")
        .select("id, created_at, content, mood, reflection")
        .eq("id", entryId)
        .single();

      setEntry(data ?? null);
      setLoading(false);

      // Trigger reflection generation only once
      if (data && !data.reflection && shouldGenerate) {
        generateReflection(data.id, data.content, data.mood);
      }
    }

    load();
  }, [entryId, router, shouldGenerate]);

  async function generateReflection(id: string, content: string | null, mood: number | null) {
    if (!content) return;

    setGenerating(true);

    const response = await fetch("/api/reflect", {
      method: "POST",
      body: JSON.stringify({ entryId: id, content, mood }),
    });

    const result = await response.json();

    if (result.reflection) {
      setEntry((prev) => prev ? { ...prev, reflection: result.reflection } : prev);

      // remove ?reflect=1 from URL cleanly
      const cleanUrl = `/journal/${id}`;
      window.history.replaceState({}, "", cleanUrl);
    }

    setGenerating(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-20 text-center text-slate-300">
        Loading entry…
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-20 text-center text-slate-300">
        Entry not found.
      </div>
    );
  }

  const formattedDate = new Date(entry.created_at).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const moodEmoji =
    entry.mood === 1 ? "😔" :
    entry.mood === 2 ? "😕" :
    entry.mood === 3 ? "😐" :
    entry.mood === 4 ? "🙂" :
    entry.mood === 5 ? "😊" :
    "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-12 text-slate-200">
      {/* Header */}
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          Reflection from
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {formattedDate}
        </h1>

        {moodEmoji && (
          <p className="text-2xl mt-1" title={`Mood: ${entry.mood}/5`}>
            {moodEmoji}
          </p>
        )}
      </section>

      {/* Journal Content */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
        <p className="whitespace-pre-line text-slate-200 text-base leading-relaxed">
          {entry.content}
        </p>
      </section>

      {/* Reflection section */}
      {generating && (
        <section className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 animate-pulse">
          <div className="h-3 w-40 bg-emerald-800/40 rounded" />
          <div className="h-3 w-full bg-emerald-900/30 rounded" />
          <div className="h-3 w-5/6 bg-emerald-900/30 rounded" />
          <div className="h-3 w-3/4 bg-emerald-900/30 rounded" />
        </section>
      )}

      {entry.reflection && !generating && (
        <section className="space-y-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6">
          <p className="text-xs font-medium text-emerald-300 uppercase tracking-[0.18em]">
            Gentle reflection
          </p>
          <p className="whitespace-pre-line text-emerald-100 leading-relaxed text-base">
            {entry.reflection}
          </p>
        </section>
      )}

      {/* Navigation */}
      <section className="flex flex-wrap gap-4 pt-4">
        <Link
          href="/journal"
          className="rounded-full bg-slate-800 px-5 py-2 text-sm hover:bg-slate-700"
        >
          Back to journal history
        </Link>

        <Link
          href="/journal/new"
          className="rounded-full bg-emerald-400 px-5 py-2 text-sm text-slate-950 hover:bg-emerald-300"
        >
          Write a new reflection
        </Link>

        <Link
          href="/dashboard"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm hover:bg-slate-800"
        >
          Return to dashboard
        </Link>
      </section>

      {/* Privacy note */}
      <p className="pt-8 text-xs text-slate-500">
        Your reflections are personal and private — stored securely for your
        eyes only.
      </p>
    </div>
  );
}
