// app/components/BrandName.tsx
// Server-safe (no "use client") — usable in server components, layouts,
// and client components alike.
//
// Renders CONFIG.appName wrapped in the font-brand-name class so the
// Latin display font is preserved in RTL (Arabic) contexts.
// See docs/DESIGN.md §10 and the [dir="rtl"] .font-brand-name rule in globals.css.
//
// Usage:
//   import BrandName from "@/app/components/BrandName";
//   <BrandName />                          // → <span class="font-brand-name">Quiet Mirror</span>
//   <BrandName className="font-semibold" /> // → additional classes merged in

import { CONFIG } from "@/app/lib/config";

interface BrandNameProps {
  /** Additional Tailwind classes to apply alongside font-brand-name */
  className?: string;
}

export default function BrandName({ className }: BrandNameProps) {
  const classes = ["font-brand-name", className].filter(Boolean).join(" ");
  return <span className={classes}>{CONFIG.appName}</span>;
}
