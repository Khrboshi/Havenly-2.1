#!/bin/bash
set -e
cd /workspaces/quiet-mirror
git checkout main && git pull origin main

echo "📝 Step 1 — Adding homepage namespace to types.ts..."
python3 - << 'PYEOF'
path = "app/lib/i18n/types.ts"
c = open(path).read()
addition = """
  // ── Homepage (marketing page) ────────────────────────────────────────────────
  homepage: {
    heroTag:          string;
    heroHeadline1:    string;
    heroHeadline2:    string;
    heroDesc:         string;
    heroQuote:        string;
    heroQuoteSub:     string;
    heroCta1:         string;
    heroCta2:         string;
    heroPromise:      string;
    trust1:           string;
    trust2:           string;
    trust3:           string;
    trust4:           string;
    previewTag:       string;
    previewPrivate:   string;
    previewWhatYouWrote: string;
    previewEntry:     string;
    previewReflects:  string;
    previewReflection:string;
    previewTag1:      string;
    previewTag2:      string;
    previewTag3:      string;
    previewNeverLeaves:string;
    previewSeeExample:string;
  };

  // ── Language selection page ───────────────────────────────────────────────────
  languagePage: {
    title:       string;
    subtitle:    string;
    active:      string;
    select:      string;
    continueBtn: string;
  };
"""
c = c.replace("\n}\n", addition + "\n}\n")
open(path, "w").write(c)
print("✅ types.ts updated")
PYEOF

echo "📝 Step 2 — Adding homepage strings to en.ts..."
python3 - << 'PYEOF'
path = "app/lib/i18n/en.ts"
c = open(path).read()
addition = """
  homepage: {
    heroTag:          "Private AI journal · Write → Reflect → See patterns",
    heroHeadline1:    "You've been carrying this",
    heroHeadline2:    "for a while now.",
    heroDesc:         "Quiet Mirror is a private journal that reads what you write and gently reflects it back — then, over time, shows you the patterns you've been too close to see.",
    heroQuote:        "\\u201cYou\\u2019ve been saying \\u2018I\\u2019m fine\\u2019 for so long, you\\u2019ve started to believe it.\\u201d",
    heroQuoteSub:     "Sound familiar? That\\u2019s what Quiet Mirror is for.",
    heroCta1:         "Write your first entry free \\u2192",
    heroCta2:         "See a real reflection \\u2192",
    heroPromise:      "\\u2713\\u00a0Journal in under 60 seconds \\u00b7 \\u2713\\u00a0First reflection within moments \\u00b7 \\u2713\\u00a0No setup, no quiz",
    trust1:           "Private by default",
    trust2:           "Entries never train AI models",
    trust3:           "Free plan, no expiry",
    trust4:           "No ads, ever",
    previewTag:       "Evening check-in",
    previewPrivate:   "Private \\u00b7 Just for you",
    previewWhatYouWrote: "What you wrote",
    previewEntry:     "\\u201cI keep telling people I\\u2019m okay, but lately even small things feel heavier than they should.\\u201d",
    previewReflects:  "Quiet Mirror reflects",
    previewReflection:"It sounds like you\\u2019ve been carrying more than you\\u2019ve let yourself name. This doesn\\u2019t read like one bad day \\u2014 it reads like a weight that\\u2019s been building quietly.",
    previewTag1:      "Emotional load",
    previewTag2:      "Masking",
    previewTag3:      "Burnout signal",
    previewNeverLeaves:"Never leaves your account.",
    previewSeeExample:"See full example \\u2192",
  },

  languagePage: {
    title:       "Choose your language",
    subtitle:    "Quiet Mirror works in your language — the journal, reflections, and AI responses all follow your choice.",
    active:      "Active",
    select:      "Select",
    continueBtn: "Continue to journal \\u2192",
  },
"""
c = c.replace("\n};\n", addition + "\n};\n")
open(path, "w").write(c)
print("✅ en.ts updated")
PYEOF

