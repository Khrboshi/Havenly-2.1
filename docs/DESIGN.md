# Design System — Quiet Mirror

> **This file is the canonical design system reference.**
> When this file and any other source conflict, this file wins.
> The canonical _values_ live in `app/globals.css` (CSS tokens) and `tailwind.config.ts` (Tailwind aliases). This doc describes the system, the rules, and the decisions behind them.

---

## Contents

1. [Philosophy](#1-philosophy)
2. [Source files](#2-source-files)
3. [Colour tokens](#3-colour-tokens)
   - [Surface & text](#surface--text)
   - [Accent palette](#accent-palette)
   - [Signal warm](#signal-warm)
   - [Semantic status tokens](#semantic-status-tokens)
   - [Data-visualisation tokens](#data-visualisation-tokens)
   - [Glass & shadow tokens](#glass--shadow-tokens)
4. [Tailwind aliases](#4-tailwind-aliases)
5. [Utility classes](#5-utility-classes)
   - [CTA buttons](#cta-buttons)
   - [Input](#input)
   - [Panels](#panels)
   - [Gradients & backgrounds](#gradients--backgrounds)
   - [Animation](#animation)
   - [Typography helpers](#typography-helpers)
   - [Safe-area utilities](#safe-area-utilities)
6. [Typography](#6-typography)
7. [Dark mode](#7-dark-mode)
8. [Legacy remapping layer](#8-legacy-remapping-layer)
9. [Brand constants](#9-brand-constants)
10. [RTL & Arabic support](#10-rtl--arabic-support)
11. [JavaScript colour access](#11-javascript-colour-access)
12. [Rules at a glance](#12-rules-at-a-glance)

---

## 1. Philosophy

Quiet Mirror's visual language is **quiet, honest, and non-performative** — matching the product's brand voice. The palette is warm in light mode and deep indigo-black in dark mode, with muted accents rather than vivid primaries. Interactions are subtle (small lifts, short transitions). There are no decorative streaks, badges, or gamification chrome.

**Three constraints drive every design decision:**

1. **One source of truth.** Colours, prices, and copy live in one file each. Components read from constants — they never hardcode values.
2. **System-driven theming.** Dark/light mode follows `prefers-color-scheme`. There is no manual toggle and no `class="dark"` strategy.
3. **Semantic over literal.** Use `--qm-positive` for success states, not `--qm-accent`. The token name encodes intent; the value is an implementation detail.

---

## 2. Source files

| File | What it owns |
|---|---|
| `app/globals.css` | All `--qm-*` CSS custom properties — the canonical colour values |
| `tailwind.config.ts` | Tailwind aliases that map `bg-qm-*`, `text-qm-*`, etc. to CSS variables |
| `app/lib/colors.ts` | JS/TS mirror of the token system for canvas, chart, and runtime use |
| `app/lib/config.ts` | Brand constants: `CONFIG` (10 keys) + `BRAND` derived helpers |
| `app/lib/pricing.ts` | All pricing copy and values, derived from `TRIAL_DAYS` |
| `app/lib/payment.ts` | Payment provider abstraction: provider name, routes, labels |
| `docs/DESIGN.md` | **This file** — architecture and rules |

Never hardcode a colour, price, app name, email, or URL directly in a component. Always read from the source file.

---

## 3. Colour tokens

All tokens are defined in `app/globals.css`. Dark mode values are in `:root`; light mode overrides are inside `@media (prefers-color-scheme: light)`. Every token name starts with `--qm-`.

### Surface & text

| Token | Dark mode | Light mode | Usage |
|---|---|---|---|
| `--qm-bg` | `#0a0d1a` | `#faf9f7` | Page background |
| `--qm-bg-elevated` | `#0f121f` | `#ffffff` | Cards, modals, nav |
| `--qm-bg-soft` | `#141828` | `#f2f0ed` | Tinted sections, inputs |
| `--qm-bg-card` | `#181c2e` | `#fdfcfb` | Inner card surfaces |
| `--qm-text-primary` | `#e8ebf5` | `#1c1916` | Body text, headings |
| `--qm-text-secondary` | `#bcc3db` | `#4a453f` | Supporting text |
| `--qm-text-muted` | `#8089a8` | `#706b63` | Captions, placeholders |
| `--qm-text-faint` | `#5a6178` | `#9d968d` | Timestamps, metadata |
| `--qm-border-subtle` | `rgba(184,195,219,0.10)` | `rgba(28,25,22,0.12)` | Section dividers |
| `--qm-border-card` | `rgba(184,195,219,0.08)` | `rgba(28,25,22,0.08)` | Card outlines |

**Tailwind aliases** (see §4): `bg-qm-bg`, `bg-qm-elevated`, `bg-qm-soft`, `bg-qm-card`, `text-qm-primary`, `text-qm-secondary`, `text-qm-muted`, `text-qm-faint`, `border-qm-subtle`, `border-qm-card`.

### Accent palette

The primary interactive colour. Periwinkle in dark mode, royal blue in light mode.

| Token | Dark | Light | Usage |
|---|---|---|---|
| `--qm-accent` | `#8b9dff` | `#5b6de8` | Buttons, links, focus rings |
| `--qm-accent-hover` | `#a1b1ff` | `#4a5bcc` | Hover state of above |
| `--qm-accent-soft` | `rgba(139,157,255,0.11)` | `rgba(91,109,232,0.10)` | Tinted backgrounds |
| `--qm-accent-border` | `rgba(139,157,255,0.20)` | `rgba(91,109,232,0.22)` | Accent-tinted borders |
| `--qm-accent-2` | `#9a8dc0` | `#8676ae` | Secondary accent (muted violet) |
| `--qm-accent-2-soft` | `rgba(154,141,192,0.11)` | `rgba(134,118,174,0.10)` | Accent-2 tinted backgrounds |

**Tailwind aliases**: `text-qm-accent`, `bg-qm-accent`, `bg-qm-accent-soft`, `border-qm-accent`, `bg-qm-accent-soft`.

### Signal warm

Amber/gold — used for journaling streaks, warmth cues, and amber-toned editorial moments. Not the same as `--qm-warning` (which is for caution/error states).

| Token | Dark | Light |
|---|---|---|
| `--qm-signal-warm` | `#c8aa64` | `#9a7a32` |
| `--qm-signal-warm-bg` | `rgba(200,170,100,0.10)` | `rgba(154,122,50,0.10)` |
| `--qm-signal-warm-border` | `rgba(200,170,100,0.25)` | `rgba(154,122,50,0.25)` |

No Tailwind alias — use `var(--qm-signal-warm)` inline or via `QM.signalWarm` in JS.

### Semantic status tokens

Four semantic categories, each with **7 variants** that adapt between dark and light mode for legibility. Use the token that matches the _meaning_, not the colour you want.

| Category | Use for |
|---|---|
| `--qm-positive` | Success states, saved, active, streaks |
| `--qm-premium` | Premium features, insights, upgrade prompts |
| `--qm-danger` | Destructive actions, errors, delete |
| `--qm-warning` | Caution, approaching limits, notices |

**7 variants per category** (replace `positive` with `premium`, `danger`, or `warning`):

| Suffix | Purpose |
|---|---|
| _(none)_ | Default text/icon colour |
| `-strong` | Darker/bolder variant (headings, emphasis) |
| `-hover` | Hover state of the base colour |
| `-soft` | Low-opacity tinted background |
| `-border` | Low-opacity tinted border |
| `-muted` | Semi-transparent — for secondary/supporting text |
| `-bg` | Very subtle background fill |

**Tailwind aliases**: all 4×7 = 28 aliases exist in `tailwind.config.ts` under the `qm` key. Example: `bg-qm-positive-soft`, `text-qm-danger`, `border-qm-premium-border`.

**Example pattern** — success badge:

```tsx
<span className="text-qm-positive border border-qm-positive-border bg-qm-positive-bg rounded-full px-2 py-0.5 text-xs">
  Saved
</span>
```

### Data-visualisation tokens

Fixed across themes — emotional colour associations are consistent regardless of dark/light mode. Used for journal insight charts, domain tags, and category highlights.

| Token | Hex | Emotional domain |
|---|---|---|
| `--qm-dv-positive` | `#7c9fff` | Calm, hope, gratitude, joy |
| `--qm-dv-work` | `#60a5fa` | Work, curiosity, clarity |
| `--qm-dv-love` | `#f472b6` | Love, relationship, connection |
| `--qm-dv-health` | `#fb923c` | Health, anxiety, stress |
| `--qm-dv-grief` | `#a78bfa` | Grief, confusion, doubt |
| `--qm-dv-growth` | `#86efac` | Parenting, growth |
| `--qm-dv-creative` | `#fbbf24` | Creative, shame, guilt |
| `--qm-dv-identity` | `#e879f9` | Identity, transformation |
| `--qm-dv-fitness` | `#2dd4bf` | Fitness, energy |
| `--qm-dv-fear` | `#f87171` | Fear, anger, panic |

**No Tailwind aliases** — these are CSS-variable-only. Use `var(--qm-dv-*)` in inline styles, or `QM.dv.*` in JS (see §11).

The `DOMAIN_COLOR` map in `app/lib/colors.ts` bridges AI domain strings (`WORK`, `RELATIONSHIP`, etc.) to their display colours.

### Glass & shadow tokens

| Token | Usage |
|---|---|
| `--qm-bg-glass-80` | Navbar, overlays — 80% opaque bg |
| `--qm-bg-glass-95` | Modals, toasts — 95% opaque bg |
| `--qm-shadow-soft` | Large ambient shadow for hero elements |
| `--qm-shadow-card` | Default card shadow |
| `--qm-shadow-card-lift` | Elevated/hovered card shadow |
| `--qm-focus-ring-color` | Focus outline colour (= `--qm-accent`) |
| `--qm-focus-ring-offset` | `2px` |
| `--qm-focus-ring-width` | `2px` |

**Tailwind aliases**: `shadow-qm-soft`, `shadow-qm-card`, `shadow-qm-lift`. No alias for glass tokens — use `var(--qm-bg-glass-*)` inline.

---

## 4. Tailwind aliases

`tailwind.config.ts` extends `theme.colors.qm` with aliases that resolve to CSS variables. This lets you write `bg-qm-accent` instead of `style={{ backgroundColor: "var(--qm-accent)" }}`.

**Aliased groups** (Tailwind class prefix → CSS variable):

| Prefix family | Covers |
|---|---|
| `bg-qm-*` / `text-qm-*` / `border-qm-*` | Surface, text, border tokens |
| `bg-qm-accent*` / `text-qm-accent` / `border-qm-accent` | Accent tokens |
| `bg-qm-positive*` … `bg-qm-warning*` | All 4×7 semantic status tokens |

**Not aliased** (CSS-variable-only — use `var(--qm-…)` inline):

- Data-viz tokens (`--qm-dv-*`)
- Shadow tokens (`--qm-shadow-*`)
- Glass tokens (`--qm-bg-glass-*`)
- Focus ring tokens (`--qm-focus-ring-*`)
- Signal warm tokens (`--qm-signal-warm*`)

`tailwind.config.ts` also defines `mirror.*` and `quiet.*` static palettes (the raw brand colours as a Tailwind scale) — these are for reference and edge cases. Prefer the `qm.*` aliases in components.

---

## 5. Utility classes

All defined in `app/globals.css`. These are the canonical building blocks — use them instead of assembling Tailwind classes by hand.

### CTA buttons

```tsx
// Primary — filled, accent bg, white text, rounded-full
<button className="qm-btn-primary px-5 py-2.5 text-sm">
  Start journaling
</button>

// Secondary — outlined, neutral bg, rounded-full
<button className="qm-btn-secondary px-5 py-2.5 text-sm">
  Learn more
</button>
```

Both include hover (lift + colour shift), active (reset), disabled (opacity 0.6), and focus-visible states. **Never use hardcoded Tailwind colours like `bg-emerald-500` or `bg-indigo-600` for CTAs.**

### Input

```tsx
<input className="qm-input px-4 py-3 text-sm" placeholder="Write anything..." />
<textarea className="qm-input px-4 py-4 text-sm" />
```

Includes hover border shift, focus ring (accent colour), and placeholder colour. Width is 100% by default.

### Panels

```tsx
// Standard panel — card border + elevated bg + soft shadow
<div className="qm-panel rounded-2xl p-6">…</div>

// Strong panel — heavier border + lifted shadow (modals, prominent cards)
<div className="qm-panel-strong rounded-2xl p-6">…</div>
```

Both include `backdrop-filter: blur(...)` for glass-morphism effect when overlaid on content.

### Gradients & backgrounds

```tsx
// Full-page ambient gradient (homepage, marketing pages)
<main className="bg-qm-page-gradient">

// Hero section gradient (ellipse bloom above fold)
<section className="bg-qm-hero-gradient">

// Tinted section (alternating page sections)
<section className="section-tinted">

// Purple-tinted section (insights, premium features)
<section className="section-purple-tint">

// Bottom CTA gradient (pre-footer call-to-action sections)
<section className="section-cta-gradient">
```

### Animation

**Reveal on scroll** (uses IntersectionObserver to add `.is-visible`):
```tsx
<div className="reveal">Animates in when visible</div>
<div className="reveal reveal-delay-2">Delayed by 0.2s</div>
```

**Staggered children:**
```tsx
<ul className="stagger-children">
  <li>Item 1 — 0.05s</li>
  <li>Item 2 — 0.15s</li>
  <li>Item 3 — 0.25s</li>
</ul>
```

**One-shot animations** (CSS `animation` + `opacity: 0` initial):
```tsx
<div className="animate-fade-in-up anim-delay-200">…</div>
```

Delays available: `anim-delay-0` through `anim-delay-800` (100ms steps).

Keyframe aliases: `animate-fadeIn`, `animate-dropdown`, `animate-slideDown`.

### Typography helpers

```tsx
// Readable body text — relaxed leading + slight negative tracking
<p className="qm-copy-readable">Long-form journal content</p>

// Eyebrow label — all caps, wide tracking, 11px
<span className="qm-eyebrow text-qm-muted">Insights</span>
```

### Safe-area utilities

For mobile PWA — avoid system UI occlusion:
```tsx
<nav className="pb-safe">   {/* padding-bottom: env(safe-area-inset-bottom) */}
<div className="pb-safe-4"> {/* 1rem + safe-area-inset-bottom */}
<div className="pt-safe">   {/* padding-top: env(safe-area-inset-top) */}
```

---

## 6. Typography

**Display font** (headings `h1`–`h6`): Fraunces (serif) — loaded via `var(--font-display)`. Letter-spacing `-0.02em` set globally.

**Body font**: DM Sans — loaded via `var(--font-body)`.

Both fonts are loaded in `app/layout.tsx` via Next.js `next/font` and exposed as CSS variables. Never import fonts elsewhere.

Tailwind aliases: `font-display`, `font-body`.

---

## 7. Dark mode

`darkMode: "media"` in `tailwind.config.ts` — the operating system's colour scheme preference drives theming. There is no manual toggle, no `class="dark"` on `<html>`, and no user-controlled theme setting.

**Implementation:**
- `:root` in `globals.css` contains dark mode values (default).
- `@media (prefers-color-scheme: light)` overrides to light mode values.
- Tailwind `dark:` variants work because `darkMode: "media"` maps them to the same `@media` query.

**Light mode special case:** `bg-white/N` opacity classes are invisible on the cream background — remapped via attribute selector to `var(--qm-bg-soft)`. This is handled globally in `globals.css`; no per-component fix needed.

---

## 8. Legacy remapping layer

`globals.css` contains a large remapping section at the bottom that overrides Tailwind colour classes that were used during the pre-design-system era. These `!important` overrides ensure components that still use `bg-slate-900`, `text-emerald-500`, `border-gray-700`, etc. render correctly with QM brand colours.

**What is remapped:**
- `bg-slate-*`, `bg-gray-*`, `bg-black` → `var(--qm-bg)` or `var(--qm-bg-elevated)`
- `bg-emerald-*`, `bg-green-*`, `bg-teal-*` → `var(--qm-accent)` / `var(--qm-accent-soft)`
- All corresponding `text-*`, `border-*`, `ring-*`, `from-*`, `to-*`, `via-*` colour classes
- Opacity variants (e.g. `bg-slate-900/60`, `text-white/75`) via attribute selectors

**This layer is a compatibility shim, not a design pattern.** When touching a component, migrate its classes to `qm-*` utilities or `var(--qm-*)` tokens — don't add new usages of `bg-emerald-500` or similar.

**The `--hvn-*` era is over.** The legacy `--hvn-*` CSS variables have been fully retired. The remaining `hvn` strings in the codebase are non-style identifiers — localStorage keys and the service-worker cache name — intentionally preserved. Do not rename them.

---

## 9. Brand constants

Never hardcode brand values. Always read from the source:

```ts
import { CONFIG, BRAND } from "@/app/lib/config";
import { PRICING } from "@/app/lib/pricing";
import { PAYMENT } from "@/app/lib/payment";

// Correct
<title>{BRAND.fullTitle}</title>
<p>Questions? Email <a href={`mailto:${CONFIG.supportEmail}`}>{CONFIG.supportEmail}</a></p>
<p>Try free for {PRICING.trialDays} days</p>
<p>{PAYMENT.checkoutTrustLine}</p>

// Wrong — never do this
<title>Quiet Mirror — The Journal That Reads Underneath</title>
<p>$9/month</p>
```

### CONFIG keys

| Key | Value |
|---|---|
| `appName` | `"Quiet Mirror"` |
| `tagline` | `"The Journal That Reads Underneath"` |
| `supportEmail` | `"hello@quietmirror.me"` |
| `newsletterName` | `"Quiet Mirror Letters"` |
| `emailFromAddress` | `"Quiet Mirror <hello@quietmirror.me>"` |
| `emailConfirmSubject` | `"You're in — Quiet Mirror Letters"` |
| `aiPersonaName` | `"Quiet Mirror"` |
| `themeColorDark` | `"#0b1120"` |
| `themeColorLight` | `"#f5f0eb"` |
| `siteUrl` | `process.env.NEXT_PUBLIC_SITE_URL ?? "https://quietmirror.me"` |

`BRAND.fullTitle` = `"Quiet Mirror — The Journal That Reads Underneath"`  
`BRAND.titleTemplate` = `"%s | Quiet Mirror"`

> **Note:** `themeColorDark`/`themeColorLight` are the browser chrome colours for the PWA — intentionally distinct from `--qm-bg`. They are warmer/lighter than the page background to create a softer chrome edge.

### PRICING keys

Everything derives from `TRIAL_DAYS = 3`. To change the trial length, edit that one constant — every UI string and logic gate updates automatically.

| Key | Current value |
|---|---|
| `monthlyUsd` | `9` |
| `monthly` | `"$9"` |
| `monthlyCadence` | `"$9/month"` |
| `freeMonthlyCredits` | `3` |
| `trialDays` | `3` |
| `trialLabel` | `"3-day free trial"` |
| `valueLabel` | `"3-day free trial included"` |
| `trialDayWord` | `"days"` |
| `trialFreeFor` | `"Free for 3 days"` |
| `trialNoChargeUntil` | `"no charge until day 4"` |

### PAYMENT keys

| Key | Value |
|---|---|
| `providerName` | `"Dodo Payments"` |
| `checkoutApiRoute` | `"/api/dodo/checkout"` |
| `invoicesApiRoute` | `"/api/dodo/transactions"` |
| `portalUrl()` | `"/api/dodo/portal"` |
| `portalLabel` | `"Open billing portal"` |
| `manageLabel` | `"Manage subscription"` |
| `checkoutTrustLine` | `"Secure checkout via Dodo Payments"` |
| `billingManagedLine` | `"Billing is managed securely by Dodo Payments."` |

---

## 10. RTL & Arabic support

Arabic (`ar`) is the only right-to-left locale. RTL is handled at the layout level — `app/layout.tsx` sets `dir="rtl"` on `<html>` when the locale is Arabic. Individual components require no per-element direction logic.

**Global RTL rules in `globals.css`:**
- `[dir="rtl"] body { text-align: right; }` — body text flows right-to-left
- List indentation and blockquote borders flip via `padding-inline-start/end`
- Arabic system font stack: Geeza Pro → Arabic UI Text → Arabic Typesetting → Noto Sans Arabic

**Brand name exception:** The brand name "Quiet Mirror" must always render in the Latin display font, even in Arabic context. Wrap every brand name render site in `className="font-brand-name"`:

```tsx
// app/lib/config.ts
// The CSS rule handles it:
// [dir="rtl"] .font-brand-name { font-family: var(--font-geist-sans, system-ui); }

<span className="font-brand-name">{CONFIG.appName}</span>
```

Currently applied to: `Navbar.tsx`, `Footer.tsx`, `magic-login/page.tsx` (×2), `install/page.tsx`. Apply to any new brand name render site.

**`CONFIG.appName` is never translated.** Do not put the brand name in locale string files — interpolate it as a function argument:

```ts
// en.ts
heroHeading: (appName: string) => `${appName} listens differently.`,

// Usage
<h1>{t.heroHeading(CONFIG.appName)}</h1>
```

---

## 11. JavaScript colour access

For canvas APIs, chart libraries (Recharts, D3), and anywhere a raw colour value is needed, use `app/lib/colors.ts`:

```ts
import { QM, getCssColor, DOMAIN_COLOR, resolveDomainColors } from "@/app/lib/colors";

// CSS variable reference strings (work in inline styles, React style props)
style={{ color: QM.accent }}                    // "var(--qm-accent)"
style={{ backgroundColor: QM.dv.work }}         // "var(--qm-dv-work)"

// Resolved hex values (for chart fill props, canvas drawFill, etc.)
// Call from useEffect or event handlers — NOT during SSR
const hex = getCssColor("--qm-accent")          // "#8b9dff" (dark) | "#5b6de8" (light)
const hex = getCssColor("accent")               // same — prefix optional
const hex = getCssColor(QM.accent)              // same — accepts full var() string

// Domain → colour map (AI domain strings → display colour)
const color = DOMAIN_COLOR["WORK"]              // "var(--qm-dv-work)"

// Resolve the full map to hex values (for chart library initialisation)
const palette = resolveDomainColors()           // { WORK: "#60a5fa", ... }
```

`getCssColor` is browser-only — it reads `getComputedStyle`. It is safe to call inside `useEffect`, chart render callbacks, and event handlers. It returns the input unchanged on the server (SSR-safe fallback).

---

## 12. Rules at a glance

| ✅ Do | ❌ Don't |
|---|---|
| `var(--qm-accent)` | `#8b9dff` (hardcoded hex) |
| `className="qm-btn-primary"` | `className="bg-emerald-500 rounded-full"` |
| `className="text-qm-positive"` | `className="text-green-500"` |
| `className="bg-qm-positive-soft"` | `className="bg-emerald-500/10"` |
| `CONFIG.appName` | `"Quiet Mirror"` (hardcoded string) |
| `PRICING.monthlyCadence` | `"$9/month"` (hardcoded string) |
| `PAYMENT.checkoutTrustLine` | `"Secure checkout via Dodo Payments"` |
| `var(--qm-dv-work)` | Hardcoded `#60a5fa` for chart colours |
| `className="font-brand-name"` on brand render | Bare `{CONFIG.appName}` in RTL context |
| `generateMetadata` with `getRequestTranslations()` | `export const metadata` in locale-sensitive files |
| New localStorage keys prefixed `qm:` | New keys prefixed `havenly:` or `hvn_` |
