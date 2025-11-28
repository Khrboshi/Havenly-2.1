export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-white shadow-md rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-[var(--brand-primary)] mb-6">
          Tools
        </h1>

        <p className="text-lg mb-6">
          Explore Havenly’s growing set of gentle self-reflection tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="p-6 border rounded-xl bg-[var(--brand-bg)] shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Daily Journal</h2>
            <p className="text-gray-700 mb-3">
              Capture thoughts and feelings with a clean and simple editor.
            </p>
            <a
              href="/journal/new"
              className="text-[var(--brand-primary)] font-semibold hover:underline"
            >
              Start writing →
            </a>
          </div>

          <div className="p-6 border rounded-xl bg-[var(--brand-bg)] shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Insights</h2>
            <p className="text-gray-700 mb-3">
              See trends and understand how your emotions evolve over time.
            </p>
            <a
              href="/insights"
              className="text-[var(--brand-primary)] font-semibold hover:underline"
            >
              View insights →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
