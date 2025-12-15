"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId?: string; // kept for compatibility with your current New page
};

export default function JournalForm({ userId }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string>("");

  const canSave = useMemo(() => {
    return status !== "saving" && content.trim().length > 0;
  }, [status, content]);

  async function handleSave() {
    setStatus("saving");
    setError("");

    try {
      const res = await fetch("/api/journal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim() || "",
          content: content.trim(),
          // userId is intentionally NOT sent; server derives user from session
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.error ||
          "Something went wrong. Please try again.";
        setStatus("error");
        setError(msg);
        return;
      }

      const journalId = data?.journal?.id;

      // Redirect to the saved entry to reinforce the habit loop
      if (journalId) {
        router.push(`/journal/${journalId}`);
      } else {
        // Fallback to journal list if id not returned for any reason
        router.push("/journal");
      }

      router.refresh();
    } catch (e) {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="w-full">
      <div className="mb-3">
        <div className="text-sm font-semibold text-slate-100">
          Write your thoughts
        </div>
        <div className="mt-2">
          {/* Optional title field (kept subtle; does not change your UI drastically) */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Optional title (e.g., A quick check-in)"
            className="w-full mb-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/40"
            aria-label="Title"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How are you feeling today?"
            className="w-full min-h-[180px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/40"
            aria-label="Journal content"
          />
        </div>

        {error ? (
          <div className="mt-2 text-sm text-red-400">{error}</div>
        ) : null}

        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className={[
            "mt-6 w-full rounded-xl px-4 py-4 font-semibold",
            "transition",
            canSave
              ? "bg-emerald-400 text-slate-900 hover:brightness-110"
              : "bg-emerald-400/40 text-slate-900/70 cursor-not-allowed",
          ].join(" ")}
        >
          {status === "saving" ? "Saving..." : "Save Entry"}
        </button>

        {/* This is intentionally minimal; monetization hooks belong on the entry page */}
        <div className="mt-2 text-xs text-slate-400">
          {userId ? null : null}
        </div>
      </div>
    </div>
  );
}
