// app/lib/i18n/index.ts — barrel export, import from here everywhere
export type { Translations } from "./types";
export {
  LOCALE_REGISTRY, SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_STORAGE_KEY,
  LOCALE_META, getTranslations, getDir, getAiLanguageName,
  getLocaleFromCookieString, getIntlLocale,
} from "./locales";
export type { Locale, LocaleDefinition } from "./locales";
