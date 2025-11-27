"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ---------------------------------------------------------
   Detect Standalone / Installed Mode
--------------------------------------------------------- */
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;

  // iOS Safari
  // @ts-ignore
  if (window.navigator.standalone) return true;

  // Android / Chrome
  if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  return false;
}

/* ---------------------------------------------------------
   Detect Mobile OS (for correct hint text)
--------------------------------------------------------- */
function getMobileOS(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";

  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";

  return "other";
}

/* ---------------------------------------------------------
   Mobile Add-To-Home-Screen Banner (Option A)
--------------------------------------------------------- */
function MobileInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [os, setOs] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = window.localStorage.getItem("havenly_pwa_banner_dismissed") === "1";
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

    if (!dismissed && !isStandalone() && isSmallScreen) {
      setOs(getMobileOS());
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const hint =
    os === "ios"
      ? "Tap the share icon → “Add to Home Screen”."
      : os === "android"
      ? "Open your browser menu → “Install app”."
      : "Use your browser menu to add Havenly to your home screen.";

  const dismissBanner = () => {
    window.localStorage.setItem("havenly_pwa_banner_dismissed", "1");
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-3 z-50 px-4 md:hidden">
      <div className="mx-auto max-w-xl rounded-2xl border border-emerald-500/30 bg-slate-900/95 px-4 py-3 shadow-lg shadow-emerald-900/40 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-7 w-7 flex-shrink-0 rounded-full bg-emerald-500/15 flex items-center justify-center text-xs font-semibold text-emerald-300">
            +
          </div>
          <div className="flex-1 text-sm text-slate-100">
            <p className="font-medium text-slate-50">Keep Havenly on your home screen</p>
            <p className="mt-1 text-xs text-slate-300">{hint}</p>
          </div>
          <button
            onClick={dismissBanner}
            className="ml-2 text-xs text-slate-400 hover:text-slate-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN PAGE
--------------------------------------------------------- */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 pb-24">
      <div className="mx-auto max-w-5xl px-6 pt-24 sm:px-8 lg:px-10">

        {/* ---------------------------------------------------------
           HERO SECTION (Centered)
        --------------------------------------------------------- */}
        <section className="flex flex-col items-center text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300/80">
            Havenly 2.1 · Early Access
          </p>

          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl lg:text-5xl text-balance">
            A calm space to <span className="text-emerald-300">understand your day</span> in just a few minutes.
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-300 text-pretty leading-relaxed">
            Havenly is a private micro-journal with gentle AI reflections that help you slow down,
            notice how you’re really doing, and feel a little lighter — without pressure, streaks, or judgment.
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/magic-login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
            >
              Start journaling free
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-100 transition hover:border-emerald-400 hover:text-emerald-200"
            >
              See how it works
            </a>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Free plan includes daily journaling and gentle reflections. Havenly Plus is coming soon.
          </p>

          {/* Gentle Reflection Preview */}
          <div className="mt-10 w-full max-w-3xl rounded-3xl border border-emerald-500/25 bg-slate-900/80 p-5 text-left shadow-lg shadow-emerald-900/40">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Today’s gentle reflection
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-100">
              “It sounds like today has been a lot to carry. What felt even a little lighter, and what helped you get through it?”
            </p>
            <p className="mt-3 text-[11px] text-slate-400">
              Private · AI-assisted · No tracking · No public feed
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------
           HOW IT WORKS
        --------------------------------------------------------- */}
        <section id="how-it-works" className="mt-16">
          <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-emerald-300">
            How Havenly works
          </p>

          <div className="mt-7 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl bg-slate-900/70 p-5 ring-1 ring-slate-800">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                1 — Check in
              </p>
              <h3 className="mt-2 text-sm font-semibold text-slate-50">A tiny honest pause.</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Answer a gentle prompt and jot down a few honest sentences about how you’re really doing.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900/70 p-5 ring-1 ring-slate-800">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                2 — Reflect
              </p>
              <h3 className="mt-2 text-sm font-semibold text-slate-50">Gentle AI reflections.</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Havenly reflects back what matters most in your writing — softly, like a kind friend.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900/70 p-5 ring-1 ring-slate-800">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                3 — Notice patterns
              </p>
              <h3 className="mt-2 text-sm font-semibold text-slate-50">See what keeps showing up.</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Over time, insights emerge about what energizes you — and what drains you.
              </p>
            </div>

          </div>
        </section>

        {/* ---------------------------------------------------------
           TRUST SECTION
        --------------------------------------------------------- */}
        <section className="mt-16 grid gap-10 md:grid-cols-2">

          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              Built for real life, not perfect habits.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Havenly works on your tired days, rushed mornings, quiet moments, and everything between.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              No streaks. No public feed. No pressure.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              A gentle use of AI you can trust.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              No optimisation. No coaching. No judgment.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Your words stay private and never power ads or algorithms.
            </p>
          </div>

        </section>

        {/* ---------------------------------------------------------
           FINAL CTA (Optimized — Only 1 Primary CTA)
        --------------------------------------------------------- */}
        <section className="mt-16 rounded-3xl bg-slate-900/80 px-6 py-8 text-center ring-1 ring-slate-800">
          <p className="text-sm font-semibold text-slate-50">
            Ready to try a calmer way to check in with yourself?
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Start with the free plan today. You can upgrade later for deep insights in Havenly Plus.
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              href="/magic-login"
              className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
            >
              Start journaling free
            </Link>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            Prefer to read more first?{" "}
            <Link
              href="/blog/why-gentle-journaling-works"
              className="font-medium text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline"
            >
              Explore the Havenly Journal
            </Link>
            .
          </p>
        </section>

      </div>

      {/* Mobile Bottom Banner */}
      <MobileInstallBanner />
    </main>
  );
}
