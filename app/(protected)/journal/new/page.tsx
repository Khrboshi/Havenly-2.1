"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function NewJournalEntryPage() {
  const router = useRouter();

  const [mood, setMood] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session?.user) {
        router.replace("/login");
        return;
      }
      setUserId(session.user.id);
    }
    checkAuth();
  }, [router]);

  async function handleSubmit() {
    if (!userId || !content.trim()) return;

    setSaving(true);

    const { data, error } = await supabaseClient
      .from("journal_entries")
      .insert([
        {
          user_id: userId,
          mood,
          content: content.trim(),
        },
      ])
      .select()
      .single();

    setSaving(false);

    if (error || !data) {
      console.error("Error saving entry:", error);
      return;
    }

    // Redirect to entry page and trigger reflection there
    router.replace(`/journal/${data.id}?reflect=1`);
  }

  const canSubmit = content.trim().length > 0 && !saving;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-10 text-slate-200">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Today’s reflection
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl">
          Take a moment to check in. There is no right or wrong — just write
          what feels true for you right now.
        </p>
      </div>

      {/* Mood selector */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.18em]">
          How are you feeling today?
        </p>

        <div className="flex gap-4 text-3xl">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMood(value)}
              className={`transition transform ${
                mood === value
                  ? "scale-110"
                  : "opacity-50 hover:opacity-80 hover:scale-105"
              }`}
            >
              {value === 1 && "😔"}
              {value === 2 && "😕"}
              {value === 3 && "😐"}
              {value === 4 && "🙂"}
              {value === 5 && "😊"}
            </button>
          ))}
        </div>
      </div>

      {/* Writing input */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.18em]">
          What’s on your mind?
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a few sentences about what stood out today — moments, emotions, conversations, decisions, frustrations, small wins…"
          className="w-full h-48 rounded-2xl bg-slate-950/60 border border-slate-800 p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-emerald-400 focus:outline-none resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`rounded-full px-6 py-3 text-sm font-semibold shadow-sm ${
          canSubmit
            ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
            : "bg-slate-700 text-slate-500 cursor-not-allowed"
        }`}
      >
        {saving ? "Saving…" : "Save entry"}
      </button>

      {/* Privacy reassurance */}
      <p className="pt-8 text-xs text-slate-500 max-w-md">
        Your entries are private and stored securely. They are not used for ads,
        profiling, or shared with anyone.
      </p>
    </div>
  );
}
