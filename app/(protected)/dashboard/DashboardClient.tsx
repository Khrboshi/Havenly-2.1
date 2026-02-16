"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSupabase } from "@/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

type DashboardClientProps = {
  userId: string;
};

type JournalEntry = {
  id: string;
  title: string | null;
  created_at: string;
};

function formatLocalDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

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

function buildNewEntryHref(params: { prompt?: string; title?: string; mood?: string }) {
  const qs = new URLSearchParams();
  if (params.prompt) qs.set("prompt", params.prompt);
  if (params.title) qs.set("title", params.title);
  if (params.mood) qs.set("mood", params.mood);
  const s = qs.toString();
  return s ? `/journal/new?${s}` : "/journal/new";
}

function isWithinLastDays(iso: string, days: number) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const ms = Date.now() - d.getTime();
  return ms <= days * 24 * 60 * 60 * 1000;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function diffDays(a: Date, b: Date) {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

function timeOfDayGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function lastCheckInLabel(latestIso?: string | null) {
  if (!latestIso) return "No check-ins yet";
  const d = new Date(latestIso);
  if (Number.isNaN(d.getTime())) return "Last check-in: recently";
  const daysAgo = diffDays(new Date(), d);
  if (daysAgo === 0) return "Last check-in: today";
  if (daysAgo === 1) return "Last check-in: yesterday";
  // e.g., "Last check-in: Tuesday"
  return `Last check-in: ${d.toLocaleDateString(undefined, { weekday: "long" })}`;
}

function GentlePromptCard({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          {subtitle ? (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          ) : null}
        </div>
        <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 group-hover:bg-white/10">
          Start
        </div>
      </div>
    </Link>
  );
}

export default function DashboardClient({ userId }: DashboardClientProps) {
  const { supabase } = useSupabase();
  const { planType, credits, loading: planLoading } = useUserPlan();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(true);

  // Writing is always allowed.
  const canWrite = true;

  // AI reflections gated.
  const canReflect =
    planType === "PREMIUM" || planType === "TRIAL" || (credits ?? 0) > 0;

  const readablePlan =
    planType === "PREMIUM" ? "Premium" : planType === "TRIAL" ? "Trial" : "Free";

  const latestEntry = useMemo(() => entries[0] ?? null, [entries]);
  const isFirstTime = !loadingEntries && entries.length === 0;

  // Gentle inquiry: primary “tone line” + cards
  const gentleLine = useMemo(() => {
    return isFirstTime
      ? "There’s no pressure here. Start with one honest sentence."
      : "Take a moment — what feels present for you right now?";
  }, [isFirstTime]);

  const primaryStartHref = useMemo(() => {
    // Default prompt for the big CTA (keeps it easy)
    const prompt = isFirstTime
      ? "In one sentence, what brought you here today?"
      : "Take a moment — what feels present for you right now?";
    return buildNewEntryHref({ prompt });
  }, [isFirstTime]);

  const promptCards = useMemo(() => {
    // Cards should be specific, low-effort, and emotionally safe.
    // They link into /journal/new using your query param prefill.
    const cards = [
      {
        title: "How is your body feeling right now?",
        subtitle: "Tension, calm, tired, restless — anything you notice.",
        href: buildNewEntryHref({
          prompt:
            "How is my body feeling right now?\n\nI notice…",
          title: "Body check-in",
        }),
      },
      {
        title: "What is one thing occupying your mind?",
        subtitle: "A thought, a worry, a hope — just one.",
        href: buildNewEntryHref({
          prompt:
            "One thing occupying my mind right now is…\n\nBecause…",
          title: "Mind check-in",
        }),
      },
      {
        title: "Just free write",
        subtitle: "No structure. No rules. Start anywhere.",
        href: buildNewEntryHref({
          prompt: "",
          title: "",
        }),
      },
    ];

    // First time: make the first card even easier.
    if (isFirstTime) {
      cards[1] = {
        title: "What brought you here today?",
        subtitle: "One sentence is enough.",
        href: buildNewEntryHref({
          prompt: "What brought me here today?\n\n",
          title: "First check-in",
        }),
      };
    }

    return cards;
  }, [isFirstTime]);

  // “Reflections” label (avoid “Credits: 0” anxiety)
  const reflectionsLabel = useMemo(() => {
    if (planType === "PREMIUM") return "Reflections: unlimited";
    if (planLoading) return "Reflections: …";
    if (canReflect) return `Reflections: ${credits ?? 0}`;
    return "Reflections: paused";
  }, [planLoading, planType, canReflect, credits]);

  const showReflectionsChip = planType !== "PREMIUM";
  const showReflectionsResetHint =
    planType !== "PREMIUM" && !planLoading && !canReflect;

  // Only one gentle “info” block when reflections are paused (NOT a warning bar)
  const showGentlePauseInfo =
    !planLoading && planType !== "PREMIUM" && !canReflect;

  const thisWeekCount = useMemo(() => {
    if (loadingEntries) return null;
    return entries.filter((e) => isWithinLastDays(e.created_at, 7)).length;
  }, [entries, loadingEntries]);

  const lastCheckIn = useMemo(() => {
    if (loadingEntries) return "…";
    return lastCheckInLabel(latestEntry?.created_at ?? null);
  }, [loadingEntries, latestEntry?.created_at]);

  const loadEntries = useCallback(async () => {
    setLoadingEntries(true);

    const { data, error } = await supabase
      .from("journal_entries")
      .select("id,title,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

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

  const greeting = useMemo(() => {
    const base = timeOfDayGreeting();
    if (loadingName) return base;
    return displayName ? `${base}, ${displayName}` : base;
  }, [displayName, loadingName]);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-slate-200">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

          <div className="text-sm text-slate-400">
            <span className="text-slate-100">{greeting}</span>
          </div>

          <p className="text-sm text-slate-400">{gentleLine}</p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Plan: <span className="text-slate-200">{readablePlan}</span>
            </span>

            {showReflectionsChip && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <span className="text-slate-200">{reflectionsLabel}</span>
              </span>
            )}

            {planType === "PREMIUM" && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Reflections: unlimited
              </span>
            )}
          </div>

          {showReflectionsResetHint && (
            <p className="text-xs text-slate-500">
              Reflections are resting for now. You can keep journaling freely.
            </p>
          )}
        </div>

        {/* Minimal CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          {latestEntry && (
            <Link
              href={`/journal/${latestEntry.id}`}
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Open last entry
            </Link>
          )}

          {canWrite && (
            <Link
              href={primaryStartHref}
              className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400"
            >
              Start writing
            </Link>
          )}
        </div>
      </div>

      {/* Gentle pause info (neutral, no “warning bar” vibe) */}
      {showGentlePauseInfo && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium text-slate-100">
            AI reflections are resting for now.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            You can still journal anytime. If you’d like reflections back immediately, you can upgrade.
          </p>

          <div className="mt-3">
            <Link
              href="/upgrade"
              className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              View Premium
            </Link>
          </div>
        </div>
      )}

      {/* Gentle Inquiry Cards */}
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">
          Gentle prompts
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {promptCards.map((c) => (
            <GentlePromptCard
              key={c.title}
              title={c.title}
              subtitle={c.subtitle}
              href={c.href}
            />
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">This week</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {loadingEntries ? "…" : `${thisWeekCount ?? 0} entries`}
          </p>
          <p className="mt-1 text-sm text-slate-400">A gentle measure of consistency</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Last check-in</p>
          <p className="mt-2 text-base font-semibold text-slate-100">{lastCheckIn}</p>
          <p className="mt-1 text-sm text-slate-400">
            {loadingEntries
              ? ""
              : latestEntry
              ? `“${titleOrUntitled(latestEntry.title)}”`
              : "Start whenever you’re ready."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Next step</p>

          <p className="mt-2 text-base font-semibold text-slate-100">
            {isFirstTime ? "Begin gently" : "Continue gently"}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Start with one sentence. You can always stop, save, or come back later.
          </p>

          <div className="mt-4">
            <Link
              href={primaryStartHref}
              className="inline-flex rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400"
            >
              Start writing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
