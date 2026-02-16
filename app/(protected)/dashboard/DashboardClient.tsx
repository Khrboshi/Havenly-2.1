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
          {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
        </div>
        <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 group-hover:bg-white/10">
          Start
        </div>
      </div>
    </Link>
  );
}

function HiddenPatternCard({ resetHint }: { resetHint?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-200">
            <span className="text-lg" aria-hidden>
              ✨
            </span>
            <h3 className="font-medium">Weekly pattern detected</h3>
          </div>

          <div className="max-w-xl text-sm text-slate-400">
            <p>
              We noticed a shift in your tone compared to last week. A recurring theme around{" "}
              <span className="inline-block rounded bg-white/10 px-1 blur-sm text-transparent select-none">
                energy drain
              </span>{" "}
              may be quietly affecting you.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            (Preview only. Unlock to reveal the full insight.)
            {resetHint ? <span className="ml-2">{resetHint}</span> : null}
          </p>
        </div>

        <Link
          href="/upgrade"
          className="shrink-0 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400 text-center"
        >
          Unlock insight
        </Link>
      </div>
    </div>
  );
}

function ReflectionsRestingCard({ resetHint }: { resetHint?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-100">Reflections are resting for now</p>
          <p className="text-sm text-slate-400">
            You can write freely anytime. Premium unlocks deeper reflections when you want them.
          </p>
          {resetHint ? <p className="text-xs text-slate-500">{resetHint}</p> : null}
        </div>

        <Link
          href="/upgrade"
          className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10 text-center"
        >
          View Premium
        </Link>
      </div>
    </div>
  );
}

function LastCheckInCard({
  latestEntry,
  loadingEntries,
}: {
  latestEntry: JournalEntry | null;
  loadingEntries: boolean;
}) {
  const label = useMemo(() => {
    if (loadingEntries) return "…";
    return lastCheckInLabel(latestEntry?.created_at ?? null);
  }, [loadingEntries, latestEntry?.created_at]);

  if (loadingEntries) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-wide text-slate-400">Last check-in</p>
        <p className="mt-2 text-base font-semibold text-slate-100">…</p>
        <p className="mt-1 text-sm text-slate-400" />
      </div>
    );
  }

  if (!latestEntry) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-wide text-slate-400">Last check-in</p>
        <p className="mt-2 text-base font-semibold text-slate-100">{label}</p>
        <p className="mt-1 text-sm text-slate-400">Start whenever you’re ready.</p>
      </div>
    );
  }

  return (
    <Link
      href={`/journal/${latestEntry.id}`}
      className="block rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">Last check-in</p>
      <p className="mt-2 text-base font-semibold text-slate-100">{label}</p>
      <p className="mt-1 text-sm text-slate-400">“{titleOrUntitled(latestEntry.title)}”</p>
      <div className="mt-4 inline-flex rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-white/10">
        Open
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

  const latestEntry = useMemo(() => entries[0] ?? null, [entries]);
  const isFirstTime = !loadingEntries && entries.length === 0;

  const canReflect =
    planType === "PREMIUM" || planType === "TRIAL" || (credits ?? 0) > 0;

  const readablePlan =
    planType === "PREMIUM" ? "Premium" : planType === "TRIAL" ? "Trial" : "Free";

  const reflectionsPaused =
    !planLoading && planType !== "PREMIUM" && planType !== "TRIAL" && !canReflect;

  // Safe hint (doesn't require new data fields)
  const resetHint = reflectionsPaused ? "Resets next month." : undefined;

  const showHiddenPattern = reflectionsPaused && !isFirstTime;
  const showRestingCard = reflectionsPaused && isFirstTime;

  const greeting = useMemo(() => {
    const base = timeOfDayGreeting();
    if (loadingName) return base;
    return displayName ? `${base}, ${displayName}` : base;
  }, [displayName, loadingName]);

  const reflectionsLabel = useMemo(() => {
    if (planType === "PREMIUM") return "Reflections: unlimited";
    if (planType === "TRIAL") return "Reflections: unlimited";
    if (planLoading) return "Reflections: …";
    if (canReflect) return `Reflections: ${credits ?? 0}`;
    return "Reflections: paused (resets next month)";
  }, [planLoading, planType, canReflect, credits]);

  const thisWeekCount = useMemo(() => {
    if (loadingEntries) return null;
    return entries.filter((e) => isWithinLastDays(e.created_at, 7)).length;
  }, [entries, loadingEntries]);

  const promptCards = useMemo(() => {
    return [
      {
        title: "How is your body feeling right now?",
        subtitle: "Tension, calm, tired, restless — anything you notice.",
        href: buildNewEntryHref({
          prompt: "How is my body feeling right now?\n\nI notice…",
          title: "Body check-in",
        }),
      },
      {
        title: isFirstTime ? "What brought you here today?" : "What is one thing occupying your mind?",
        subtitle: "One sentence is enough.",
        href: buildNewEntryHref({
          prompt: isFirstTime
            ? "What brought me here today?\n\n"
            : "One thing occupying my mind right now is…\n\nBecause…",
          title: isFirstTime ? "First check-in" : "Mind check-in",
        }),
      },
      {
        title: "Just free write",
        subtitle: "No structure. No rules. Start anywhere.",
        href: buildNewEntryHref({}),
      },
    ];
  }, [isFirstTime]);

  const loadEntries = useCallback(async () => {
    setLoadingEntries(true);
    const { data, error } = await supabase
      .from("journal_entries")
      .select("id,title,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

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

          <div className="text-sm text-slate-400">
            <span className="text-slate-100">{greeting}</span>
          </div>

          <p className="text-sm text-slate-400">Choose a gentle prompt to begin.</p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Plan: <span className="text-slate-200">{readablePlan}</span>
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="text-slate-200">{reflectionsLabel}</span>
            </span>
          </div>

          {reflectionsPaused && (
            <p className="text-xs text-slate-500">
              You can keep journaling anytime. {resetHint}
            </p>
          )}
        </div>
      </div>

      {/* Upsell (state-based) */}
      {(showHiddenPattern || showRestingCard) && (
        <div className="mb-8">
          {showHiddenPattern ? <HiddenPatternCard resetHint={resetHint} /> : <ReflectionsRestingCard resetHint={resetHint} />}
        </div>
      )}

      {/* Gentle prompts */}
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">Gentle prompts</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {promptCards.map((c) => (
            <GentlePromptCard key={c.title} title={c.title} subtitle={c.subtitle} href={c.href} />
          ))}
        </div>
      </div>

      {/* Status cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">This week</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {loadingEntries ? "…" : `${thisWeekCount ?? 0} entries`}
          </p>
          <p className="mt-1 text-sm text-slate-400">A gentle measure of consistency</p>
        </div>

        <LastCheckInCard latestEntry={latestEntry} loadingEntries={loadingEntries} />

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
