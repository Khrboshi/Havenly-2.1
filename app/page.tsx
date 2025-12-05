/* Landing Page v3.2 – Soft Blue Calm (Hero Gradient Only)
   - Minimal, therapeutic, premium
   - No glow, no neon, no harsh whites
   - Gradient restricted to hero for clarity + comfort
*/

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-[#0B1220] text-gray-200">
      {/* HERO SECTION */}
      <section
        className="
          w-full 
          pt-24 pb-32 
          px-6 md:px-12 lg:px-24 
          bg-gradient-to-b from-[#162236]/70 via-[#141A28]/60 to-[#0B1220] 
        "
      >
        {/* Intro badge */}
        <div className="text-sm mb-6 text-teal-300/70 border border-teal-300/30 rounded-full px-4 py-1 w-fit">
          A quiet place to unwind your thoughts
        </div>

        {/* HERO CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-100">
              When your mind feels full,  
              <span className="block text-[#7AB3FF]">
                Havenly helps you slow down.
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-300/90 leading-relaxed max-w-xl">
              Havenly is a calm journaling space with gentle AI reflections that 
              help you notice what’s happening inside without pressure. Start 
              free and build a quiet habit at your own pace. Upgrade only if 
              deeper psychological insight feels genuinely helpful.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/magic-login"
                className="
                  px-6 py-3 rounded-full 
                  bg-[#4CC5A9] text-[#0B1220] font-medium 
                  hover:bg-[#3db497] transition 
                "
              >
                Start a free check-in
              </Link>

              <Link
                href="/upgrade"
                className="
                  px-6 py-3 rounded-full 
                  border border-gray-500/40 
                  text-gray-200 
                  hover:bg-gray-700/30 transition 
                "
              >
                Explore Premium
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-400 max-w-md">
              No credit card required for the free plan. Keep it forever, upgrade anytime.
            </p>
          </div>

          {/* RIGHT SIDE — JOURNAL PREVIEW CARD */}
          <div>
            <div
              className="
                rounded-2xl border border-gray-600/30 
                p-6 backdrop-blur-sm 
                bg-[#101826]/80 
                shadow-[0_0_40px_-20px_rgba(0,0,0,0.6)]
              "
            >
              <div className="text-sm text-gray-300/80 mb-3">
                Evening check-in · 3–5 minutes
              </div>

              <div className="mb-5">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Tonight’s prompt
                </p>
                <p className="mt-1 text-base text-gray-200">
                  “If your mind could speak freely right now, what would it say it’s carrying?”
                </p>
              </div>

              <div className="border border-gray-600/40 rounded-xl p-4 mb-6">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  AI • Gentle Reflection
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  You’re holding a lot. Slowing down enough to notice this is already an act 
                  of strength. Maybe choose just one feeling to name tonight instead of 
                  trying to solve everything at once.
                </p>
              </div>

              <div className="flex justify-between text-xs text-gray-400">
                <div>
                  <span className="block font-medium text-gray-200">Free</span>
                  Gentle reflections · private journal
                </div>
                <div>
                  <span className="block font-medium text-gray-200">Premium</span>
                  Deeper themes · long-term insight
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW HAVENLY SUPPORTS YOU */}
      <section className="px-6 md:px-12 lg:px-24 py-24">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-100 mb-4">
          How Havenly supports you
        </h2>
        <p className="text-gray-300 max-w-2xl mb-12">
          You don’t need a perfect plan. Havenly is built for honest, 
          pressure-free reflection—especially on days that feel heavy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-gray-700/40 rounded-xl p-6">
            <h3 className="text-gray-100 font-medium mb-2">Step 1</h3>
            <p className="text-gray-300 text-sm">
              Drop in for a few minutes. One small prompt helps you ease into 
              reflection without overwhelm.
            </p>
          </div>

          <div className="border border-gray-700/40 rounded-xl p-6">
            <h3 className="text-gray-100 font-medium mb-2">Step 2</h3>
            <p className="text-gray-300 text-sm">
              Capture what mattered. You write freely in your own words; Havenly 
              stays supportive and grounded.
            </p>
          </div>

          <div className="border border-gray-700/40 rounded-xl p-6">
            <h3 className="text-gray-100 font-medium mb-2">Step 3</h3>
            <p className="text-gray-300 text-sm">
              Let AI gently reflect things back. Premium unlocks deeper themes 
              and long-term emotional patterns.
            </p>
          </div>
        </div>
      </section>

      {/* PLANS SECTION */}
      <section className="px-6 md:px-12 lg:px-24 pb-28">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-100 mb-3">
          One space, two ways to use it.
        </h2>

        <p className="text-gray-300 max-w-2xl mb-12">
          Most users begin with the free plan. Premium is here when you want 
          deeper guidance and more structured insight.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free */}
          <div className="border border-gray-700/40 rounded-2xl p-8">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
              Free
            </p>
            <h3 className="text-xl text-gray-100 mb-4">Havenly Free</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>Unlimited journaling entries</li>
              <li>Gentle reflections on recent entries</li>
              <li>Private personal timeline</li>
            </ul>

            <Link
              href="/magic-login"
              className="mt-6 inline-block text-teal-300 hover:text-teal-200 text-sm font-medium"
            >
              Start for free →
            </Link>
          </div>

          {/* Premium */}
          <div className="border border-gray-700/40 rounded-2xl p-8">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
              Premium
            </p>
            <h3 className="text-xl text-gray-100 mb-4">Havenly Premium</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>Deeper AI understanding across weeks & months</li>
              <li>Structured themes & emotional pattern insight</li>
              <li>Priority access to new reflection tools</li>
            </ul>

            <Link
              href="/upgrade"
              className="mt-6 inline-block bg-[#4CC5A9] text-[#0B1220] px-4 py-3 rounded-full font-medium hover:bg-[#3db497] transition"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
