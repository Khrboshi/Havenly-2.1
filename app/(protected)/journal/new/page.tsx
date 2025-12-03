"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

export default function NewJournalPage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!session?.user) {
      setError("You need to be logged in to save a reflection.");
      return;
    }

    if (!content.trim()) {
      setError("Please write at least a few words.");
      return;
    }

    try {
      setIsSaving(true);

      const { data, error: insertError } = await supabase
        .from("journal_entries")
        .insert({
          user_id: session.user.id,
          content: content.trim(),
          title: title.trim() || null,
        })
        .select("id")
        .single();

      if (insertError || !data) {
        console.error(insertError);
        throw new Error(insertError?.message || "Could not save reflection.");
      }

      // Go to that entry’s detail page
      router.push(`/journal/${data.id}`);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong while saving.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-24 text-slate-200">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Today&apos;s reflection
      </h1>
      <p className="text-slate-400 mb-8 max-w-xl">
        Take a few minutes to write honestly about how you&apos;re doing.
        There&apos;s no right way—this is a gentle check-in just for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Optional title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            placeholder="A small headline for today (optional)"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Your reflection
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full rounded-xl bg-slate-900/60 border border-slate-800 px-4 py-3 text-sm text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            placeholder="What stood out about today? What felt heavy or light? What do you want to remember?"
          />
        </div>

        {error && (
          <p className="text-sm text-rose-400 bg-rose-900/20 border border-rose-700/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {isSaving ? "Saving…" : "Save reflection"}
        </button>

        <p className="mt-3 text-xs text-slate-500">
          Stored securely in your Havenly account. Cloud backup and cross-device
          sync will be available in the premium plans.
        </p>
      </form>
    </div>
  );
}
