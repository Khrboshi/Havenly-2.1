import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Terms of Service
        </p>

        <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          These terms govern your use of Havenly. By creating an account or
          using the service, you agree to these terms. If you do not agree,
          please do not use Havenly.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-sm">
          <p className="text-xs text-slate-300">
            <span className="font-semibold text-slate-100">Last updated:</span>{" "}
            June 1, 2025
          </p>
          <p className="mt-2 text-xs text-slate-300">
            Questions? Contact{" "}
            <span className="font-semibold text-slate-100">
              havenly.support@gmail.com
            </span>
            .
          </p>
        </div>

        <div className="mt-10 space-y-10 text-sm">
          {/* 1 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              1. What Havenly is
            </h2>
            <p className="mt-2 text-slate-300">
              Havenly is a private journaling and AI reflection companion. It is
              not therapy, clinical care, crisis support, or a substitute for
              professional mental-health services. If you are in immediate danger
              or experiencing a crisis, please contact your local emergency
              services or a crisis helpline.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              2. Eligibility
            </h2>
            <p className="mt-2 text-slate-300">
              You must be at least 16 years old to use Havenly. By creating an
              account you represent that you meet this requirement.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              3. Your account
            </h2>
            <p className="mt-2 text-slate-300">
              You are responsible for maintaining the security of your account
              credentials (including the email used for magic-link sign-in). You
              agree to notify us promptly if you believe your account has been
              compromised.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              4. Your content
            </h2>
            <p className="mt-2 text-slate-300">
              You retain ownership of all journal entries and content you create
              in Havenly. By submitting content, you grant Havenly a limited
              licence to store, process, and display that content back to you —
              and only to you — as part of the service. We do not claim any
              other rights to your content.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              5. Acceptable use
            </h2>
            <p className="mt-2 text-slate-300">
              You agree not to use Havenly to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
              <li>Violate any applicable law or regulation.</li>
              <li>
                Attempt to gain unauthorised access to Havenly systems or other
                users&apos; data.
              </li>
              <li>
                Transmit malware, spam, or any content designed to disrupt the
                service.
              </li>
              <li>
                Use automated tools (bots, scrapers) to access or extract data
                from Havenly without written permission.
              </li>
            </ul>
            <p className="mt-3 text-slate-300">
              We reserve the right to suspend or terminate accounts that violate
              these terms.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              6. Free plan
            </h2>
            <p className="mt-2 text-slate-300">
              The free plan includes core journaling features and a limited
              number of AI reflections per month (currently 3). We may adjust
              free-plan limits over time. Free accounts that remain inactive for
              an extended period may be subject to deletion after prior notice.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              7. Premium subscription
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
              <li>
                <span className="font-semibold text-slate-100">
                  Pricing:
                </span>{" "}
                Premium is billed monthly at the price shown on the upgrade page
                at the time of purchase.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Free trial:
                </span>{" "}
                New Premium subscriptions begin with a 7-day free trial. You
                will not be charged until the trial ends. If you cancel before
                day 8, no charge is made.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Renewal:
                </span>{" "}
                After the trial, your subscription renews automatically each
                month until you cancel.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Cancellation:
                </span>{" "}
                You can cancel at any time from your Settings page. When you
                cancel, you retain access to Premium features until the end of
                the current billing period.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Refunds:
                </span>{" "}
                If Premium is not what you expected, email{" "}
                <span className="text-slate-100">
                  havenly.support@gmail.com
                </span>{" "}
                and we will issue a full refund for the first subscription
                period — no questions asked. This applies to the first billing
                cycle only.
              </li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              8. Payment processing
            </h2>
            <p className="mt-2 text-slate-300">
              Payments are processed by Stripe. By subscribing, you also agree
              to{" "}
              <a
                href="https://stripe.com/legal/consumer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline underline-offset-2 transition-colors hover:text-emerald-300"
              >
                Stripe&apos;s terms
              </a>
              . Havenly does not store your card details.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              9. AI-generated content
            </h2>
            <p className="mt-2 text-slate-300">
              Reflections and insights generated by Havenly are produced by AI
              and are intended as prompts for personal reflection only. They are
              not professional advice — medical, psychological, legal, or
              otherwise. You should not rely on AI-generated content as a
              substitute for qualified professional guidance.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              10. Privacy
            </h2>
            <p className="mt-2 text-slate-300">
              Your privacy is fundamental to Havenly. Please read our{" "}
              <Link
                href="/privacy"
                className="text-emerald-400 underline underline-offset-2 transition-colors hover:text-emerald-300"
              >
                Privacy Policy
              </Link>{" "}
              for details on how we collect, use, and protect your data.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              11. Availability and changes
            </h2>
            <p className="mt-2 text-slate-300">
              We strive to keep Havenly available and reliable, but we do not
              guarantee uninterrupted access. We may modify, suspend, or
              discontinue features at any time. We will make reasonable efforts
              to notify you of material changes.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              12. Limitation of liability
            </h2>
            <p className="mt-2 text-slate-300">
              To the fullest extent permitted by applicable law, Havenly and its
              operators are not liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of data, profits,
              or goodwill arising out of or related to your use of the service.
              Our total cumulative liability for all claims related to the
              service is limited to the amount you have paid us in the 12 months
              preceding the claim.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              13. Disclaimer of warranties
            </h2>
            <p className="mt-2 text-slate-300">
              Havenly is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; without warranties of any kind, whether express or
              implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              14. Changes to these terms
            </h2>
            <p className="mt-2 text-slate-300">
              We may update these terms from time to time. If we make material
              changes, we will update the &ldquo;Last updated&rdquo; date at the
              top and, where appropriate, notify you by email. Continued use of
              Havenly after changes are posted constitutes acceptance of the
              updated terms.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100">
              15. Contact
            </h2>
            <p className="mt-2 text-slate-300">
              For questions, concerns, or requests related to these terms, email
              us at{" "}
              <span className="font-semibold text-slate-100">
                havenly.support@gmail.com
              </span>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700">
          <Link
            href="/privacy"
            className="text-emerald-600 transition-colors hover:text-emerald-500"
          >
            Privacy Policy →
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-sm">
          <p className="font-semibold text-slate-100">
            Ready to try a private check-in?
          </p>
          <p className="mt-2 max-w-2xl text-xs text-slate-300">
            Start free. Upgrade only if it genuinely helps you go deeper with
            insights, timelines, and richer reflections.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link
              href="/magic-login"
              className="rounded-full bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Start free journaling
            </Link>
            <Link
              href="/upgrade"
              className="rounded-full border border-slate-700 px-4 py-2 font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-900"
            >
              See what Premium adds
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
