"use client";
// app/components/I18nProvider.tsx
//
// Provides locale state to the entire app.
// Preference is persisted in localStorage (key: "qm:locale") and
// a cookie (key: "qm:locale") so server components can read it too.
//
// Usage in any client component:
//   const { t, locale, setLocale } = useTranslation();

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Locale, Translations } from "@/app/lib/i18n/types";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  getTranslations,
} from "@/app/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  t: getTranslations(DEFAULT_LOCALE),
  setLocale: () => {},
});

function detectLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;
  } catch {}
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
      // Also set cookie so server components & middleware can read it
      document.cookie = `${LOCALE_STORAGE_KEY}=${next};path=/;max-age=31536000;SameSite=Lax`;
    } catch {}
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: getTranslations(locale), setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

/** Primary hook — use this in every client component instead of importing from copy.ts */
export function useTranslation() {
  return useContext(I18nContext);
}
