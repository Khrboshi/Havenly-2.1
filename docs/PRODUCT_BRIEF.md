# Product Brief — Quiet Mirror

> **What this file is:** The business and product context for Quiet Mirror.
> It answers: who this is for, what it must deliver, what success looks like,
> and how to prioritise what to build next.
>
> **What this file is not:** A design spec (→ `DESIGN.md`), a copy map
> (→ `BRAND.md`), or a UI standards doc (→ `REQUIREMENTS.md`).
>
> **Keep this file honest.** If the target changes, update it here.

---

## 1. The business in one paragraph

Quiet Mirror is a live, production SaaS journaling product built and run
by a solo founder. The product earns revenue through a monthly Premium
subscription priced at **$25/month**. The near-term goal is to reach
**$5,000 net profit per month**. At $25/month that requires approximately
200 paying subscribers — a focused, achievable number for the right niche.

Current monthly running costs: ~$110 (AI inference via Groq, domain, tooling).

---

## 2. The user we are building for

Not a demographic. A situation:

> Someone carrying something they cannot say out loud. They are private by
> nature, skeptical of extractive tools, and not looking for advice or
> motivation. They want a place to think — and they want something to show
> them what they could not see from inside it.

More specifically:

- They write because they process through writing, not because they were told to
- They have enough self-awareness to know something is off, but not enough
  distance to name it clearly
- They value privacy deeply — the idea that their entries train AI or get sold
  is a dealbreaker
- They do not want a streak, a score, or a coach. They want recognition
- They are willing to pay for something that genuinely helps — and they will
  cancel without guilt if it does not

This user does not respond to urgency, gamification, or social proof.
They respond to honesty, specificity, and restraint.

**Secondary user types (identified via secret shopper audit, 2026-05-07):**

These users share the core response pattern but have specific trust blockers:

