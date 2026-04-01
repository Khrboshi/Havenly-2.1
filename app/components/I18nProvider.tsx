"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Translations } from "@/app/lib/i18n/types";
import type { LocaleDefinition } from "@/app/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, LOCALE_REGISTRY, SUPPORTED_LOCALES, getTranslations, getDir } from "@/app/lib/i18n";

interface I18nContextValue {
  locale:    string;
  t:         Translations;
  dir:       "ltr" | "rtl";
  setLocale: (code: string) => void;
  locales:   LocaleDefinition[];
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE, t: getTranslations(DEFAULT_LOCALE),
  dir: getDir(DEFAULT_LOCALE), setLocale: () => {}, locales: LOCALE_REGISTRY,
});

function detectLocale(): string {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;
  } catch {}
  return DEFAULT_LOCALE;
}

function applyToDocument(code: string) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = code;
  document.documentElement.dir  = getDir(code);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(DEFAULT_LOCALE);
  useEffect(() => { const d = detectLocale(); setLocaleState(d); applyToDocument(d); }, []);
  const setLocale = useCallback((next: string) => {
    if (!SUPPORTED_LOCALES.includes(next)) return;
    setLocaleState(next);
    applyToDocument(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
      document.cookie = `${LOCALE_STORAGE_KEY}=${next};path=/;max-age=31536000;SameSite=Lax`;
    } catch {}
  }, []);
  return (
    <I18nContext.Provider value={{ locale, t: getTranslations(locale), dir: getDir(locale), setLocale, locales: LOCALE_REGISTRY }}>
      {children}
    </I18nContext.Provider>
  );
}
export function useTranslation() { return useContext(I18nContext); }
