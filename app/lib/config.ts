// app/lib/config.ts
// Single source of truth for all site-wide constants.
// Update here and every reference in the app updates automatically.

export const CONFIG = {
  /** Support email shown to users everywhere in the app */
  supportEmail: "havenly.support@gmail.com",

  /** Public site URL — falls back to Vercel preview URL */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://havenly-2-1.vercel.app",

  /** App name */
  appName: "Havenly",
} as const;
