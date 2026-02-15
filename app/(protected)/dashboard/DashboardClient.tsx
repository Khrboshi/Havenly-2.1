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

  // Keep it short and safe for UI
  const cleaned = raw.replace(/\s+/g, " ").slice(0, 24);
  return cleaned || null;
}

export default function DashboardClient({ userId }: DashboardClientProps) {
  const { supabase } = useSupabase();
  const { planType, credits, loading: planLoading } = useUserPlan();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(true);

  const readablePlan =
    planType === "PREMIUM" ? "Premium" : planType === "TRIAL" ? "Trial" : "Free";

  // Keep existing behavior
  const canCreate =
    planType === "PREMIUM" ? true : planType === "TRIAL" ? true : (credits ?? 0) > 0;

  const latestEntry = useMemo(() => entries[0] ?? null, [entries]);

  // First-time logic: first time = no entries yet (no new tables)
  const isFirstTime = !loadingEntries && entries.length === 0;

  const welcomeTitle = useMemo(() => {
    if (loadingEntries || loadingName) return "Welcome";
    const name = displayName ? `, ${displayName}` : "";
    return isFirstTime ? `Welcome to Havenly${name}` : `Welcome back${name}`;
  }, [displayName, isFirstTime, loadingEntries, loadingName]);

  // Warm, reflection-first microcopy (quick prompt increases activation)
  const welcomeSubtitle = useMemo(() => {
    if (loadingEntries) return null;
    if (isFirstTime) return "Take a breath — what’s on your mind right now?";
    return "How are you feeling today?";
  }, [isFirstTime, loadingEntries]);

  const primaryHref = canCreate ? "/journal/new" : "/upgrade";
  const primaryLabel = canCreate ? (isFirstTime ? "Start your first entry" : "New entry") : "Upgrade";

  const showCreditsChip = planType !== "PREMIUM";
  const showCreditsResetHint =
    planType !== "PREMIUM" && !planLoading && (credits ?? 0) === 0;

  // Banner shown only when credits are 0 (and not premium)
  const showZeroCreditsBanner =
    !planLoading && planType !== "PREMIUM" && (credits ?? 0) === 0;

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
      if (!error) {
        const name = friendlyNameFromUser(data?.user);
        setDisplayName(name);
      }
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
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-400">
            <span>{welcomeTitle}</span>
          </div>

          {welcomeSubtitle && <p className="text-sm text-slate-400">{welcomeSubtitle}</p>}

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-400">
            <Link
              href={planType === "PREMIUM" ? "/dashboard" : "/upgrade"}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10"
            >
              Plan: <span className="text-slate-200">{readablePlan}</span>
            </Link>

            {showCreditsChip && (
              <Link
                href="/upgrade"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10"
              >
                Credits:{" "}
                <span className="text-slate-200">
                  {planLoading ? "…" : credits ?? 0}
                </span>
              </Link>
            )}

            {planType === "PREMIUM" && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Unlimited credits
              </span>
            )}
          </div>

          {showCreditsResetHint && (
            <p className="text-xs text-slate-500">Credits reset next month.</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {latestEntry && (
            <Link
              href={`/journal/${latestEntry.id}`}
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Resume last entry
            </Link>
          )}

          <Link
            href="/journal"
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            View Journal
          </Link>

          <Link
            href={primaryHref}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              canCreate
                ? "bg-emerald-500 text-black hover:bg-emerald-400"
                : "bg-white/10 text-slate-200 hover:bg-white/15"
            }`}
          >
            {primaryLabel}
          </Link>
        </div>
      </div>

      {/* Zero Credits Banner */}
      {showZeroCreditsBanner && (
        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-200">
              You’ve used your reflections for now.
            </p>
            <p className="text-xs text-amber-300/80">
              Credits reset next month — or upgrade for unlimited insights.
            </p>
          </div>

          <Link
            href="/upgrade"
            className="inline-flex items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Entries shown</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {loadingEntries ? "…" : `${entries.length} / 5`}
          </p>
          <p className="mt-1 text-sm text-slate-400">Latest entries on your account</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Last entry</p>
          <p className="mt-2 text-base font-semibold text-slate-100">
            {loadingEntries
              ? "Loading…"
              : latestEntry
              ? titleOrUntitled(latestEntry.title)
              : "No entries yet"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {loadingEntries
              ? ""
              : latestEntry
              ? formatLocalDateTime(latestEntry.created_at)
              : "Create your first entry to get started"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Next step</p>
          <p className="mt-2 text-base font-semibold text-slate-100">
            {canCreate ? "Write a quick check-in" : "Unlock more reflections"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {canCreate ? "Keep momentum with a short entry." : "Upgrade for unlimited use and insights."}
          </p>
          <div className="mt-3">
            <Link
              href={primaryHref}
              className={`inline-flex rounded-md px-4 py-2 text-sm font-medium ${
                canCreate
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-white/10 text-slate-200 hover:bg-white/15"
              }`}
            >
              {canCreate ? "Start writing" : "Upgrade"}
            </Link>
          </div>
        </div>
      </div>

      {/* Recent list */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent entries</h2>
          <Link
            href="/journal"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            See all
          </Link>
        </div>

        {loadingEntries ? (
          <div className="space-y-3">
            <div className="h-14 rounded-xl border border-white/10 bg-white/5" />
            <div className="h-14 rounded-xl border border-white/10 bg-white/5" />
            <div className="h-14 rounded-xl border border-white/10 bg-white/5" />
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/10 p-5 text-slate-300">
            <p className="font-medium">No entries yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Create your first entry to start building momentum.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={primaryHref}
                className={`inline-flex rounded-md px-4 py-2 text-sm font-medium ${
                  canCreate
                    ? "bg-emerald-500 text-black hover:bg-emerald-400"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                {canCreate ? "Create entry" : "Upgrade to create"}
              </Link>

              <Link
                href="/journal"
                className="inline-flex rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                Browse journal
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {entries.map((e) => (
              <li key={e.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-100">
                      {titleOrUntitled(e.title)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatLocalDateTime(e.created_at)}
                    </p>
                  </div>

                  <Link
                    href={`/journal/${e.id}`}
                    className="shrink-0 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-200 hover:bg-emerald-500/15"
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
