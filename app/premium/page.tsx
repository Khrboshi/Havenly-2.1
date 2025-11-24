import Link from "next/link";

export default function PremiumPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Coming soon
        </p>
        <h1 className="text-3xl font-semibold text-slate-50">
          Havenly Premium (early concept)
        </h1>
        <p className="text-sm text-slate-300">
          The free version of Havenly will always give you a calm, private
          journaling space. Premium will add a few deeper tools for people who
          want a gentle, long-term companion.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h2 className="mb-1 text-sm font-semibold text-emerald-300">
            What stays free
          </h2>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• Daily mood check-ins</li>
            <li>• Short reflective entries</li>
            <li>• Gentle AI reflections</li>
            <li>• Full privacy — no public feed or followers</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h2 className="mb-1 text-sm font-semibold text-emerald-300">
            What Premium may include
          </h2>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• Longer, deeper AI reflections</li>
            <li>• Weekly and monthly trend overviews</li>
            <li>• Extra prompts for specific seasons of life</li>
            <li>• Priority support and early access to experiments</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
        <p>
          Right now, Havenly is in{" "}
          <span className="font-semibold text-slate-100">early access</span> and
          everything is free while we learn from people like you. We&apos;ll
          only introduce pricing once we&apos;re sure the experience genuinely
          helps.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          When Premium launches, you&apos;ll be able to upgrade from your
          settings &gt; billing page.
        </p>
      </section>

      <Link
        href="/login"
        className="inline-flex items-center rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
      >
        Go back to my journal
      </Link>
    </div>
  );
}