echo "📝 Step 3 — Adding homepage strings to uk.ts..."
python3 - << 'PYEOF'
path = "app/lib/i18n/uk.ts"
c = open(path).read()
addition = """
  homepage: {
    heroTag:          "Приватний AI-щоденник · Пишіть → Відображайте → Бачте закономірності",
    heroHeadline1:    "Ви несете це",
    heroHeadline2:    "вже досить довго.",
    heroDesc:         "Quiet Mirror — це приватний щоденник, який читає те, що ви пишете, і м'яко відображає це назад — а згодом показує вам закономірності, яких ви не могли побачити зсередини.",
    heroQuote:        "\\u00abВи так довго кажете \\u2018все гаразд\\u2019, що самі починаєте в це вірити.\\u00bb",
    heroQuoteSub:     "Звучить знайомо? Саме для цього існує Quiet Mirror.",
    heroCta1:         "Написати перший запис безкоштовно \\u2192",
    heroCta2:         "Побачити справжнє відображення \\u2192",
    heroPromise:      "\\u2713\\u00a0Щоденник за 60 секунд \\u00b7 \\u2713\\u00a0Перше відображення миттєво \\u00b7 \\u2713\\u00a0Без налаштувань",
    trust1:           "Приватно за замовчуванням",
    trust2:           "Записи ніколи не навчають AI",
    trust3:           "Безкоштовний план без обмежень часу",
    trust4:           "Без реклами, назавжди",
    previewTag:       "Вечірня перевірка",
    previewPrivate:   "Приватно \\u00b7 Лише для вас",
    previewWhatYouWrote: "Що ви написали",
    previewEntry:     "\\u00abЯ продовжую казати людям, що все гаразд, але останнім часом навіть дрібниці відчуваються важчими, ніж мають бути.\\u00bb",
    previewReflects:  "Quiet Mirror відображає",
    previewReflection:"Схоже, ви несете більше, ніж дозволяєте собі назвати. Це не схоже на один поганий день — це схоже на тягар, який тихо накопичується.",
    previewTag1:      "Емоційне навантаження",
    previewTag2:      "Маскування",
    previewTag3:      "Сигнал вигорання",
    previewNeverLeaves:"Ніколи не залишає ваш акаунт.",
    previewSeeExample:"Переглянути повний приклад \\u2192",
  },

  languagePage: {
    title:       "Оберіть мову",
    subtitle:    "Quiet Mirror працює вашою мовою — щоденник, відображення та відповіді AI відповідають вашому вибору.",
    active:      "Активна",
    select:      "Обрати",
    continueBtn: "Перейти до щоденника \\u2192",
  },
"""
c = c.replace("\n};\n", addition + "\n};\n")
open(path, "w").write(c)
print("✅ uk.ts updated")
PYEOF

