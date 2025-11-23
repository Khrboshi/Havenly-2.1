"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [mood, setMood] = useState(3);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function checkUser() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user && isMounted) {
        router.replace("/login");
      }
    }

    checkUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      let aiResponse: string | null = null;

      try {
        const res = await fetch("/api/reflect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, mood }),
        });

        if (res.ok) {
          const data = await res.json();
          aiResponse = data.aiResponse ?? null;
        }
      } catch (err) {
        console.error("AI reflection error:", err);
      }

      const { error: insertError } = await supabaseClient
        .from("journal_entries")
        .insert({
          user_id: user.id,
          mood,
          content,
          ai_response: aiResponse,
        });

      if (insertError) {
        console.error(insertError);
        setError("Could not save your reflection. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/journal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Today&apos;s reflection</h1>
      <p className="text-sm text-slate-300">
        Take a moment to notice how you&apos;re feeling and what&apos;s on your
        mind.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-slate-300">
            How is your overall mood?
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={5}
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-emerald-300">
              {mood}
              <span className="text-slate-500">/5</span>
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-300">
            What would you like to put into words?
          </label>
          <textarea
            required
            rows={6}
            className="w-full rounded-2xl bg-slate-900/70 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-400 resize-none"
            placeholder="You can write freely about your day, what felt heavy or meaningful, or anything that you’d like to process."
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
          className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving and reflecting…" : "Save & get reflection"}
        </button>
      </form>
    </div>
  );
}
