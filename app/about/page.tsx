// app/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-hvn-bg text-hvn-text-primary bg-hvn-page-gradient">
      <section className="mx-auto max-w-4xl px-4 pt-20 pb-24">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            About Havenly
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-hvn-text-muted sm:text-base">
            Havenly exists to give your inner life a quieter place to land.
          </p>
        </div>

        {/* Core philosophy */}
        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-hvn-text-primary">
              Why Havenly exists
            </h2>
            <p className="text-sm leading-relaxed text-hvn-text-muted">
              Many tools are designed to help you optimize, track, or improve
              yourself. Havenly is different. It was created for moments when
              life feels full, complicated, or emotionally dense — and you
              simply need a place to be honest.
            </p>
            <p className="text-sm leading-relaxed text-hvn-text-muted">
              Havenly is not about fixing you. It is about helping you notice
              what is already there, with clarity and kindness.
            </p>
          </section>

          {/* What Havenly is / is not */}
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-hvn-card bg-slate-950/70 p-5">
              <h3 className="mb-2 text-sm font-semibold text-emerald-300">
                What Havenly is
              </h3>
              <ul className="space-y-2 text-sm text-hvn-text-muted">
                <li>• A private journaling space</li>
                <li>• A calm companion for reflection</li>
                <li>• A way to notice patterns over time</li>
                <li>• A tool that respects your pace and privacy</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-hvn-card bg-slate-950/70 p-5">
              <h3 className="mb-2 text-sm font-semibold text-amber-300">
                What Havenly is not
              </h3>
              <ul className="space-y-2 text-sm text-hvn-text-muted">
                <li>• Not therapy or clinical care</li>
                <li>• Not a productivity system</li>
                <li>• Not a public or social platform</li>
                <li>• Not something you must use every day</li>
              </ul>
            </div>
          </section>

          {/* AI positioning */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-hvn-text-primary">
              How AI is used
            </h2>
            <p className="text-sm leading-relaxed text-hvn-text-muted">
              Havenly uses AI to gently reflect your words back to you. It may
              highlight emotions, patterns, or themes — not to label you, but to
              help you see yourself more clearly.
            </p>
            <p className="text-sm leading-relaxed text-hvn-text-muted">
              The AI is designed to support reflection, not replace human
              judgment, relationships, or professional help.
            </p>
          </section>

          {/* Privacy & trust */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-hvn-text-primary">
              Privacy comes first
            </h2>
            <p className="text-sm leading-relaxed text-hvn-text-muted">
              Your journal is meant to stay yours. Entries are stored securely
              and are not used to train public models. Havenly is built around
              the idea that your inner life is not content.
            </p>
            <p className="text-sm text-hvn-text-muted">
              If you would like more detail, you can read our{" "}
              <Link
                href="/privacy"
                className="font-medium text-emerald-400 hover:underline"
              >
                Privacy Policy →
              </Link>
            </p>
          </section>

          {/* Closing CTA */}
          <section className="mt-12 flex flex-col items-start gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-hvn-text-muted">
              Havenly works best when you use it honestly, gently, and at your
              own pace.
            </p>
            <div className="flex gap-3">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Start free journal
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:bg-slate-900"
              >
                Explore the blog →
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
