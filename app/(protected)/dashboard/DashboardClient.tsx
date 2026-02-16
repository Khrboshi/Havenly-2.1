"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSupabase } from "@/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

type DashboardClientProps = { userId: string };

type JournalEntry = {
  id: string;
  title: string | null;
  created_at: string;
};

function titleOrUntitled(title: string | null) {
  return title?.trim() ? title : "Untitled entry";
}

function friendlyNameFromUser(user: any): string | null {
  const md = user?.user_metadata ?? {};
  const candidates = [
    md.full_name,
    md.name,
    md.display_name,
    md.username,
    user?.email ? String(user.email).split("@")[0] : null,
  ].filter(Boolean);

  const raw = candidates[0] ? String(candidates[0]).trim() : "";
  if (!raw) return null;
  return raw.replace(/\s+/g, " ").slice(0, 24) || null;
}

function buildNewEntryHref(prompt: string) {
  const qs = new URLSearchParams();
  qs.set("prompt", prompt);
  return `/journal/new?${qs.toString()}`;
}

function startOfNextMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0, 0);
}

function formatResetLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isWithinLastDays(iso: string, days: number) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const ms = Date.now() - d.getTime();
  return ms <= days * 24 * 60 * 60 * 1000;
}

function greetingByLocalTime() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardClient({ userId }: DashboardClientProps) {
  const { supabase } = useSupabase();
  const { planType, credits, loading: planLoading } = useUserPlan();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(true);

  // Show insight preview once after save
  const [insightArmed, setInsightArmed] = useState(false);

  useEffect(() => {
    try {
      const v = sessionStorage.getItem("havenly:show_insight_preview");
      if (v) {
        setInsightArmed(true);
        sessionStorage.removeItem("havenly:show_insight_preview");
      }
    } catch {}
  }, []);

  const latestEntry = useMemo(() => entries[0] ?? null, [entries]);
  const isPremium = planType === "PREMIUM";

  const canReflect = isPremium || planType === "TRIAL" || (credits ?? 0) > 0;
  const reflectionsPaused = !planLoading && !canReflect && !isPremium;

  const resetDate = useMemo(() => startOfNextMonth(new Date()), []);
  const resetLabel = useMemo(() => formatResetLabel(resetDate), [resetDate]);

  const readablePlan =
    isPremium ? "Premium" : planType === "TRIAL" ? "Trial" : "Free";

  const promptCards = useMemo(
    () => [
      {
        title: "How is your body feeling right now?",
        sub: "Tension, calm, tired, restless — anything you notice.",
        prompt: "How is your body feeling right now?",
      },
      {
        title: "What is one thing occupying your mind?",
        sub: "One sentence is enough.",
        prompt: "What is one thing occupying your mind right now?",
      },
      {
        title: "Just free write",
        sub: "No structure. No rules. Start anywhere.",
        prompt: "Just free write. Start anywhere.",
      },
    ],
    []
  );

  const greetingLine = useMemo(() => {
    const who = displayName ? `, ${displayName}` : "";
    return `${greetingByLocalTime()}${who}`;
  }, [displayName]);

  const thisWeekCount = useMemo(() => {
    if (loadingEntries) return 0;
    return entries.filter((e) => isWithinLastDays(e.created_at, 7)).length;
  }, [entries, loadingEntries]);

  const weekDots = useMemo(() => {
    const total = 7;
    const filled = Math.min(thisWeekCount, total);
    return Array.from({ length: total }, (_, i) => i < filled);
  }, [thisWeekCount]);

  // --- Insight visibility rules (the important part) ---
  // Show insight if reflections are paused AND (just saved OR enough history)
  const hasEnoughForPattern = entries.length >= 3;
  const showInsightArea = reflectionsPaused && (insightArmed || hasEnoughForPattern);

  const showWeeklyPatternCard = showInsightArea && hasEnoughForPattern;
  const showFirstInsightCard = showInsightArea && !hasEnoughForPattern;

  const threadPrompt = useMemo(() => {
    if (!latestEntry) return "Take a moment — what feels present for you right now?";
    const t = titleOrUntitled(latestEntry.title);
    return `You wrote yesterday — “${t}”. Has anything softened today?`;
  }, [latestEntry]);

  const loadEntries = useCallback(async () => {
    setLoadingEntries(true);

    const { data, error } = await supabase
      .from("journal_entries")
      .select("id,title,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(8);

    if (!error) setEntries((data as JournalEntry[]) || []);
    setLoadingEntries(false);
  }, [supabase, userId]);

  const loadDisplayName = useCallback(async () => {
    setLoadingName(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setDisplayName(friendlyNameFromUser(data?.user));
    } finally {
      setLoadingName(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    loadDisplayName();
  }, [loadDisplayName]);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-slate-200">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

          <div className="text-sm text-slate-300">
            <span className="text-slate-100">
              {loadingName ? "Welcome" : greetingLine}
            </span>
          </div>

          <p className="text-sm text-slate-400">Choose a gentle prompt to begin.</p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Plan: <span className="text-slate-200">{readablePlan}</span>
            </span>

            {isPremium ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Reflections: <span className="text-slate-200">unlimited</span>
              </span>
            ) : reflectionsPaused ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Reflections:{" "}
                <span className="text-slate-200">
                  paused <span className="text-slate-400">(returns {resetLabel})</span>
                </span>
              </span>
            ) : (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Reflections:{" "}
                <span className="text-slate-200">
                  {planLoading ? "…" : credits ?? 0}
                </span>
              </span>
            )}
          </div>

          {reflectionsPaused && (
            <p className="text-xs text-slate-500">
              You can always write freely — reflections return {resetLabel}.
            </p>
          )}
        </div>

        {/* No header CTAs (avoid duplication with prompt cards) */}
        <div />
      </div>

      {/* Insight Area */}
      {(showWeeklyPatternCard || showFirstInsightCard) && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <h3 className="font-medium text-slate-100">
                  {showWeeklyPatternCard
                    ? "Weekly pattern detected"
                    : "Your first insight is waiting"}
                </h3>
              </div>

              {showWeeklyPatternCard ? (
                <p className="max-w-2xl text-sm text-slate-400">
                  We noticed a shift in your tone compared to last week. A recurring theme around{" "}
                  <span className="blur-sm bg-white/10 px-1 rounded text-transparent select-none">
                    energy drains
                  </span>{" "}
                  may be quietly affecting you.
                </p>
              ) : (
                <p className="max-w-2xl text-sm text-slate-400">
                  After <span className="text-slate-200">3 check-ins</span>, Havenly can start spotting
                  gentle patterns to help you find clarity.
                </p>
              )}

              <p className="text-xs text-slate-500">
                Preview only. Unlock to reveal the full insight — returns {resetLabel}.
              </p>
            </div>

            <Link
              href="/upgrade"
              className="shrink-0 inline-flex items-center justify-center rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-black hover:bg-emerald-400"
            >
              Unlock insight
            </Link>
          </div>
        </div>
      )}

      {/* Gentle Prompts */}
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Gentle prompts</p>

        <div className="grid gap-3 sm:grid-cols-3">
          {promptCards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-slate-100">{c.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{c.sub}</p>
                </div>

                <Link
                  href={buildNewEntryHref(c.prompt)}
                  className="shrink-0 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
                >
                  Start
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Snapshot cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* This week */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">This week</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {loadingEntries ? "…" : `${thisWeekCount} check-ins`}
          </p>

          <div className="mt-3 flex items-center gap-2">
            {weekDots.map((on, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full ${on ? "bg-emerald-400/90" : "bg-white/10"}`}
              />
            ))}
          </div>

          <p className="mt-2 text-sm text-slate-400">
            {loadingEntries
              ? ""
              : thisWeekCount >= 7
              ? "Your week is complete."
              : `${Math.max(0, 7 - thisWeekCount)} gentle check-ins left this week.`}
          </p>
        </div>

        {/* Thread */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Pick up the thread</p>

          <p className="mt-2 text-base font-semibold text-slate-100">
            {loadingEntries ? "Loading…" : latestEntry ? "Has anything softened today?" : "Start gently"}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            {loadingEntries
              ? ""
              : latestEntry
              ? threadPrompt
              : "Choose a prompt above — one honest sentence is enough."}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href={buildNewEntryHref(threadPrompt)}
              className="inline-flex rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400"
            >
              Update today
            </Link>

            {latestEntry && (
              <Link
                href={`/journal/${latestEntry.id}`}
                className="inline-flex rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                Open last entry
              </Link>
            )}
          </div>
        </div>

        {/* Premium nudge */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Your space</p>
          <p className="mt-2 text-base font-semibold text-slate-100">Private by default</p>
          <p className="mt-1 text-sm text-slate-400">
            Write freely. When you’re ready, Premium helps you notice patterns and find clarity.
          </p>

          <div className="mt-4">
            <Link
              href="/upgrade"
              className="inline-flex rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Explore Premium
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
