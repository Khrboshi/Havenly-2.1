"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  userId?: string;
};

function safeSlice(value: string, max: number) {
  const s = (value || "").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max) : s;
}

export default function JournalForm(_props: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "success">(
    "idle"
  );
  const [error, setError] = useState<string>("");

  const didInitRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const promptText = useMemo(() => {
    return safeSlice(searchParams.get("prompt") ?? "", 240);
  }, [searchParams]);

  useEffect(() => {
    if (didInitRef.current) return;

    const qpTitle = safeSlice(searchParams.get("title") ?? "", 120);
    const qpMood = safeSlice(searchParams.get("mood") ?? "", 32);

    const nextTitle = qpTitle || (qpMood ? `Mood: ${qpMood}` : "");

    setTitle((prev) => (prev.trim() ? prev : nextTitle));
    // IMPORTANT: do NOT prefill content with prompt (avoid saving prompt-only entries)

    didInitRef.current = true;

    // Focus the textarea for immediate writing
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [searchParams]);

  const canSave = useMemo(
    () => content.trim().length > 0 && status !== "saving",
    [content, status]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const contentTrimmed = content.trim();
    if (!contentTrimmed) {
      setStatus("error");
      setError("Please write a few words before saving.");
      return;
    }

    setStatus("saving");

    try {
      const res = await fetch("/api/journal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || null,
          content: contentTrimmed,
        }),
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setError(
          json?.error ||
            json?.message ||
            "Failed to save journal entry. Please try again."
        );
        return;
      }

      setStatus("success");

      const id = json?.id;
      if (id) {
        router.push(`/journal/${id}`);
        router.refresh();
        return;
      }

      router.push("/journal");
      router.refresh();
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="space-y-3">
        <div>
          <div className="text-sm font-medium text-white/80 mb-2">
            Write your thoughts
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Optional title (e.g., A quick check-in)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/20 focus:bg-white/[0.07]"
            maxLength={120}
          />

          {promptText ? (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <span className="text-slate-400">Prompt: </span>
              {promptText}
            </div>
          ) : null}

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={promptText || "How are you feeling today?"}
            className="mt-3 w-full min-h-[180px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/20 focus:bg-white/[0.07]"
          />
        </div>

        {status === "error" && <div className="text-sm text-red-400">{error}</div>}

        <button
          type="submit"
          disabled={!canSave}
          className="w-full rounded-xl bg-emerald-400/90 px-4 py-4 font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "saving" ? "Saving..." : "Save Entry"}
        </button>
      </div>
    </form>
  );
}
