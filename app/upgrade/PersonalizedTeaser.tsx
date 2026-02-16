"use client";

import { useMemo } from "react";

function inferTheme(seed: string) {
  const s = seed.toLowerCase();

  const rules: Array<[RegExp, string]> = [
    [/(sleep|insomnia|tired|fatigue|rest)/, "rest"],
    [/(work|job|deadline|boss|office)/, "work pressure"],
    [/(family|home|kids|parent|relationship|partner)/, "relationships"],
    [/(money|rent|debt|bill|finance)/, "money tension"],
    [/(anxious|anxiety|worry|panic|fear)/, "anxiety loops"],
    [/(sad|low|down|grief|loss)/, "heavy feelings"],
    [/(anger|mad|irritat|frustrat)/, "friction"],
    [/(health|pain|sick|doctor)/, "health stress"],
  ];

  for (const [re, label] of rules) {
    if (re.test(s)) return label;
  }
  return "energy drains";
}

export default function PersonalizedTeaser() {
  const { theme, hasSeed } = useMemo(() => {
    let seed = "";
    try {
      seed = sessionStorage.getItem("havenly:last_seed") || "";
      if (!seed) {
        const url = new URL(window.location.href);
        seed = url.searchParams.get("prompt") || "";
      }
    } catch {}

    const cleaned = seed.trim();

    return {
      hasSeed: Boolean(cleaned),
      theme: inferTheme(cleaned || "energy"),
    };
  }, []);

  return (
    <p className="max-w-xl text-sm text-slate-400">
      {hasSeed ? (
        <>
          Based on your recent check-ins, there may be a recurring theme around{" "}
          <span className="blur-sm bg-white/10 px-1 rounded text-transparent select-none">
            {theme}
          </span>{" "}
          that quietly affects your mood. Premium helps you see the full pattern — gently,
          without judgment.
        </>
      ) : (
        <>Premium helps you notice what repeats over time — gently, without pressure.</>
      )}
    </p>
  );
}
