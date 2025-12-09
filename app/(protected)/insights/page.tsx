export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-slate-100">Insights</h1>

      <p className="text-slate-400 text-sm max-w-xl">
        As you continue journaling and checking in, Havenly will surface gentle
        timelines, trends, and repeating emotional themes. Think of this as a
        quiet companion that helps you understand what has been building beneath
        your week.
      </p>

      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-slate-500 text-sm">
        Insight visualizations will appear here soon — including:
        <ul className="mt-3 space-y-1 list-disc list-inside">
          <li>Mood patterns over time</li>
          <li>Reflection themes and repeated keywords</li>
          <li>Emotion frequency breakdown</li>
          <li>Week-over-week clarity score</li>
        </ul>
      </div>
    </div>
  );
}
