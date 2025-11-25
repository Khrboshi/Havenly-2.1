"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [showInstallHint, setShowInstallHint] = useState(false);

  // Detect mobile + PWA capability
  useEffect(() => {
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints || 0) > 1;

    const supportsPWA =
      "standalone" in window.navigator ||
      window.matchMedia("(display-mode: standalone)").matches;

    if (isMobile && !supportsPWA) {
      setShowInstallHint(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white px-6 pt-20 pb-32">
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Left Side */}
        <div>
          <p className="text-xs tracking-wide text-[#7ddfc3] mb-4">
            HAVENLY 2.1 • EARLY ACCESS
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            A calm space to <span className="text-[#54E1B3]">decompress your day</span> in just a few minutes.
          </h1>

          <p className="text-lg text-gray-300 mb-8 max-w-lg">
            Write a few honest sentences each day, and Havenly’s gentle AI reflection helps you see your day with more clarity and compassion — no pressure, no streaks, no public feed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              href="/magic-login"
              className="bg-[#47D7A9] text-black font-semibold px-6 py-3 rounded-full hover:bg-[#35c497] transition"
            >
              Start journaling free
            </Link>
            <Link
              href="/login"
              className="text-gray-300 hover:text-white underline text-sm self-center"
            >
              Log in
            </Link>
          </div>

          {/* Benefits List */}
          <ul className="text-sm text-gray-400 space-y-1 mb-10">
            <li>• Free forever for daily journaling.</li>
            <li>• Premium deeper insights coming soon — optional upgrade.</li>
            <li>• Your entries stay private — no ads, no social profile.</li>
          </ul>

          {/* Mobile Install Hint */}
          {showInstallHint && (
            <div className="mt-4 text-sm text-[#9be8d1] border border-[#234] rounded-lg p-3 max-w-sm">
              Add Havenly to your phone’s home screen for faster nightly check-ins.
            </div>
          )}
        </div>

        {/* Right Side – Preview */}
        <div className="hidden md:block opacity-95">
          <Image
            src="/preview-card.png"
            alt="Havenly preview"
            width={500}
            height={600}
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto mt-24 grid md:grid-cols-3 gap-8 text-gray-300">
        <div className="border border-[#1a2333] p-6 rounded-xl">
          <h3 className="text-[#54E1B3] font-semibold mb-2">1 · CHECK IN</h3>
          <p>Answer a gentle prompt and jot down a few honest sentences.</p>
        </div>

        <div className="border border-[#1a2333] p-6 rounded-xl">
          <h3 className="text-[#54E1B3] font-semibold mb-2">2 · REFLECT</h3>
          <p>AI offers a soft reflection — a kinder angle that helps you see your day differently.</p>
        </div>

        <div className="border border-[#1a2333] p-6 rounded-xl">
          <h3 className="text-[#54E1B3] font-semibold mb-2">3 · NOTICE PATTERNS</h3>
          <p>See what energizes you, what drains you, and what to protect or change.</p>
        </div>
      </section>
    </main>
  );
}