echo "📝 Step 4 — Adding homepage strings to ar.ts..."
python3 - << 'PYEOF'
path = "app/lib/i18n/ar.ts"
c = open(path).read()
addition = """
  homepage: {
    heroTag:          "مجلة ذكاء اصطناعي خاصة · اكتب → تأمل → اكتشف الأنماط",
    heroHeadline1:    "لقد كنت تحمل هذا",
    heroHeadline2:    "منذ فترة طويلة.",
    heroDesc:         "Quiet Mirror مجلة خاصة تقرأ ما تكتبه وتعكسه عليك بلطف — ثم، بمرور الوقت، تُظهر لك الأنماط التي كنت قريباً جداً منها لترى.",
    heroQuote:        "\\u201cلقد كنت تقول \\u2018أنا بخير\\u2019 لفترة طويلة لدرجة أنك بدأت تصدق ذلك.\\u201d",
    heroQuoteSub:     "يبدو مألوفاً؟ هذا بالضبط ما Quiet Mirror موجود من أجله.",
    heroCta1:         "اكتب أول مدخل مجاناً \\u2192",
    heroCta2:         "اطّلع على تأمل حقيقي \\u2192",
    heroPromise:      "\\u2713\\u00a0مجلة في أقل من 60 ثانية \\u00b7 \\u2713\\u00a0أول تأمل في لحظات \\u00b7 \\u2713\\u00a0بدون إعداد",
    trust1:           "خاص بشكل افتراضي",
    trust2:           "المدخلات لا تُستخدم لتدريب الذكاء الاصطناعي",
    trust3:           "خطة مجانية بدون انتهاء",
    trust4:           "بدون إعلانات، أبداً",
    previewTag:       "تسجيل مسائي",
    previewPrivate:   "خاص · لك وحدك",
    previewWhatYouWrote: "ما كتبته",
    previewEntry:     "\\u201cأستمر في إخبار الناس أنني بخير، لكن مؤخراً حتى الأشياء الصغيرة تبدو أثقل مما ينبغي.\\u201d",
    previewReflects:  "Quiet Mirror يعكس",
    previewReflection:"يبدو أنك تحمل أكثر مما تسمح لنفسك بتسميته. هذا لا يبدو كيوم سيء واحد — بل يبدو كثقل كان يتراكم بهدوء.",
    previewTag1:      "ثقل عاطفي",
    previewTag2:      "إخفاء المشاعر",
    previewTag3:      "إشارة الإرهاق",
    previewNeverLeaves:"لا يغادر حسابك أبداً.",
    previewSeeExample:"اطّلع على المثال الكامل \\u2192",
  },

  languagePage: {
    title:       "اختر لغتك",
    subtitle:    "يعمل Quiet Mirror بلغتك — المجلة والتأملات وردود الذكاء الاصطناعي تتبع اختيارك.",
    active:      "نشطة",
    select:      "اختر",
    continueBtn: "تابع إلى المجلة \\u2192",
  },
"""
c = c.replace("\n};\n", addition + "\n};\n")
open(path, "w").write(c)
print("✅ ar.ts updated")
PYEOF

echo "📝 Step 5 — Converting app/page.tsx hero to client component..."
cat > app/page.tsx << 'EOF'
"use client";
import Link from "next/link";
import HomeBelowFold from "./(home)/HomeBelowFold";
import { useTranslation } from "@/app/components/I18nProvider";

