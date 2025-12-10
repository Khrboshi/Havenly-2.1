"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

export default function NewJournalEntryPage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit() {
    if (!session?.user?.id) {
      setErrorMsg("You must be logged in to create an entry.");
      return;
    }

    if (!content.trim()) {
      setErrorMsg("Write something first.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      // SAFEST FIX: avoid generics entirely and force TS to accept runtime shape.
      const payload: any = {
        user_id: session.user.id,
        title: title.trim() || null,
        content: content.trim(),
      };

      const { data, error: insertError } = await supabase
        .from("journal_entries")
        // We cast to "any" to prevent TS from treating rows as `never`
        .insert([payload] as any)
        .select()
        .maybeSingle();

      if (insertError) {
        console.error("Insert error:", insertError);
        setErrorMsg("We couldn’t save your entry. Please try again.");
        setSaving(false);
        return;
      }

      if (!data?.id) {
        setErrorMsg("Unexpected error: no entry ID returned.");
        setSaving(false);
        return;
      }

      // Redirect to the new entry page
      router.push(`/journal/${data.id}`);
    } catch (err) {
      console.error("Unexpected insert error:", err);
      setErrorMsg("Something went wrong while saving.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:py-10">
      <h1 className="text-lg font-semibold text-slate-100">New entry</h1>

      <input
        type="text"
        placeholder="Title (optional)"
        className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Write what's on your mind…"
        className="min-h-[220px] rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {errorMsg && <p className="text-sm text-rose-300">{errorMsg}</p>}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="inline-flex w-fit items-center rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save entry"}
      </button>
    </div>
  );
}
