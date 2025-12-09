import Link from "next/link";

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-slate-100">Tools</h1>

      <p className="text-slate-400 text-sm">
        AI-assisted tools to support your emotional clarity and self-reflection.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/tools/mood"
          className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition"
        >
          <h3 className="font-medium text-slate-100 mb-2">Mood Check</h3>
          <p className="text-slate-400 text-sm">
            Track how you're feeling today in a simple guided flow.
          </p>
        </Link>

        <Link
          href="/tools/reflection"
          className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition"
        >
          <h3 className="font-medium text-slate-100 mb-2">
            Guided Reflection
          </h3>
          <p className="text-slate-400 text-sm">
            Receive thoughtful prompts based on your emotional state.
          </p>
        </Link>

        <Link
          href="/tools/suggestions"
          className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition"
        >
          <h3 className="font-medium text-slate-100 mb-2">
            Small Suggestions
          </h3>
          <p className="text-slate-400 text-sm">
            Gentle nudges and ideas for taking small restorative steps.
          </p>
        </Link>
      </div>
    </div>
  );
}