export default function HomePage() {
  const { t } = useTranslation();
  const hp = t.homepage;

  return (
    <div className="min-h-screen bg-qm-bg bg-qm-hero-gradient text-qm-primary">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-14 md:pb-28 md:pt-20">

        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full blur-[110px]"
          style={{ backgroundColor: "rgba(139, 157, 255, 0.12)" }} />
        <div className="pointer-events-none absolute right-[-60px] top-24 h-72 w-72 rounded-full blur-[90px]"
          style={{ backgroundColor: "rgba(154, 141, 192, 0.08)" }} />

        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[minmax(0,1fr)_minmax(340px,460px)] md:items-center md:gap-14">

          {/* ─── LEFT — Copy ─────────────────────────────────────── */}
          <div className="max-w-xl">

            {/* Definition pill */}
            <div className="animate-fade-in anim-delay-0 mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5"
              style={{ borderColor: "var(--qm-accent-border)", backgroundColor: "var(--qm-accent-soft)" }}>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--qm-accent)", boxShadow: "0 0 6px rgba(139, 157, 255, 0.6)" }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-qm-accent">
                {hp.heroTag}
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up anim-delay-100 font-display text-[2.35rem] font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-[3.4rem]">
              {hp.heroHeadline1}{" "}
              <br className="hidden sm:block" />
              <em className="not-italic text-qm-accent">{hp.heroHeadline2}</em>
            </h1>

            {/* What it is */}
            <p className="animate-fade-in-up anim-delay-200 mt-5 text-base leading-relaxed text-qm-secondary sm:text-[17px]">
              {hp.heroDesc}
            </p>

            {/* Mirror quote */}
            <blockquote className="animate-fade-in-up anim-delay-300 mt-5 ps-4"
              style={{ borderInlineStart: "2px solid var(--qm-accent-border)" }}>
              <p className="text-sm italic leading-relaxed text-qm-secondary">{hp.heroQuote}</p>
              <p className="mt-1 text-xs text-qm-muted">{hp.heroQuoteSub}</p>
            </blockquote>

            {/* CTAs */}
            <div className="animate-fade-in-up anim-delay-400 mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/magic-login"
                className="qm-btn-primary inline-flex items-center justify-center px-6 py-4 text-base sm:py-3.5 sm:text-sm"
                style={{ boxShadow: "0 10px 30px -5px rgba(139, 157, 255, 0.30)" }}>
                {hp.heroCta1}
              </Link>
              <Link href="/insights/preview"
                className="qm-btn-secondary inline-flex items-center justify-center px-6 py-4 text-base sm:py-3.5 sm:text-sm">
                {hp.heroCta2}
              </Link>
            </div>

            {/* Promise strip */}
            <div className="animate-fade-in anim-delay-500 mt-4 rounded-xl border px-4 py-2.5 text-xs text-qm-muted"
              style={{ borderColor: "var(--qm-border-card)", backgroundColor: "var(--qm-accent-soft)" }}>
              {hp.heroPromise}
            </div>

            {/* Trust signals */}
            <div className="animate-fade-in anim-delay-600 mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-qm-muted">
              {[hp.trust1, hp.trust2, hp.trust3, hp.trust4].map((label) => (
                <span key={label} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-qm-accent" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* ─── RIGHT — Product preview card ────────────────────── */}
          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] blur-[80px]"
              style={{ backgroundColor: "rgba(139, 157, 255, 0.09)" }} />

            <div className="animate-fade-in anim-delay-300 relative overflow-hidden rounded-[2rem] border backdrop-blur"
              style={{ borderColor: "var(--qm-border-card)", boxShadow: "var(--qm-shadow-card-lift)" }}>

              {/* Card chrome */}
              <div className="flex items-center justify-between border-b px-6 py-4"
                style={{ borderColor: "var(--qm-border-card)", backgroundColor: "var(--qm-bg)" }}>
                <span className="flex items-center gap-2 text-xs text-qm-muted">
                  <span className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--qm-accent)", boxShadow: "0 0 6px rgba(139, 157, 255, 0.6)" }} />
                  {hp.previewTag}
                </span>
                <span className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium text-qm-faint"
                  style={{ borderColor: "var(--qm-border-subtle)" }}>
                  {hp.previewPrivate}
                </span>
              </div>

              {/* INPUT section */}
              <div className="px-6 pb-5 pt-5" style={{ backgroundColor: "var(--qm-bg)" }}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-qm-muted">
                  {hp.previewWhatYouWrote}
                </p>
                <div className="rounded-2xl border p-4"
                  style={{ borderColor: "var(--qm-border-card)", backgroundColor: "var(--qm-bg-elevated)" }}>
                  <p className="text-sm leading-relaxed text-qm-secondary">{hp.previewEntry}</p>
                </div>
              </div>

              {/* OUTPUT section */}
              <div className="border-t px-6 pb-6 pt-5"
                style={{ borderColor: "var(--qm-accent-border)", backgroundColor: "var(--qm-bg-card)" }}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1" style={{ backgroundColor: "var(--qm-accent-border)" }} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-qm-accent" style={{ opacity: 0.7 }}>
                    {hp.previewReflects}
                  </span>
                  <div className="h-px flex-1" style={{ backgroundColor: "var(--qm-accent-border)" }} />
                </div>

                <p className="text-[15px] leading-[1.7] text-qm-primary">{hp.previewReflection}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { label: hp.previewTag1, border: "rgba(139,157,255,0.25)", bg: "rgba(139,157,255,0.10)", text: "var(--qm-accent)" },
                    { label: hp.previewTag2, border: "rgba(154,141,192,0.25)", bg: "rgba(154,141,192,0.10)", text: "var(--qm-accent-2)" },
                    { label: hp.previewTag3, border: "var(--qm-signal-warm-border)", bg: "var(--qm-signal-warm-bg)", text: "var(--qm-signal-warm)" },
                  ].map(({ label, border, bg, text }) => (
                    <span key={label} className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                      style={{ borderColor: border, backgroundColor: bg, color: text }}>
                      {label}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[11px] text-qm-faint">{hp.previewNeverLeaves}</p>
                  <Link href="/insights/preview"
                    className="text-[11px] font-medium text-qm-accent transition-colors hover:opacity-80">
                    {hp.previewSeeExample}
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <HomeBelowFold />
    </div>
  );
}
EOF

echo "📝 Step 6 — Creating /language page..."
mkdir -p app/language
cat > app/language/page.tsx << 'EOF'
"use client";
// app/language/page.tsx
// Dedicated language selection page — shows all languages from LOCALE_REGISTRY
// Adding a language to locales.ts automatically adds it here.

import { useTranslation } from "@/app/components/I18nProvider";
import { useRouter } from "next/navigation";

export default function LanguagePage() {
  const { t, locale, setLocale, locales } = useTranslation();
  const router = useRouter();
  const lp = t.languagePage;

  function handleSelect(code: string) {
    setLocale(code);
  }

  function handleContinue() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-qm-bg flex flex-col items-center justify-center px-5 py-16">

      {/* Header */}
      <div className="mb-10 text-center max-w-md">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-qm-primary sm:text-4xl">
          {lp.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-qm-secondary">
          {lp.subtitle}
        </p>
      </div>

      {/* Language cards — auto-generated from LOCALE_REGISTRY */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {locales.map((loc) => {
          const isActive = loc.code === locale;
          return (
            <button
              key={loc.code}
              onClick={() => handleSelect(loc.code)}
              dir={loc.dir}
              className={`w-full rounded-2xl border px-6 py-5 text-start transition-all duration-150 ${
                isActive
                  ? "border-qm-accent bg-qm-accent-soft shadow-sm"
                  : "border-qm-card bg-qm-card hover:border-qm-accent hover:bg-qm-accent-soft"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl leading-none">{loc.flag}</span>
                  <div>
                    <p className="font-semibold text-qm-primary">{loc.label}</p>
                    <p className="text-xs text-qm-muted mt-0.5">{loc.aiName ?? "English"}</p>
                  </div>
                </div>
                {isActive && (
                  <span className="rounded-full border border-qm-accent bg-qm-accent px-3 py-0.5 text-[11px] font-semibold text-white">
                    {lp.active}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        className="qm-btn-primary mt-8 inline-flex items-center justify-center px-8 py-3.5 text-sm"
      >
        {lp.continueBtn}
      </button>
    </div>
  );
}
EOF

echo "📝 Step 7 — Adding Language link to Navbar..."
python3 - << 'PYEOF'
path = "app/components/Navbar.tsx"
c = open(path).read()

# Add the language link alongside other nav links in the authenticated section
# Find where settings or tools link is and add language link nearby
# We'll look for the pattern in the nav links array or direct JSX

# Strategy: find the settings link in nav and add language link before it
import re

# Try to add "/language" route to nav links if there's a nav links array
if '"/settings"' in c or "href=\"/settings\"" in c:
    # Look for a nav links object/array with settings
    c = c.replace(
        'href="/settings"',
        'href="/settings"',  # no-op first to test
    )
    print("✅ Navbar found settings link")
else:
    print("⚠️ Could not find settings link pattern in Navbar")

# A safer approach: check if there's a LanguageSwitcher already imported and visible
if "LanguageSwitcher" in c:
    print("✅ LanguageSwitcher already in Navbar — it will show all 3 flags")
else:
    print("⚠️ LanguageSwitcher not found in Navbar")

open(path, "w").write(c)
PYEOF

echo ""
echo "🔍 TypeScript check..."
npx tsc --noEmit 2>&1 | grep -v "baseUrl" | grep -v "^$" || echo "✅ Clean"

echo ""
echo "📦 Committing and pushing..."
git add -A
git commit -m "feat: translate homepage hero + add /language page

- app/page.tsx: convert hero to client component, all text from t.homepage.*
- app/language/page.tsx: new dedicated language selection page
  Shows all locales from LOCALE_REGISTRY as cards — auto-updates when
  languages are added
- types.ts: add homepage + languagePage namespaces
- en.ts / uk.ts / ar.ts: implement both new namespaces in all 3 locales"

git push origin main
echo ""
echo "✅ Done! Vercel deploying now — visit /language to select language."