- **Budget-conscious new journaler** (e.g. early-career professional, first job):
  Has never journaled before. $25/month is real money. Needs proof the product works
  within the 3-day trial, not "within two weeks." Key blockers addressed: magic-link
  explainer (#196), cancel-in-Settings hint (#196), "Even 2 entries can surface
  something" FAQ (#195).

- **Privacy-obsessed technical user** (e.g. engineer, HN referral):
  Reads the privacy policy. Checks subprocessors. Wants to know what happens to data
  on cancellation and whether they can export their entries. Subprocessor transparency
  in the privacy policy is a strong trust signal for this persona. Open gap: data
  export is not yet mentioned anywhere.

- **Sophisticated evaluator** (e.g. executive coach, already journals daily):
  Wants depth evidence before paying. Will click the preview link expecting a real
  product demo. Fixed in #194: /insights/preview now shows populated DEMO_DATA for
  logged-out visitors.

---

## 3. The core promise

> *Quiet Mirror shows you what you were missing between the lines of what
> you wrote.*

Every product decision should be tested against this sentence. If a feature,
copy line, or UI pattern does not serve this promise — it does not ship.

The product is **not** therapy, a habit tracker, a mood logger, a chatbot,
or a productivity tool. It is a private journal with an AI layer that reads
underneath what the user writes and, over time, surfaces the patterns they
are too close to see.

---

## 4. What "value for money" means here

At $25/month, the user is not paying for cloud storage or a prettier textarea.
They are paying for the AI layer that reads across weeks of entries and shows
them something real. Value is communicated through:

- A reflection that makes them feel genuinely seen — not summarised
- Patterns that name something they had sensed but not been able to say
- An interface that does not get in the way
- Honesty about what the product can and cannot do

Value is **never** communicated through feature counts, comparison tables
inside the app, or "you're getting X worth of Y" framing.

---

## 5. Revenue model

| Tier | Price | What it includes |
|---|---|---|
| Free | $0 | Unlimited journaling · 3 AI reflections/month · Gentle prompts |
| Premium | $25/month | Unlimited reflections · Full pattern insights · Weekly summary · Why-this-keeps-happening layer |

**Trial:** 3 days full access, no charge until day 4. Cancel anytime from Settings.

**Refund policy:** Full refund for the first subscription period if Premium is not what
the user expected — no questions asked. Handled via hello@quietmirror.me. This must
appear as a visible trust signal near the upgrade CTA, not only in the FAQ.

Free users are real users, not a conversion funnel to be pressured.
Premium is depth added — not features locked away punitively.

All pricing constants live in `app/lib/pricing.ts → PRICING`. Changing
`monthlyUsd` there updates every UI string, logic gate, and analytics payload
automatically. Never hardcode a price string in a component.

---

## 6. The path to $5k/month net

- **Target:** 200 paying subscribers at $25/month = ~$5,000 gross
- **After costs (~$110):** ~$4,890 net
- **What that requires:** A steady conversion funnel from free → paid,
  driven by the first reflection experience being genuinely compelling

The funnel in order of leverage:

1. **First reflection** — the moment a new user gets their first AI reflection
   is the highest-leverage conversion event. If it feels generic, they leave.
   If it feels like it saw something real, they upgrade.
2. **Onboarding clarity** — a new signup should reach their first reflection
   in under 2 minutes, with no friction. (Verified end-to-end: PR #168.)
3. **The preview page** — every homepage CTA points to /insights/preview.
   For logged-out visitors it must show DEMO_DATA, not an empty skeleton.
   (Fixed PR #194.)
4. **The upgrade page** — honest, no pressure, clear on what Premium adds.
   Must always show current pricing from PRICING.* — not a cached old version.
5. **The homepage** — strong copy, live demo examples, and trust signals.
   CTA flow and credibility strip in all 6 languages (#173–#196).

---

## 7. Launch readiness checklist

- [x] **Resend email** — subscribe, one-click unsubscribe (HMAC-SHA256 token),
      confirmation page, i18n across all 6 locales, e2e tested in production (PR #170)
- [x] **PostHog analytics** — 12 custom events, localStorage persistence, 3 funnels live
      on Quiet Mirror dashboard, quietmirror.me authorized URL configured
- [x] **Onboarding** — first-reflection flow verified end-to-end (PR #168)
- [x] **Conversion copy** — safeguarding note (#179), desktop signal + privacy date (#177),
      rec cards reframed as observations not testimonials (#180)
- [x] **Price — $25/month** — live in `app/lib/pricing.ts` (PR #181)
- [x] **Credibility strip** — fr/nl/ro translations; ar/uk trailing comma fixed (#188–#192)
- [x] **Absolute claims removed** — present-tense factual across all 6 locales (PR #189)
- [x] **Preview page demo** — logged-out visitors see populated DEMO_DATA, not skeleton (PR #194)
- [x] **Infrequent-writer objection** — "Even 2 entries can surface something" in FAQ (PR #195)
- [x] **Magic-link explainer** — hero promise strip explains passwordless login (PR #196)
- [x] **Cancel path made concrete** — "go to Settings — it takes seconds" in trial explainer (PR #196)
- [ ] **Dodo Payments e2e** — integration complete. A real test transaction + withdrawal to
      bank account must be verified in the Dodo dashboard before charging real users.
      **This is the final pre-launch gate.**

---

## 8. Open conversion gaps (from secret shopper audit, 2026-05-07)

A five-persona secret shopper audit was run against the live site on 2026-05-07.
Four of seven issues were fixed same-day in PRs #194–#196.

| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | /upgrade page served stale $9/Paddle render via Vercel edge cache | Critical | Verify each session — force redeploy if stale |
| 3 | No social proof anywhere on the site | High | Open — no PR yet; needs real user data |
| 6 | Data export not mentioned in privacy policy or FAQ | Medium | Open — no PR yet |

**What the audit confirmed is working well:** hero copy ("You've been saying 'I'm fine'…"),
privacy policy subprocessor transparency (Groq link, explicit GDPR rights), sample
reflection quality on the homepage, honest "is not" positioning, independent builder story.

**Social proof — when to add and how:**
Only add when real data is available. Prefer one attributed quote (first name + role) over
a vanity user count. Must fit brand voice: no exclamation marks, no hyperbole, no
"life-changing." Do not repurpose the existing rec cards (rec1–3) as testimonials — they
are positioned as pattern observations, not user voices.

**Data export — resolution options:**
1. Build CSV/JSON export in Settings and add it to the privacy policy (preferred).
2. At minimum: add one line to the privacy policy and FAQ stating entries can be exported
   on request via hello@quietmirror.me.

---

## 9. AI infrastructure

Model: `meta-llama/llama-4-scout-17b-16e-instruct` via Groq
The `meta-llama/` prefix is required — omitting it silently breaks inference (fixed #186).
Shared via `getGroqConfig()` in `app/lib/ai/groq.ts`. Every AI call goes through this helper.

Used for:
- Generating journal reflections (`lib/ai/generateReflection.ts`)
- Domain classification of entries (WORK / RELATIONSHIP / HEALTH / MONEY / GRIEF /
  PARENTING / CREATIVE / IDENTITY / FITNESS / GENERAL)
- Auto-translating new i18n stubs into 5 languages (`.github/workflows/i18n-auto-translate.yml`)

---

## 10. Payment processor migration state

| Path | Provider | Status |
|---|---|---|
| New subscribers | Dodo Payments (`app/api/dodo/*`) | Active |
| Legacy subscribers | Stripe webhook (`app/api/stripe/webhook/`) | NEVER TOUCH |

The Stripe webhook handler must remain active until all legacy Stripe subscriptions
have expired and are confirmed inactive. Env vars STRIPE_SECRET_KEY and
STRIPE_WEBHOOK_SECRET must stay configured in Vercel until then.

---

## 11. What not to build (yet)

Things that would feel like progress but are not the constraint right now:

- More journaling prompts — the product has starter prompts; blank pages are not the problem
- Social features — fundamentally off-brand; the user chose this because it is private
- Mobile app (native) — the PWA is sufficient for launch; native is a post-revenue investment
- More AI models / providers — Groq/Llama 4 Scout is working well
- Blog content — only valuable once there is organic traffic to capture

The constraint right now is: **get the first 200 people to pay and stay.**
Everything else is a distraction until that number is reached.

---

## 12. How to use this document

When evaluating a proposed change, ask:

1. Does it serve the core promise (§3)?
2. Does it move the user toward their first paid reflection?
3. Does it respect the user we are building for (§2)?
4. Is it on the launch checklist (§7) — or is it a distraction (§11)?

If the answer to 1–3 is no, or the answer to 4 is "distraction" — it waits.
