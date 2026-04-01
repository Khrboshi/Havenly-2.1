// app/lib/i18n/locales.ts
//
// ════════════════════════════════════════════════════════
// THE ONE FILE TO EDIT WHEN ADDING A NEW LANGUAGE
// ════════════════════════════════════════════════════════
//
// TO ADD A NEW LANGUAGE:
//   1. Create app/lib/i18n/[code].ts  (implement the Translations interface)
//   2. import { [code] } from "./[code]"  below
//   3. Add one entry to LOCALE_REGISTRY
//   4. Done — active everywhere automatically
//
// TO REMOVE A LANGUAGE:
//   1. Delete app/lib/i18n/[code].ts
//   2. Remove its import and LOCALE_REGISTRY entry
//   3. Done — everything self-heals

import type { Translations } from "./types";
import { en } from "./en";
import { uk } from "./uk";
import { ar } from "./ar";

export interface LocaleDefinition {
  code:    string;
  label:   string;
  flag:    string;
  dir:     "ltr" | "rtl";
  aiName: string | null;
  strings: Translations;
}

export const LOCALE_REGISTRY: LocaleDefinition[] = [
  { code: "en", label: "English",    flag: "🇬🇧", dir: "ltr", aiName: null,       strings: en },
  { code: "uk", label: "Українська", flag: "🇺🇦", dir: "ltr", aiName: "Ukrainian", strings: uk },
  { code: "ar", label: "العربية",    flag: "🇸🇦", dir: "rtl", aiName: "Arabic",    strings: ar },
];

export type Locale = (typeof LOCALE_REGISTRY)[number]["code"];
export const SUPPORTED_LOCALES: string[] = LOCALE_REGISTRY.map((l) => l.code);
export const DEFAULT_LOCALE: string = LOCALE_REGISTRY[0].code;
export const LOCALE_STORAGE_KEY = "qm:locale";
export const LOCALE_META: Record<string, LocaleDefinition> =
  Object.fromEntries(LOCALE_REGISTRY.map((l) => [l.code, l]));

export function getTranslations(code: string): Translations {
  return LOCALE_META[code]?.strings ?? LOCALE_META[DEFAULT_LOCALE].strings;
}
export function getDir(code: string): "ltr" | "rtl" {
  return LOCALE_META[code]?.dir ?? "ltr";
}
export function getAiLanguageName(code: string): string | null {
  return LOCALE_META[code]?.aiName ?? null;
}
export function getLocaleFromCookieString(cookieHeader: string | null): string {
  if (!cookieHeader) return DEFAULT_LOCALE;
  const match = cookieHeader.match(/qm:locale=([^;]+)/);
  const val   = match?.[1]?.trim();
  return SUPPORTED_LOCALES.includes(val ?? "") ? (val as string) : DEFAULT_LOCALE;
}
export function getIntlLocale(code: string): string {
  const map: Record<string, string> = { en: "en-GB", uk: "uk-UA", ar: "ar-SA" };
  return map[code] ?? code;
}
