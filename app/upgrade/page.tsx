import Link from "next/link";

export default function UpgradePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24">
        <p className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Havenly Premium
        </p>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Upgrade to deeper, calmer insights.
            </h1>
            <p className="mt-3 text-sm text-slate-300 max-w-xl">
              Premium adds deeper reflections that help you understand what&rsquo;s
              been happening over time—without pressure, judgment, or
              productivity noise. It&apos;s built for real, tired humans who
              want their weeks to finally make emotional sense.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link
                href="/magic-login"
                className="rounded-full bg-emerald-400 px-6 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Upgrade to Premium – $25/month
              </Link>
              <Link
                href="/"
                className="rounded-full border border-slate-700 px-6 py-2.5 font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-900"
              >
                Keep exploring Havenly
              </Link>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Cancel anytime. Your entries always remain in your account.
            </p>

            <div className="mt-8 grid gap-4 text-sm text-slate-200">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Premium is for you if…
                </h2>
                <ul className="mt-3 space-y-2 text-slate-300">
                  <li>
                    • You want your emotional patterns to feel understandable,
                    not overwhelming.
                  </li>
                  <li>
                    • You&apos;d like gentle AI to help you spot what&apos;s
                    actually supporting you each week.
                  </li>
                  <li>
                    • You&apos;re ready to invest a small monthly amount to feel
                    less lost inside your own life.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRICE CARD */}
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Premium at a glance
            </p>
            <p className="mt-3 text-3xl font-semibold text-emerald-200">
              $25
              <span className="text-base font-normal text-slate-400">
                /month
              </span>
            </p>

            <ul className="mt-5 space-y-2 text-sm text-slate-200">
              <li>• Deeper AI reflections across multiple entries.</li>
              <li>• Emotional timelines, themes, and recurring patterns.</li>
              <li>• Higher monthly credit balance for unlimited usage.</li>
              <li>• Priority access to new reflection tools and features.</li>
            </ul>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
              <p className="font-semibold text-slate-100">
                How Premium pays for itself
              </p>
              <p className="mt-2">
                If clearer patterns help you make even one kinder decision a
                week—setting a boundary, saying no to one draining commitment,
                choosing real rest instead of autopilot—Premium has already
                returned more than it costs.
              </p>
            </div>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-slate-100">
            What&apos;s different? Free vs Premium.
          </h2>
          <p className="mt-2 text-xs text-slate-300">
            You keep everything in Free. Premium just adds more depth and
            clarity.
          </p>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800 text-sm">
            <div className="grid grid-cols-[2fr,1fr,1fr] bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-300">
              <span>Feature</span>
              <span className="text-center">Free</span>
              <span className="text-center text-emerald-300">Premium</span>
            </div>

            <div className="divide-y divide-slate-800 bg-slate-950/60">
              {[
                {
                  feature: "Daily private journaling",
                  free: "Included",
                  premium: "Included"
                },
                {
                  feature: "AI reflections",
                  free: "Light snapshots",
                  premium: "Deep insights"
                },
                {
                  feature: "Pattern timelines & themes",
                  free: "Not included",
                  premium: "Included"
                },
                {
                  feature: "Monthly recap",
                  free: "Not included",
                  premium: "Included"
                },
                {
                  feature: "Credits",
                  free: "Limited",
                  premium: "Higher balance"
                }
              ].map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-[2fr,1fr,1fr] px-4 py-3 text-xs text-slate-200"
                >
                  <span>{row.feature}</span>
                  <span className="text-center text-slate-300">
                    {row.free}
                  </span>
                  <span className="text-center text-emerald-300">
                    {row.premium}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            <Link
              href="/magic-login"
              className="rounded-full bg-emerald-400 px-5 py-2 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Upgrade now
            </Link>
            <Link
              href="/magic-login"
              className="rounded-full border border-slate-700 px-5 py-2 font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-900"
            >
              Stay Free for now
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
