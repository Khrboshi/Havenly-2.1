"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

type JournalEntry = {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  reflection: string | null;
  created_at: string;
};

export default function JournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params?.id as string;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [reflectionDraft, setReflectionDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!entryId) return;

    async function loadEntry() {
      setLoading(true);
      setNotFound(false);

      const supabase = supabaseClient;

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const result = await supabase
        .from("journal_entries")
        .select("id,user_id,title,content,reflection,created_at")
        .eq("id", entryId)
        .eq("user_id", session.user.id)
        .limit(1)
        .single();

      if (result.error || !result.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const row = result.data as JournalEntry;

      setEntry(row);
      setReflectionDraft(row.reflection ?? "");
      setLoading(false);
    }

    loadEntry();
  }, [entryId]);

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Loading entry…
      </div>
    );
  }

  if (notFound || !entry) {
    return (
      <div className="p-6 text-red-400">
        This entry could not be found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <button
        onClick={() => router.push("/journal")}
        className="text-sm text-gray-400 hover:text-white transition"
      >
        ← Back to journal
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* User Reflection */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-2">Your reflection</h2>
          <p className="text-gray-300 whitespace-pre-wrap">
            {entry.content}
          </p>
        </div>

        {/* AI Reflection */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">AI reflection</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
              Gentle, non-judgmental
            </span>
          </div>

          <textarea
            value={reflectionDraft}
            onChange={(e) => setReflectionDraft(e.target.value)}
            placeholder="AI reflection will appear here…"
            className="w-full min-h-[140px] rounded-lg bg-black/30 border border-white/10 p-3 text-sm text-gray-200"
          />

          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition">
              Generate AI reflection
            </button>

            <button className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition">
              Save reflection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
