"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [mood, setMood] = useState(3);
  const [content, setContent] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
    }

    checkUser();
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setAiResponse(null);

    if (!userId) {
      setError("Not authenticated.");
      return;
    }

    if (!content.trim()) {
      setError("Write at least one sentence about your day.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mood }),
      });

      if (!res.ok) {
        throw new Error("AI reflection failed");
      }

      const data = await res.json();
      const reflection: string = data.aiResponse || "";
      setAiResponse(reflection);

      const title =
        content.split(".")[0]?.slice(0, 80) || "Untitled reflection";

      const { error: insertError } = await supabaseClient
        .from("journal_entries")
        .insert({
          user_id: userId,
          mood,
          content,
          title,
          ai_response: reflection,
        });

      if (insertError) {
        console.error(insertError);
        setError("Saved partially. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong generating your reflection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-4 space-y-5">
      <section className="space-y-1">
        <h1 className="text-xl font-semibold">Today&apos;s reflection</h1>
        <p className="text-sm text-slate-300">
          Pick your mood, write a short note, and let Havenly respond.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-slate-300 flex justify-between">
            <span>How are you feeling right now?</span>
            <span className="text-[10px] text-slate-400">
              1 = low · 5 = high
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-300">
            Mood:{" "}
            <span className="font-semibold text-emerald-300">{mood}/5</span>
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-300">
            What&apos;s on your mind?
          </label>
          <textarea
            className="w-full min-h-[160px] rounded-2xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            placeholder="Describe your day, a moment, a worry, or something you're grateful for."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 border border-red-500/40 bg-red-950/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving and reflecting…" : "Save & get reflection"}
        </button>
      </form>

      {aiResponse && (
        <section className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
            Havenly reflection
          </p>
          <div className="rounded-2xl border border-emerald-400/50 bg-emerald-950/20 p-4 text-sm text-emerald-100 whitespace-pre-wrap">
            {aiResponse}
          </div>
        </section>
      )}
    </div>
  );
}
