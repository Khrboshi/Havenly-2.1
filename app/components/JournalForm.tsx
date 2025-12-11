"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JournalForm({ userId }: { userId: string }) {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/journal/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          content,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create journal entry");
      }

      const data = await res.json();

      // redirect to new entry
      router.push(`/journal/${data.id}`);
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Write your thoughts
        </label>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How are you feeling today?"
          required
          rows={8}
          className="w-full rounded-lg bg-slate-900 border border-slate-700 p-4 text-slate-100 resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-emerald-400 text-black font-semibold hover:bg-emerald-500 transition"
      >
        {loading ? "Saving..." : "Save Entry"}
      </button>
    </form>
  );
}
