"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { useRouter, useParams } from "next/navigation";

export default function JournalEntryPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const params = useParams();

  const journalId = params.id as string;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("journal_entries")
        .select("content")
        .eq("id", journalId)
        .maybeSingle();

      if (data?.content) setContent(data.content);
      setLoading(false);
    }

    load();
  }, [supabase, journalId]);

  async function save() {
    setSaving(true);
    await fetch("/api/journal/update-reflection", {
      method: "POST",
      body: JSON.stringify({
        id: journalId,
        content,
      }),
    });
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="text-slate-400 text-sm border border-slate-800 rounded-xl bg-slate-900/60 p-6">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-slate-400 hover:text-slate-200"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold text-slate-100">Reflection</h1>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[300px] rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200 focus:ring-1 focus:ring-emerald-400 outline-none"
      />

      <button
        onClick={save}
        disabled={saving}
        className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-400 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
