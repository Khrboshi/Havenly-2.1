// app/lib/i18n/index.ts
// Central export for all i18n utilities.

export type { Translations, Locale, LocaleMetadata } from "./types";
export { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_STORAGE_KEY, LOCALE_META } from "./types";
export { en } from "./en";
export { uk } from "./uk";

import type { Locale, Translations } from "./types";
import { DEFAULT_LOCALE } from "./types";
import { en } from "./en";
import { uk } from "./uk";

const TRANSLATIONS: Record<Locale, Translations> = { en, uk };

/** Returns the translation object for a given locale. Falls back to English. */
export function getTranslations(locale: Locale | string | undefined): Translations {
  if (locale === "uk") return TRANSLATIONS.uk;
  return TRANSLATIONS.en;
}

/** Reads locale from a cookie string (for server components). */
export function getLocaleFromCookieString(cookieHeader: string | null): Locale {
  if (!cookieHeader) return DEFAULT_LOCALE;
  const match = cookieHeader.match(/qm:locale=([^;]+)/);
  const val = match?.[1];
  if (val === "uk") return "uk";
  return DEFAULT_LOCALE;
}
