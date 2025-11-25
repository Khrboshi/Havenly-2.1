"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import Groq from "groq-sdk";

export default function NewJournalEntryPage() {
  const router = useRouter();

  const [mood, setMood] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [reflection, setReflection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

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

    // Save entry to database
    const { data, error } = await supabaseClient
      .from("journal_entries")
      .insert([
        {
          user_id: userId,
          mood,
          content,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving entry:", error);
      setSaving(false);
      return;
    }

    // Generate reflection using Groq AI
    try {
      const completion = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "You are a compassionate reflective assistant. Your responses should feel gentle, validating, and psychologically safe. Never give instructions — only reflections.",
          },
          {
            role: "user",
            content,
          },
        ],
      });

      const aiText =
        completion.choices[0]?.message?.content ??
        "Thank you for reflecting — it’s meaningful to pause and acknowledge your experience.";

      setReflection(aiText);
    } catch (err) {
      console.error("Reflection error:", err);
      setReflection(
        "Thank you for writing — even capturing a few thoughts is meaningful."
      );
    }

    setSaving(false);
    setCompleted(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-10 text-slate-200">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Today’s reflection
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl">
          Take a moment to check in with yourself. There is no right or wrong —
          just write what feels true for you right now.
        </p>
      </div>

      {/* Mood Selector */}
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

      {/* Writing Textarea */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.18em]">
          What’s on your mind?
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a few sentences about what stood out today — moments, emotions, conversations, decisions, small wins, frustrations…"
          className="w-full h-48 rounded-2xl bg-slate-950/60 border border-slate-800 p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-emerald-400 focus:outline-none resize-none"
        />
      </div>

      {/* Save Button */}
      {!completed && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || saving}
          className={`rounded-full px-6 py-3 text-sm font-semibold shadow-sm ${
            saving
              ? "bg-slate-700 text-slate-400"
              : "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
          }`}
        >
          {saving ? "Saving…" : "Save and reflect"}
        </button>
      )}

      {/* Reflection Output */}
      {reflection && (
        <div className="space-y-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
          <p className="text-xs font-medium text-emerald-300 uppercase tracking-[0.18em]">
            Gentle reflection
          </p>
          <p className="text-sm leading-relaxed text-emerald-100 whitespace-pre-line">
            {reflection}
          </p>
        </div>
      )}

      {/* Completion Options */}
      {completed && (
        <div className="space-y-4 pt-4">
          <p className="text-slate-300 text-sm">
            Thank you for checking in — it matters that you paused for yourself
            today.
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm hover:bg-slate-700"
            >
              Return to dashboard
            </button>

            <button
              type="button"
              onClick={() => router.push("/journal")}
              className="rounded-full bg-emerald-400 px-5 py-2 text-sm text-slate-950 hover:bg-emerald-300"
            >
              View journal history
            </button>
          </div>
        </div>
      )}

      {/* Privacy reassurance */}
      <p className="pt-8 text-xs text-slate-500 max-w-md">
        Your entries are private and stored securely. They are not used for ads,
        profiling, or shared with anyone.
      </p>
    </div>
  );
}
