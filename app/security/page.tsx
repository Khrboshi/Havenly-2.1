// app/security/page.tsx
// Server component — technical content stays in English, notice banner translates.

import type { Metadata } from "next";
import Link from "next/link";
import { CONFIG } from "@/app/lib/config";
import { getTranslations, DEFAULT_LOCALE } from "@/app/lib/i18n";
import { getRequestLocale, getRequestTranslations } from "@/app/lib/i18n/server";
import LegalLanguageNotice from "@/app/components/LegalLanguageNotice";
import BrandName from "@/app/components/BrandName";

// ─── SEO metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const { legalPages: lp } = await getRequestTranslations();
  return {
    title:       lp.securityMetaTitle(CONFIG.appName),
    description: lp.securityMetaDescription(CONFIG.appName),
    robots: {
      index:  true,
      follow: true,
    },
    openGraph: {
      title:       lp.securityOgTitle(CONFIG.appName),
      description: lp.securityOgDescription(CONFIG.appName),
      type:        "website",
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function SecurityPage() {
  const locale    = await getRequestLocale();
  const { legalPages: lp, legalPagesCta: lpc } = getTranslations(locale);
  const isEnglish = locale === DEFAULT_LOCALE;

  return (
    <main className="min-h-screen bg-qm-bg text-qm-primary">
      {/* Skip link for keyboard users */}
      <a
        href="#security-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-qm-accent focus:px-5 focus:py-3 focus:text-sm focus:text-white focus:shadow-lg"
      >
        Skip to security content
      </a>

      <section id="security-content" className="mx-auto max-w-4xl px-6 pb-16 pt-24">

        {/* Language notice — shown only for non-English locales */}
        {!isEnglish && (
          <LegalLanguageNotice notice={lp.languageNotice} linkLabel={lp.contactUs} />
        )}

        <p className="qm-eyebrow text-qm-accent">
          {lp.securityTitle}
        </p>

        <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {lp.securityHeadline}
        </h1>

        <p className="mt-3 max-w-2xl text-qm-secondary">
          This page explains exactly how <BrandName /> handles your journal
          entries — what happens to them, where they are stored, who can
          access them, and what we honestly cannot claim. We prefer clarity
          over reassuring language.
        </p>

        {/* Questions box */}
        <div className="mt-6 rounded-2xl border border-qm-border-card bg-qm-elevated p-5 text-sm shadow-qm-card">
          <p className="text-xs text-qm-secondary">
            {lp.questions}{" "}
            <a
              href={`mailto:${CONFIG.supportEmail}`}
              className="font-semibold text-qm-accent underline underline-offset-2 transition-colors duration-150 hover:text-qm-accent-hover"
            >
              {CONFIG.supportEmail}
            </a>
            .
          </p>
        </div>

        {/* Sections */}
        <div className="mt-10 space-y-10 text-sm" role="article" aria-label="Security architecture details">

          {/* Data flow */}
          <section id="data-flow" aria-labelledby="data-flow-heading">
            <h2 id="data-flow-heading" className="text-lg font-semibold text-qm-primary">
              What happens when you submit an entry
            </h2>
            <p className="mt-2 text-qm-secondary">
              When you write and save a journal entry:
            </p>
            <ol className="mt-3 list-decimal space-y-2 ps-5 text-qm-secondary">
              <li>
                Your text is transmitted over HTTPS from your browser to our
                servers. All connections are encrypted in transit — this is
                enforced by Vercel, our hosting provider.
              </li>
              <li>
                The entry is stored in our database (Supabase Postgres), where
                it is encrypted at rest. Row-level security policies mean the
                database will only return your rows to authenticated requests
                made by your own account.
              </li>
              <li>
                If you request an AI reflection, the text of that entry is sent
                to Groq (our AI inference provider) to generate the response.
                Groq processes the text for that request only and does not
                retain or train on it. See{" "}
                <Link
                  href="https://groq.com/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-qm-accent underline-offset-2 hover:underline"
                >
                  Groq&apos;s Privacy Policy
                </Link>
                .
              </li>
              <li>
                The reflection is returned to your browser and saved alongside
                your entry. No other party sees your text.
              </li>
            </ol>
          </section>

          {/* What we can and cannot claim */}
          <section id="honest-limits" aria-labelledby="honest-limits-heading">
            <h2 id="honest-limits-heading" className="text-lg font-semibold text-qm-primary">
              What we can and cannot claim
            </h2>
            <p className="mt-2 text-qm-secondary">
              We will not use language we cannot back up. Here is an honest
              account:
            </p>
            <ul className="mt-3 list-disc space-y-3 ps-5 text-qm-secondary">
              <li>
                <span className="font-semibold text-qm-primary">
                  Encryption in transit:
                </span>{" "}
                Yes. All connections between your browser and our servers use
                HTTPS/TLS. This is enforced by Vercel.
              </li>
              <li>
                <span className="font-semibold text-qm-primary">
                  Encryption at rest:
                </span>{" "}
                Yes. Supabase encrypts data at rest in the underlying database
                storage.
              </li>
              <li>
                <span className="font-semibold text-qm-primary">
                  End-to-end encryption (E2E):
                </span>{" "}
                No. We do not claim E2E encryption. To generate AI reflections,
                our server reads your entry text before sending it to Groq. A
                true E2E model — where only your device holds the decryption
                key — would make AI reflections impossible. We chose not to
                claim E2E when it is not true.
              </li>
              <li>
                <span className="font-semibold text-qm-primary">
                  Local AI processing:
                </span>{" "}
                No. AI inference runs on Groq&apos;s infrastructure, not on
                your device. Your entry text leaves your device for that
                processing step.
              </li>
              <li>
                <span className="font-semibold text-qm-primary">
                  Zero-knowledge architecture:
                </span>{" "}
                No. Our server can access entry content in order to generate
                reflections and pattern insights. We have chosen not to access
                it for any other purpose, but we will not claim it is
                technically impossible.
              </li>
            </ul>
          </section>

          {/* Authentication */}
          <section id="authentication" aria-labelledby="authentication-heading">
            <h2 id="authentication-heading" className="text-lg font-semibold text-qm-primary">
              Authentication
            </h2>
            <p className="mt-2 text-qm-secondary">
              <BrandName /> uses magic links — you enter your email address and
              receive a short-lived sign-in link. There is no password stored
              anywhere. This eliminates the risk of password reuse and reduces
              the attack surface compared to a traditional password system.
              Sessions are managed by Supabase Auth using short-lived JWT
              tokens with refresh rotation.
            </p>
          </section>

          {/* Access controls */}
          <section id="access-controls" aria-labelledby="access-controls-heading">
            <h2 id="access-controls-heading" className="text-lg font-semibold text-qm-primary">
              Access controls
            </h2>
            <p className="mt-2 text-qm-secondary">
              Row-level security (RLS) is enforced at the database level. Every
              table that stores user content has a policy that restricts access
              to the authenticated user who owns that row. This means a bug in
              application code cannot accidentally expose one user&apos;s
              entries to another — the database itself enforces the boundary.
            </p>
            <p className="mt-2 text-qm-secondary">
              <BrandName /> is built and maintained by a single person. There
              is no support team with a backdoor to your entries. Admin access
              to the Supabase project exists for operational purposes (schema
              changes, debugging infrastructure), but is not used to read entry
              content.
            </p>
          </section>

          {/* AI and data use */}
          <section id="ai-data-use" aria-labelledby="ai-data-use-heading">
            <h2 id="ai-data-use-heading" className="text-lg font-semibold text-qm-primary">
              AI processing and data use
            </h2>
            <ul className="mt-3 list-disc space-y-2 ps-5 text-qm-secondary">
              <li>
                AI reflections are generated by{" "}
                <Link
                  href="https://groq.com/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-qm-accent underline-offset-2 hover:underline"
                >
                  Groq
                </Link>{" "}
                using the Llama 4 Scout model. Groq does not retain prompts or
                outputs and does not use them to train models.
              </li>
              <li>
                We do not use your journal entries to train any AI model — ours
                or anyone else&apos;s.
              </li>
              <li>
                Pattern insights and weekly summaries are generated by sending
                a selection of your recent entries to Groq for that specific
                analysis. The same data handling rules apply.
              </li>
              <li>
                We do not sell, share, or transfer your entries to third
                parties for any purpose other than generating the features you
                explicitly requested.
              </li>
            </ul>
          </section>

          {/* Infrastructure */}
          <section id="infrastructure" aria-labelledby="infrastructure-heading">
            <h2 id="infrastructure-heading" className="text-lg font-semibold text-qm-primary">
              Infrastructure and subprocessors
            </h2>
            <p className="mt-2 text-qm-secondary">
              The services that handle your data, and what each one does:
            </p>
            <ul className="mt-3 list-disc space-y-2 ps-5 text-qm-secondary">
              <li>
                <span className="font-semibold text-qm-primary">Vercel</span>{" "}
                — hosting, serverless functions, and edge delivery. Enforces
                HTTPS on all connections.
              </li>
              <li>
                <Link
                  href="https://supabase.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-qm-primary underline-offset-2 hover:underline"
                >
                  Supabase
                </Link>{" "}
                — Postgres database, authentication, and row-level security.
                Data is encrypted at rest. SOC 2 Type II certified.
              </li>
              <li>
                <Link
                  href="https://groq.com/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-qm-primary underline-offset-2 hover:underline"
                >
                  Groq
                </Link>{" "}
                — AI inference for reflections and pattern analysis. Processes
                entry text for the duration of the request only.
              </li>
              <li>
                <span className="font-semibold text-qm-primary">Resend</span>{" "}
                — transactional email (magic links). Receives your email
                address to deliver sign-in emails.
              </li>
              <li>
                <Link
                  href="https://posthog.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-qm-primary underline-offset-2 hover:underline"
                >
                  PostHog
                </Link>{" "}
                — product analytics, EU cloud. Receives anonymised usage
                events (page views, feature usage). Does not receive journal
                content.
              </li>
              <li>
                <span className="font-semibold text-qm-primary">
                  Dodo Payments
                </span>{" "}
                — payment processing for Premium subscriptions.{" "}
                <BrandName /> does not store your card details.
              </li>
            </ul>
          </section>

          {/* Deletion */}
          <section id="deletion" aria-labelledby="deletion-heading">
            <h2 id="deletion-heading" className="text-lg font-semibold text-qm-primary">
              Deletion and data export
            </h2>
            <p className="mt-2 text-qm-secondary">
              You can request deletion of your account and all associated data
              by emailing{" "}
              <a
                href={`mailto:${CONFIG.supportEmail}`}
                className="font-semibold text-qm-accent underline underline-offset-2 transition-colors duration-150 hover:text-qm-accent-hover"
              >
                {CONFIG.supportEmail}
              </a>
              . We will process deletion requests within 30 days.
            </p>
            <p className="mt-2 text-qm-secondary">
              You can request a JSON export of your journal entries by emailing
              the same address. We aim to fulfil export requests within 48
              hours. A self-serve export option from Settings is on the
              roadmap.
            </p>
          </section>

          {/* Reporting */}
          <section id="reporting" aria-labelledby="reporting-heading">
            <h2 id="reporting-heading" className="text-lg font-semibold text-qm-primary">
              Reporting a security issue
            </h2>
            <p className="mt-2 text-qm-secondary">
              If you discover a security vulnerability, please email{" "}
              <a
                href={`mailto:${CONFIG.supportEmail}`}
                className="font-semibold text-qm-accent underline underline-offset-2 transition-colors duration-150 hover:text-qm-accent-hover"
              >
                {CONFIG.supportEmail}
              </a>{" "}
              directly. We will acknowledge within 48 hours and work to resolve
              confirmed issues promptly. We do not currently run a formal bug
              bounty programme.
            </p>
          </section>

        </div>

        {/* Related links */}
        <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <Link
            href="/privacy"
            className="text-qm-accent transition-colors duration-150 hover:text-qm-accent-hover"
          >
            {lp.privacyPolicy} →
          </Link>
          <Link
            href="/terms"
            className="text-qm-accent transition-colors duration-150 hover:text-qm-accent-hover"
          >
            {lp.termsOfService} →
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-2xl border border-qm-border-card bg-qm-elevated p-5 text-sm shadow-qm-card">
          <p className="font-semibold text-qm-primary">
            {lpc.readyHeading}
          </p>
          <p className="mt-2 max-w-2xl text-xs text-qm-secondary">
            {lpc.readyBody}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link
              href="/magic-login"
              className="qm-btn-primary inline-block px-4 py-2 text-sm"
            >
              {lpc.startFreeLabel}
            </Link>
            <Link
              href="/upgrade"
              className="qm-btn-secondary inline-block px-4 py-2 text-sm"
            >
              {lpc.seePremiumLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
