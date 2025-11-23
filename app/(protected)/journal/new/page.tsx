"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const [mood, setMood] = useState<number>(3);
  const [content, setContent] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
    }

    load();
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;

    if (!content.trim()) {
      setError("Please write a short reflection for today.");
      return;
    }

    setError("");
    setLoading(true);
    setAiResponse(null);

    try {
      // Call AI reflection API
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mood }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate reflection.");
      }

      const reflection: string =
        data.aiResponse || "Thank you for sharing. I'm here with you.";
      setAiResponse(reflection);

      // Save entry to Supabase
      const { error: insertError } = await supabaseClient
        .from("journal_entries")
        .insert({
          user_id: userId,
          mood,
          content,
          ai_response: reflection,
        });

      if (insertError) {
        console.error(insertError);
        setError("Saved AI reflection, but failed to store the entry.");
      } else {
        // Optional: redirect to history
        // router.push("/journal");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Today&apos;s reflection</h1>
          <p className="text-sm text-slate-300">
            One mood slider, one short note. That&apos;s enough.
          </p>
        </div>
        <Link
          href="/journal"
          className="text-xs text-slate-400 hover:text-emerald-300"
        >
          View history
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs text-slate-300 flex justify-between">
            <span>How are you feeling right now?</span>
            <span className="text-emerald-300 font-medium">
              {mood} <span className="text-slate-500">/ 5</span>
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Low</span>
            <span>Okay</span>
            <span>High</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-300">
            What&apos;s on your mind?
          </label>
          <textarea
            rows={6}
            className="w-full rounded-2xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-400 resize-none"
            placeholder="Write a few sentences about what happened today, or what you're feeling right now."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 border border-red-500/30 bg-red-950/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Reflecting…" : "Save & get reflection"}
        </button>
      </form>

      {aiResponse && (
        <section className="mt-4 rounded-2xl border border-emerald-400/40 bg-slate-900/60 p-4 space-y-2">
          <p className="text-[11px] text-emerald-300 uppercase tracking-[0.2em]">
            Havenly reflection
          </p>
          <p className="text-xs text-slate-100 whitespace-pre-wrap">
            {aiResponse}
          </p>
        </section>
      )}
    </div>
  );
}
