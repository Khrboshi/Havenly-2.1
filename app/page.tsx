"use client";

import Link from "next/link";
import {
  PenLine,
  BarChart3,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* HERO SECTION */}
      <section className="pt-20 pb-24 px-6 text-center bg-gradient-to-b from-white via-[var(--brand-bg)] to-[var(--brand-bg)]">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-bold text-[var(--brand-primary)] leading-tight mb-4 animate-fade-in">
            A Calmer Mind Starts With Two Sentences
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-8 animate-fade-in">
            Havenly helps you slow down, reflect gently, and build a mindful
            journaling habit—no pressure, no judgment.
          </p>

          <div className="flex justify-center gap-4 animate-fade-in">
            <Link
              href="/journal/new"
              className="px-6 py-3 rounded-xl bg-[var(--brand-primary)] text-white font-semibold hover:bg-[var(--brand-primary-dark)] transition"
            >
              Start Journaling
            </Link>

            <Link
              href="/about"
              className="px-6 py-3 rounded-xl border border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold hover:bg-[var(--brand-primary-light)] hover:text-white transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--brand-primary)] mb-12">
            Gentle Tools for Your Mind
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <FeatureCard
              icon={<PenLine className="w-8 h-8 text-[var(--brand-primary)]" />}
              title="Daily Journaling"
              description="Write freely using a clean, distraction-free editor designed for calm reflection."
            />

            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-[var(--brand-primary)]" />}
              title="Emotional Insights"
              description="See trends over time and understand what shapes your emotional patterns."
            />

            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-[var(--brand-primary)]" />}
              title="Helpful Tools"
              description="Prompts, mood tracking, and clarity exercises designed to support your wellbeing."
            />

            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-[var(--brand-primary)]" />}
              title="Privacy First"
              description="Your reflections belong to you. Havenly protects your personal space."
            />

          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-6 bg-[var(--brand-bg)] text-center">
        <h3 className="text-3xl font-bold text-[var(--brand-primary)] mb-4">
          Begin Your Reflection Journey
        </h3>

        <p className="text-lg text-gray-700 mb-8">
          It only takes a minute to create an account and start journaling.
        </p>

        <Link
          href="/magic-login"
          className="px-8 py-3 rounded-xl bg-[var(--brand-primary)] text-white font-semibold hover:bg-[var(--brand-primary-dark)] transition"
        >
          Create Free Account
        </Link>
      </section>

    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-[var(--brand-bg)] shadow-sm border">
      <div className="mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-[var(--brand-primary)] mb-2">
        {title}
      </h3>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
