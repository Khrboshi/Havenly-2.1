import PremiumBadge from "../../components/PremiumBadge";

export const dynamic = "force-dynamic";

export default function InsightsPage() {
  return (
    <div className="min-h-screen px-6 md:px-10 py-16 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-4 flex items-center">
        Insights <PremiumBadge />
      </h1>

      <p className="text-gray-400 mb-10">
        Weekly summaries, emotional pattern tracking, and clarity reports
        will be available in Havenly Premium.
      </p>

      <div className="p-8 rounded-2xl border border-gray-700 bg-[#0F1A24] text-gray-300 space-y-4">
        <p>
          Havenly will use your reflections to gently highlight themes — what
          energises you, what drains you, and where you might need more care.
        </p>
        <p>
          This area will show your weekly summary, emotional trends, and
          personalised prompts. For now, it’s a preview of what we’re building.
        </p>
        <p className="text-sm text-gray-500">
          Premium features are not yet active. When payments are enabled, this
          section will unlock automatically for premium accounts.
        </p>
      </div>
    </div>
  );
}
