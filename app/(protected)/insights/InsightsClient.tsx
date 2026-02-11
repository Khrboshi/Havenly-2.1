// app/(protected)/insights/InsightsClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type InsightData = {
  themes: Record<string, number>;
  emotions: Record<string, number>;
};

function sortMap(map: Record<string, number>) {
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export default function InsightsClient() {
  const [data, setData] = useState<InsightData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const res = await fetch("/api/ai/insights", { cache: "no-store" });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j?.error || "Failed to load insights.");
          setData(null);
          return;
        }
        const j = (await res.json()) as InsightData;
        setData(j);
      } catch {
        setError("Failed to load insights.");
        setData(null);
      }
    }
    load();
  }, []);

  const topThemes = useMemo(() => (data ? sortMap(data.themes) : []), [data]);
  const topEmotions = useMemo(() => (data ? sortMap(data.emotions) : []), [data]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-100">Insights</h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          These patterns are generated across multiple entries — never from a single moment.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {!error && !data && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-slate-400 text-sm">
          Loading insights…
        </div>
      )}

      {data && (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <h2 className="text-sm font-semibold text-slate-200 mb-4">Top themes</h2>
            {topThemes.length === 0 ? (
              <p className="text-sm text-slate-500">No theme data yet.</p>
            ) : (
              <ul className="space-y-2 text-sm text-slate-200">
                {topThemes.map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                    <span>{k}</span>
                    <span className="text-slate-400">{v}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <h2 className="text-sm font-semibold text-slate-200 mb-4">Top emotions</h2>
            {topEmotions.length === 0 ? (
              <p className="text-sm text-slate-500">No emotion data yet.</p>
            ) : (
              <ul className="space-y-2 text-sm text-slate-200">
                {topEmotions.map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                    <span>{k}</span>
                    <span className="text-slate-400">{v}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
