"use client";

import { useState } from "react";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { useRouter } from "next/navigation";

export default function NewJournalEntryPage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!session?.user) return;

    setIsSaving(true);

    // ======================================================
    // HARD OVERRIDE ALL STRICT TYPING FOR THIS OPERATION
    // ======================================================
    const client: any = supabase;

    const { data, error: insertError } = await client
      .from("journal_entries")
      .insert({
        user_id: session.user.id,
        content,
        title,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      setIsSaving(false);
      return;
    }

    router.push(`/journal/${data.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl pt-24 px-6 text-slate-200">
      <h1 className="text-2xl font-semibold mb-4">New Reflection</h1>

      <input
        className="w-full mb-4 p-3 rounded bg-slate-900 border border-slate-700"
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full min-h-[200px] p-3 rounded bg-slate-900 border border-slate-700"
        placeholder="Write anything that’s on your mind…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-6 px-6 py-3 rounded-full bg-emerald-400 text-slate-900 text-sm font-semibold hover:bg-emerald-300 disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Save reflection"}
      </button>
    </div>
  );
}
