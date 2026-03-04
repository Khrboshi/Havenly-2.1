"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type InsightData = {
  themes: Record<string, number>;
  emotions: Record<string, number>;
  corepatterns?: Record<string, number>;
  entryCount?: number;
  hasRealData?: boolean;
  trend?: { up: string[]; down: string[] };
};

function sortMap(map: Record<string, number>) {
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function maxVal(map: Record<string, number>): number {
  const vals = Object.values(map);
  return vals.length ? Math.max(...vals) : 1;
}

/**
 * Better label polish:
 * - trims
 * - collapses spaces
 * - Title Case each word (also handles hyphenated words)
 * Examples: "self-awareness" -> "Self-Awareness", "quiet courage" -> "Quiet Courage"
 */
function titleCaseLabel(label: string) {
  const s = String(label ?? "").trim().replace(/\s+/g, " ");
  if (!s) return s;

  // Title-case after start / space / hyphen
  return s.replace(/(^|[\s-])([a-z])/g, (_, p1: string, p2: string) => p1 + p2.toUpperCase());
}

/** Merge keys that differ only by casing/spacing after titleCaseLabel() */
function normalizeAndMerge(map: Record<string, number>) {
  const merged: Record<string, number> = {};
  for (const [k, v] of Object.entries(map || {})) {
    const nk = titleCaseLabel(k);
    merged[nk] = (merged[nk] || 0) + (typeof v === "number" ? v : 0);
  }
  return merged;
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-7 space-y-4">
        <div className="h-3 w-24 rounded bg-slate-800" />
        <div className="h-6 w-3/4 rounded bg-slate-800" />
        <div className="h-3 w-1/2 rounded bg-slate-800" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 space-y-5">
            <div className="h-3 w-28 rounded bg-slate-800" />
            {[80, 65, 50, 40].map((w, j) => (
              <div key={j} className="space-y-1.5">
                <div className="flex justify-between">
                  <div className="h-3 rounded bg-slate-800" style={{ width: `${w}%` }} />
                  <div className="h-3 w-6 rounded bg-slate-800" />
                </div>
                <div className="h-[3px] w-full rounded-full bg-slate-800" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bar row ────────────────────────────────────────────────────────────────

function BarRow({
  label,
  count,
  max,
  rank,
  color = "emerald",
}: {
  label: string;
  count: number;
  max: number;
  rank: number;
  color?: "emerald" | "violet";
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  const isTop = rank === 0;

  const barColor =
    isTop
      ? color === "violet"
        ? "bg-violet-400"
        : "bg-emerald-400"
      : "bg-slate-700 group-hover:bg-slate-600";

  const rankColor =
    isTop ? (color === "violet" ? "text-violet-400" : "text-emerald-400") : "text-slate-700";

  return (
    <li className="group space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`shrink-0 tabular-nums text-[10px] w-4 text-right ${rankColor}`}>
            {rank + 1}
          </span>
          <span
            className={`truncate ${
              isTop
                ? "font-medium text-slate-100"
                : "text-slate-400 group-hover:text-slate-200 transition-colors"
            }`}
            title={label}
          >
            {label}
          </span>
        </div>

        <span className="shrink-0 tabular-nums text-xs text-slate-600">{count}</span>
      </div>

      <div className="h-[3px] w-full overflow-hidden rounded-full bg-slate-800/80">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </li>
  );
}

// ── Trend pill ─────────────────────────────────────────────────────────────

function TrendPill({ label, dir }: { label: string; dir: "up" | "down" }) {
  const pretty = titleCaseLabel(label);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        dir === "up"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          : "border-slate-700 bg-slate-800/60 text-slate-500"
      }`}
    >
      {dir === "up" ? "↑" : "↓"} {pretty}
    </span>
  );
}

// ── Small “stat pill” ──────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}

// ── Not enough data ─────────────────────────────────────────────────────────

function NotEnoughData({ entryCount }: { entryCount: number }) {
  const needed = Math.max(0, 5 - entryCount);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-8 text-center space-y-3">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
        <span className="text-xl">✦</span>
      </div>

      <h3 className="text-sm font-medium text-slate-200">
        {entryCount === 0
          ? "No reflections yet"
          : `${entryCount} ${entryCount === 1 ? "reflection" : "reflections"} so far`}
      </h3>

      <p className="mx-auto max-w-sm text-sm text-slate-500">
        {needed > 0
          ? `${needed} more ${needed === 1 ? "reflection" : "reflections"} and Havenly will start surfacing what quietly repeats across your entries.`
          : "Generating your personal patterns now — check back after your next reflection."}
      </p>

      <Link
        href="/journal/new"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition"
      >
        Write an entry →
      </Link>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

export default function InsightsClient() {
  const [data, setData] = useState<InsightData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [showAllEmotions, setShowAllEmotions] = useState(false);

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const res = await fetch("/api/ai/insights", { cache: "no-store" });
        if (!res.ok) {
          const j = await res.json().catch(() => ({} as any));
          setError(j?.error || "Failed to load insights.");
          setData(null);
          return;
        }
        const j = (await res.json()) as InsightData;

        // Fallback if API doesn't provide entryCount
        const derivedCount = Math.max(
          ...Object.values(j.themes || {}),
          ...Object.values(j.emotions || {}),
          0
        );

        setData({
          ...j,
          entryCount: typeof j.entryCount === "number" ? j.entryCount : derivedCount,
        });
      } catch {
        setError("Failed to load insights.");
        setData(null);
      }
    }
    load();
  }, []);

  const themesMerged = useMemo(() => (data ? normalizeAndMerge(data.themes) : {}), [data]);
  const emotionsMerged = useMemo(() => (data ? normalizeAndMerge(data.emotions) : {}), [data]);

  const allThemes = useMemo(() => sortMap(themesMerged), [themesMerged]);
  const allEmotions = useMemo(() => sortMap(emotionsMerged), [emotionsMerged]);

  const visibleThemes = showAllThemes ? allThemes : allThemes.slice(0, 6);
  const visibleEmotions = showAllEmotions ? allEmotions : allEmotions.slice(0, 6);

  const maxTheme = useMemo(() => maxVal(themesMerged), [themesMerged]);
  const maxEmotion = useMemo(() => maxVal(emotionsMerged), [emotionsMerged]);

  const topTheme = allThemes[0]?.[0];
  const topThemeCount = allThemes[0]?.[1];

  const topEmotion = allEmotions[0]?.[0];
  const topEmotionCount = allEmotions[0]?.[1];

  const entryCount = data?.entryCount ?? 0;

  // Derive “real data” even if API doesn't send hasRealData
  const derivedHasRealData = (allThemes.length > 0 || allEmotions.length > 0) && entryCount >= 5;
  const hasRealData =
    typeof data?.hasRealData === "boolean" ? data.hasRealData : derivedHasRealData;

  const hasTrend = (data?.trend?.up?.length ?? 0) + (data?.trend?.down?.length ?? 0) > 0;

  // “Momentum” label based on trend signal size
  const momentum = useMemo(() => {
    if (!hasTrend) return "Steady";
    const up = data?.trend?.up?.length ?? 0;
    const down = data?.trend?.down?.length ?? 0;
    if (up >= 3 && down === 0) return "Rising";
    if (down >= 3 && up === 0) return "Softening";
    return "Shifting";
  }, [data, hasTrend]);

  // Headline (more human, less repetitive)
  const headline = useMemo(() => {
    if (!topEmotion && !topTheme) return "Your patterns will appear here as you keep writing.";
    if (topEmotion && topTheme) {
      return (
        <>
          <span className="text-slate-100 font-semibold">{topEmotion}</span> keeps showing up —
          often alongside{" "}
          <span className="text-slate-100 font-semibold">{topTheme}</span>.
        </>
      );
    }
    if (topEmotion) {
      return (
        <>
          <span className="text-slate-100 font-semibold">{topEmotion}</span> appears most often
          across your entries.
        </>
      );
    }
    return (
      <>
        <span className="text-slate-100 font-semibold">{topTheme}</span> is a theme that repeats
        across your reflections.
      </>
    );
  }, [topEmotion, topTheme]);

  // “Premium-feeling” takeaways, computed from current data only.
  const takeaways = useMemo(() => {
    const items: Array<{ title: string; body: string }> = [];

    if (topEmotion) {
      items.push({
        title: `Most common emotion: ${topEmotion}`,
        body:
          typeof topEmotionCount === "number"
            ? `It shows up ${topEmotionCount} time${topEmotionCount === 1 ? "" : "s"} across your reflections.`
            : "It appears most often across your reflections.",
      });
    }

    if (topTheme) {
      items.push({
        title: `Most common theme: ${topTheme}`,
        body:
          typeof topThemeCount === "number"
            ? `It appears ${topThemeCount} time${topThemeCount === 1 ? "" : "s"} across your entries.`
            : "It repeats across your entries over time.",
      });
    }

    if (hasTrend) {
      const up = (data?.trend?.up ?? []).slice(0, 2).map(titleCaseLabel);
      const down = (data?.trend?.down ?? []).slice(0, 2).map(titleCaseLabel);

      const parts: string[] = [];
      if (up.length) parts.push(`More present lately: ${up.join(", ")}`);
      if (down.length) parts.push(`Less present lately: ${down.join(", ")}`);

      if (parts.length) {
        items.push({
          title: "Recent movement",
          body: parts.join(" • "),
        });
      }
    }

    return items.slice(0, 3);
  }, [topEmotion, topEmotionCount, topTheme, topThemeCount, hasTrend, data]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-slate-100">Insights</h1>
        <p className="text-sm text-slate-500">
          What Havenly has noticed across your reflections
          {entryCount > 0 && (
            <>
              {" "}
              — <span className="text-slate-400">{entryCount} {entryCount === 1 ? "entry" : "entries"}</span>
            </>
          )}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {!error && !data && <Skeleton />}

      {/* Not enough data */}
      {data && !hasRealData && <NotEnoughData entryCount={entryCount} />}

      {/* Content */}
      {data && hasRealData && (
        <div className="space-y-6">
          {/* Primary card */}
          <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900/60 p-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
              What this shows
            </p>

            <p className="mt-2 text-lg leading-relaxed text-slate-300">
              {headline}
            </p>

            {/* Snapshot */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatPill label="Entries" value={<span className="tabular-nums">{entryCount}</span>} />
              <StatPill label="Top emotion" value={topEmotion ? topEmotion : "—"} />
              <StatPill label="Top theme" value={topTheme ? topTheme : "—"} />
              <StatPill label="Momentum" value={momentum} />
            </div>

            {/* Trend pills */}
            {hasTrend && (
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-xs text-slate-600 self-center mr-1">Recently:</span>
                {data.trend?.up?.map((e) => (
                  <TrendPill key={`up-${e}`} label={e} dir="up" />
                ))}
                {data.trend?.down?.map((e) => (
                  <TrendPill key={`dn-${e}`} label={e} dir="down" />
                ))}
              </div>
            )}

            {/* Takeaways */}
            {takeaways.length > 0 && (
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {takeaways.map((t, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <p className="text-sm font-medium text-slate-200">{t.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{t.body}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-5 text-xs text-slate-600">
              These are patterns, not diagnoses. They shift as you keep writing.
            </p>
          </section>

          {/* Themes + Emotions */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Themes */}
            <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Recurring themes
                  </h2>
                  {allThemes.length > 0 && (
                    <p className="mt-0.5 text-xs text-slate-600">
                      {allThemes.length} distinct {allThemes.length === 1 ? "theme" : "themes"} across your entries
                    </p>
                  )}
                </div>

                {allThemes.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllThemes((v) => !v)}
                    className="text-xs text-slate-600 hover:text-slate-400 transition"
                  >
                    {showAllThemes ? "Show less" : `+${allThemes.length - 6} more`}
                  </button>
                )}
              </div>

              {allThemes.length === 0 ? (
                <p className="text-sm text-slate-600">Not enough theme data yet — keep writing.</p>
              ) : (
                <ul className="space-y-4">
                  {visibleThemes.map(([k, v], i) => (
                    <BarRow
                      key={`${k}-${i}`}
                      label={k}
                      count={v}
                      max={maxTheme}
                      rank={i}
                      color="emerald"
                    />
                  ))}
                </ul>
              )}
            </section>

            {/* Emotions */}
            <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Emotions over time
                  </h2>
                  {allEmotions.length > 0 && (
                    <p className="mt-0.5 text-xs text-slate-600">
                      {allEmotions.length} distinct {allEmotions.length === 1 ? "emotion" : "emotions"} noticed
                    </p>
                  )}
                </div>

                {allEmotions.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllEmotions((v) => !v)}
                    className="text-xs text-slate-600 hover:text-slate-400 transition"
                  >
                    {showAllEmotions ? "Show less" : `+${allEmotions.length - 6} more`}
                  </button>
                )}
              </div>

              {allEmotions.length === 0 ? (
                <p className="text-sm text-slate-600">Not enough emotion data yet — keep writing.</p>
              ) : (
                <ul className="space-y-4">
                  {visibleEmotions.map(([k, v], i) => (
                    <BarRow
                      key={`${k}-${i}`}
                      label={k}
                      count={v}
                      max={maxEmotion}
                      rank={i}
                      color="violet"
                    />
                  ))}
                </ul>
              )}
            </section>
          </div>

          <p className="pb-2 text-center text-xs text-slate-700">
            Insights deepen as your reflection history grows.
          </p>
        </div>
      )}
    </div>
  );
}
