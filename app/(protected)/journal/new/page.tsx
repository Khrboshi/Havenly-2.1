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
      // Safe payload because DB types are not generated
      const payload: any = {
        user_id: session.user.id,
        title: title.trim() || null,
        content: content.trim(),
      };

      const response = await supabase
        .from("journal_entries")
        .insert([payload] as any)
        .select()
        .maybeSingle();

      const data: any = response?.data ?? null;
      const insertError = response?.error ?? null;

      if (insertError) {
        console.error("Insert error:", insertError);
        setErrorMsg("We couldn’t save your entry. Please try again.");
        setSaving(false);
        return;
      }

      // Runtime-only check — TypeScript safe & consistent
      if (!data || !data.id) {
        setErrorMsg("Unexpected error: missing entry ID.");
        setSaving(false);
        return;
      }

      // Redirect to the created entry
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
