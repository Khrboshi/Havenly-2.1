"use client";
// app/components/LanguageSwitcher.tsx
//
// Compact language toggle shown in the Navbar.
// Cycles between supported locales and persists the choice.

import { LOCALE_META, SUPPORTED_LOCALES } from "@/app/lib/i18n";
import { useTranslation } from "@/app/components/I18nProvider";
import type { Locale } from "@/app/lib/i18n/types";

interface Props {
  /** "compact" shows only the flag (used in tight desktop nav).
   *  "full" shows flag + native label (used in mobile menu). */
  variant?: "compact" | "full";
}

export default function LanguageSwitcher({ variant = "compact" }: Props) {
  const { locale, setLocale } = useTranslation();

  function cycleLocale() {
    const idx = SUPPORTED_LOCALES.indexOf(locale);
    const next = SUPPORTED_LOCALES[(idx + 1) % SUPPORTED_LOCALES.length] as Locale;
    setLocale(next);
  }

  const current = LOCALE_META[locale];

  if (variant === "full") {
    return (
      <div className="flex items-center gap-2 pt-1">
        {SUPPORTED_LOCALES.map((code) => {
          const meta = LOCALE_META[code];
          const active = code === locale;
          return (
            <button
              key={code}
              onClick={() => setLocale(code)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-qm-accent bg-qm-accent-soft text-qm-accent"
                  : "border-qm-card bg-qm-card text-qm-secondary hover:border-qm-accent hover:text-qm-accent"
              }`}
              aria-pressed={active}
              aria-label={`Switch to ${meta.label}`}
            >
              <span aria-hidden="true">{meta.flag}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <button
      onClick={cycleLocale}
      className="inline-flex items-center gap-1 rounded-full border border-qm-card px-2.5 py-1.5 text-xs font-medium text-qm-secondary transition-colors hover:border-qm-accent hover:text-qm-accent"
      aria-label={`Language: ${current.label}. Click to switch.`}
      title={current.label}
    >
      <span aria-hidden="true">{current.flag}</span>
      <span className="hidden sm:inline">{current.label}</span>
    </button>
  );
}
