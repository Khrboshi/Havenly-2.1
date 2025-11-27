import PremiumBadge from "@/app/components/PremiumBadge";

export default function InsightsPage() {
  return (
    <div className="min-h-screen px-6 md:px-10 py-16 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-4 flex items-center">
        Insights <PremiumBadge />
      </h1>

      <p className="text-gray-400 mb-10">
        Weekly summaries, emotional pattern tracking, and clarity reports
        will be available soon.
      </p>

      <div className="p-8 rounded-2xl border border-gray-700 bg-[#0F1A24] text-gray-300">
        <p className="mb-2">
          Havenly Premium will unlock deeper insights into your thought patterns
          and emotional trends.
        </p>

        <p>
          Stay tuned — this feature is actively being built and will automatically
          unlock when your account becomes premium.
        </p>
      </div>
    </div>
  );
}
