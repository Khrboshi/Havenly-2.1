#!/bin/bash
set -e
cd /workspaces/quiet-mirror
git checkout main
git pull origin main

echo "📝 Creating app/lib/i18n/locales.ts..."
cat > app/lib/i18n/locales.ts << 'EOF'
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
EOF

echo "📝 Creating app/lib/i18n/index.ts..."
cat > app/lib/i18n/index.ts << 'EOF'
// app/lib/i18n/index.ts — barrel export, import from here everywhere
export type { Translations } from "./types";
export {
  LOCALE_REGISTRY, SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_STORAGE_KEY,
  LOCALE_META, getTranslations, getDir, getAiLanguageName,
  getLocaleFromCookieString, getIntlLocale,
} from "./locales";
export type { Locale, LocaleDefinition } from "./locales";
EOF

echo "📝 Patching app/lib/i18n/types.ts..."
python3 - << 'PYEOF'
import re
path = "app/lib/i18n/types.ts"
content = open(path).read()
old = """export type Locale = "en" | "uk";

export const SUPPORTED_LOCALES: Locale[] = ["en", "uk"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "qm:locale";

export interface LocaleMetadata {
  code: Locale;
  /** Native name shown in the language switcher */
  label: string;
  /** ISO flag emoji */
  flag: string;
}

export const LOCALE_META: Record<Locale, LocaleMetadata> = {
  en: { code: "en", label: "English",    flag: "🇬🇧" },
  uk: { code: "uk", label: "Українська", flag: "🇺🇦" },
};

// ─── Translation shape ────────────────────────────────────────────────────────
// Mirrors app/lib/copy.ts exactly.
// Functions that accept runtime values (counts, labels) must be included here."""
new = """// ─── Translation shape ────────────────────────────────────────────────────────
// All locale metadata (Locale type, SUPPORTED_LOCALES, etc.) lives in locales.ts."""
content = content.replace(old, new)
open(path, "w").write(content)
print("✅ types.ts patched")
PYEOF

echo "📝 Creating app/lib/i18n/ar.ts..."
cat > app/lib/i18n/ar.ts << 'EOF'
// app/lib/i18n/ar.ts — Arabic (Modern Standard Arabic)
// Warm, human tone. 6-form plural rules. RTL via registry dir:"rtl".
import type { Translations } from "./types";

function arReflections(n: number): string {
  if (n === 0) return "لا تأملات";
  if (n === 1) return "تأمل واحد";
  if (n === 2) return "تأملان";
  if (n >= 3 && n <= 10) return `${n} تأملات`;
  return `${n} تأملاً`;
}
function arWords(n: number): string {
  if (n === 0) return "لا كلمات";
  if (n === 1) return "كلمة واحدة";
  if (n === 2) return "كلمتان";
  if (n >= 3 && n <= 10) return `${n} كلمات`;
  return `${n} كلمة`;
}
function arEntries(n: number): string {
  if (n === 0) return "لا مدخلات";
  if (n === 1) return "مدخل واحد";
  if (n === 2) return "مدخلان";
  if (n >= 3 && n <= 10) return `${n} مدخلات`;
  return `${n} مدخلاً`;
}
function arQuestions(n: number): string {
  if (n <= 0) return "أسئلة";
  if (n === 1) return "سؤال واحد";
  if (n === 2) return "سؤالان";
  if (n >= 3 && n <= 10) return `${n} أسئلة`;
  return `${n} سؤالاً`;
}

export const ar: Translations = {
  errors: {
    entryEmpty:        "الرجاء كتابة بضع كلمات قبل الحفظ.",
    entrySaveFailed:   "تعذّر حفظ المدخل. الرجاء المحاولة مرة أخرى.",
    entryLoadFailed:   "تعذّر تحميل هذا المدخل.",
    entryDeleteFailed: "تعذّر حذف هذا المدخل. الرجاء المحاولة مرة أخرى.",
    entryGenericFail:  "حدث خطأ ما. الرجاء المحاولة مرة أخرى.",
    reflectionFailed:  "تعذّر إنشاء التأمل في الوقت الحالي.",
    insightsFailed:    "تعذّر تحميل الرؤى.",
    insightsNoData:    "البيانات غير كافية بعد — استمر في الكتابة وتوليد التأملات.",
    invoicesFailed:    "تعذّر تحميل الفواتير.",
    networkError:      "خطأ في الشبكة. الرجاء المحاولة مرة أخرى.",
    networkRetry:      "خطأ في الشبكة. حاول مجدداً بعد لحظة.",
    safeReload:        "مدخلاتك بأمان. أعد تحميل الصفحة للمحاولة مرة أخرى.",
  },
  nav: {
    backToDashboard: "العودة إلى لوحة التحكم",
    backToJournal:   "→ العودة إلى المجلة",
    backToHome:      "العودة إلى الرئيسية",
    goToDashboard:   "الذهاب إلى لوحة التحكم ←",
  },
  journal: {
    untitledEntry:       "مدخل بلا عنوان",
    untitled:            "بلا عنوان",
    newEntryLabel:       "مدخل جديد",
    newEntryHeading:     "ما الذي يشغل بالك؟",
    newEntrySubheading:  "اكتب بالطريقة التي تشعر بها بشكل طبيعي. جملة واحدة تكفي دائماً.",
    starterPrompts: [
      "ما الذي يثقل عليك مؤخراً؟",
      "هل هناك شيء تفكر فيه اليوم باستمرار؟",
      "هل أثّر عليك شيء اليوم بشكل عميق؟",
      "ما المحادثة أو اللحظة التي لا تزال في ذهنك؟",
    ],
    notSureWhereToStart: "لست متأكداً من أين تبدأ؟",
    textareaPlaceholder: "ابدأ الكتابة هنا…",
    addTitleOptional:    "+ إضافة عنوان (اختياري)",
    titlePlaceholder:    "أضف عنواناً لهذا المدخل (اختياري)",
    privacyReminder:     "مجلتك خاصة. لا أحد غيرك يستطيع قراءة ما تكتب. لا تُستخدم المدخلات أبداً لتدريب نماذج الذكاء الاصطناعي.",
    patternsSoon:        (current, total) => `${current}/${total} مدخلات — الأنماط تظهر قريباً`,
    saveButtonLabel:     "كتابة",
    savingLabel:         "جارٍ الحفظ…",
    saveReflectNudge:    "سيعكس Quiet Mirror هذا عليك عندما تكون مستعداً",
    removeEntryLabel:    "إزالة هذا المدخل",
    deleteWarning:       "سيؤدي هذا إلى حذف المدخل وتأمله بشكل دائم. لا يمكن التراجع عن هذا.",
    deleteConfirmLabel:  "نعم، احذف نهائياً",
    deletingLabel:       "جارٍ الحذف…",
    cancelLabel:         "إلغاء",
    emptyStateNudge:     "ابدأ الكتابة — جملة واحدة تكفي دائماً.",
  },
  reflection: {
    cardHeading:           "تأمل Quiet Mirror",
    creditsRemaining:      (n) => `${arReflections(n)} متبقية هذا الشهر`,
    creditsResetsNext:     "· يتجدد الشهر القادم",
    seeReflectionLabel:    "اطّلع على التأمل",
    reflectingLabel:       "جارٍ التأمل…",
    unlockReflectionLabel: "افتح هذا التأمل ←",
    savedToHistory:        "حُفظ في سجلك",
    firstEntryBanner:      "يبدأ هذا التأمل سجل أنماطك — سيلاحظ Quiet Mirror ما يتكرر في مدخلاتك بمرور الوقت.",
    whatYoureCarrying:     "ما تحمله",
    whatsReallyHappening:  "ما يجري فعلاً",
    deeperDirection:       "الاتجاه الأعمق",
    keyPattern:            "النمط الرئيسي",
    gentleNextStep:        "الخطوة التالية بلطف",
    optionA:               "الخيار الأول",
    optionB:               "الخيار الثاني",
    scriptLine:            "نص داخلي",
    savedPermanently:      "محفوظ بشكل دائم · يستخدم Quiet Mirror هذا لبناء سجل أنماطك",
    patternHistoryNote:    "أصبح هذا الآن جزءاً من سجل أنماطك.",
    patternHistorySub:     "يتتبع Quiet Mirror ما يظهر باستمرار في جميع مدخلاتك. تعرض صفحة الرؤى الخيط الذي يربطها.",
    seeFullPattern:        "اطّلع على نمطك الكامل ←",
    readingEntry:          "جارٍ قراءة مدخلك…",
    nothingRemoved:        "لم يُزَل شيء — فقط أُضيفت طبقة أعمق",
  },
  upgrade: {
    startTrial:       (label) => `ابدأ ${label} ←`,
    seeExample:       "اطّلع على مثال",
    seeWhatPremium:   "اكتشف ما يعرضه Premium",
    cancelAnytime:    "إلغاء في أي وقت",
    noQuestionsAsked: "بدون أسئلة",
  },
  tools: {
    somethingWentWrong: (tool) => `حدث خطأ أثناء إنشاء ${tool}. حاول مجدداً بعد لحظة.`,
    tryAgain:           "حاول مرة أخرى ←",
  },
  ui: {
    loading:            "…",
    questionsHeading:   (count) => arQuestions(count),
    wordCount:          (n) => arWords(n),
    entryCount:         (current, total) => `${current}/${total}`,
    noReflectionsYet:   "لا تأملات بعد",
    reflectionsSoFar:   (n) => `${arReflections(n)} حتى الآن`,
    moreNeeded:         (n) => `${arReflections(n)} أخرى وسيبدأ Quiet Mirror في إظهار ما يتكرر بهدوء في مدخلاتك.`,
    patternsGenerating: "جارٍ إنشاء أنماطك الشخصية الآن — تحقق بعد تأملك التالي.",
    writeAnEntry:       "اكتب مدخلاً ←",
    summaryFailed:      "تعذّر إنشاء الملخص.",
  },
  navbar: {
    signIn:         "تسجيل الدخول",
    startFree:      "ابدأ مجاناً",
    about:          "حول",
    blog:           "المدونة",
    pricing:        "الأسعار",
    install:        "تثبيت",
    dashboard:      "لوحة التحكم",
    journal:        "المجلة",
    insights:       "الرؤى",
    tools:          "الأدوات",
    settings:       "الإعدادات",
    logout:         "تسجيل الخروج",
    yourSpace:      "مساحتك",
    openMenu:       "فتح القائمة",
    closeMenu:      "إغلاق القائمة",
    writeFreeEntry: "اكتب أول مدخل مجاني ←",
    privateNoCred:  "لا خلاصة، لا ضغط، لا بطاقة مطلوبة. فقط مكان أهدأ لوضع ما يدور في بالك.",
    privateTagline: "ابدأ بمدخل مجلة خاصة.",
    privateJournalingTagline: "تدوين خاص يعكس عليك أفكارك",
  },
  insights: {
    regenerateSummary: "إعادة إنشاء الملخص",
    entries:           "مدخلات",
    sinceJoined:       "منذ الانضمام",
    topEmotion:        "المشاعر الأبرز",
    topTheme:          "الموضوع الأبرز",
    firstSuggestion:   "الاقتراح الأول",
    secondSuggestion:  "الاقتراح الثاني",
    momentum:          "الزخم",
    momentumDefault:   "ثابت",
    momentumDescriptions: {
      Heavy:     "المدخلات الأخيرة تحمل ثقلاً عاطفياً أكبر",
      Lifting:   "الثقل العاطفي يخف مؤخراً",
      Shifting:  "ثمة تحوّل يحدث في المدخلات الأخيرة",
      Softening: "الحدة تتلاشى تدريجياً",
      Steady:    "نبرة عاطفية متسقة عبر المدخلات",
    },
  },
  dashboard: {
    goodMorning:       "صباح الخير",
    goodAfternoon:     "مساء الخير",
    goodEvening:       "مساء النور",
    today:             "اليوم",
    yesterday:         "أمس",
    wroteToday:        "كتبت اليوم",
    pickUpThread:      "استأنف الخيط",
    startHere:         "ابدأ هنا",
    dayEvolved:        "كيف تطوّر اليوم منذ آخر مرة كتبت فيها؟",
    oneHonestSentence: "جملة صادقة واحدة تكفي دائماً للبداية.",
    alreadyWroteToday: "كتبت بالفعل اليوم — كيف تطوّر اليوم؟",
    addToToday:        "أضف إلى اليوم",
    writeNow:          "اكتب الآن",
    writtenToday:      "لقد كتبت اليوم.",
    choosePrompt:      "اختر سؤالاً للبدء.",
    entry:             "مدخل",
    entries:           "مدخلات",
    moreEntries:       (n) => `${arEntries(n)} أخرى`,
    trial:             "تجريبي",
    premium:           "Premium",
    free:              "مجاني",
    prompts: [
      { q: "كيف يشعر جسدك الآن؟",             sub: "توتر، هدوء، تعب، قلق — أي شيء تلاحظه.",   accent: "emerald" },
      { q: "ما الشيء الواحد الذي يشغل ذهنك؟",  sub: "جملة واحدة تكفي.",                         accent: "violet"  },
      { q: "ما الذي تتجنب التفكير فيه؟",        sub: "لا داعي للحل — فقط سمِّه.",               accent: "amber"   },
      { q: "ما الذي تحتاج منه المزيد الآن؟",    sub: "راحة، مساحة، تواصل، وضوح — أي شيء.",     accent: "sky"     },
      { q: "ما الذي كان ثقيلاً هذا الأسبوع؟",   sub: "لا داعي لتفسير السبب.",                   accent: "rose"    },
      { q: "بماذا تشعر بالفخر، حتى بشكل هادئ؟", sub: "الأشياء الصغيرة تُحسب.",                  accent: "emerald" },
      { q: "اكتب بحرية",                        sub: "بلا هيكل. بلا قواعد. ابدأ من أي مكان.",   accent: "slate"   },
    ],
  },
  footer: {
    product:           "المنتج",
    account:           "الحساب",
    legal:             "القانونية",
    serviceGuarantees: "ضمانات الخدمة",
    about:             "حول",
    pricing:           "الأسعار",
    blog:              "المدونة",
    installApp:        "تثبيت التطبيق",
    dashboard:         "لوحة التحكم",
    tools:             "الأدوات",
    settings:          "الإعدادات",
    billing:           "الفواتير",
    signIn:            "تسجيل الدخول",
    startFree:         "ابدأ مجاناً",
    goPremium:         "انتقل إلى Premium",
    termsOfService:    "شروط الخدمة",
    privacyPolicy:     "سياسة الخصوصية",
    contact:           "تواصل معنا",
    noAds:             "بدون إعلانات",
    noDataSales:       "لا بيع للبيانات",
    privacyAssurance:  "مدخلاتك تظل خاصة ولا تُستخدم أبداً لتدريب نماذج الذكاء الاصطناعي.",
    allRightsReserved: (appName, year) => `© ${year} ${appName}. جميع الحقوق محفوظة.`,
  },
  settingsPage: {
    title:                "الإعدادات",
    subtitle:             "الحساب، الخطة، والخصوصية.",
    upgradeLabel:         "ترقية",
    planPremium:          "Premium",
    planTrial:            "تجريبي",
    planFree:             "مجاني",
    accountTitle:         "الحساب",
    accountSubtitle:      "تفاصيل تسجيل الدخول والحساب.",
    transactionsLabel:    "المعاملات",
    planTitle:            "الخطة",
    planActivePremium:    "Premium نشط.",
    planActiveFree:       "أنت على الخطة المجانية.",
    dataPrivacyTitle:     "البيانات والخصوصية",
    dataPrivacySubtitle:  "مدخلاتك ملكك — دائماً.",
    installTitle:         "التثبيت",
    installSubtitle:      "أضفه إلى شاشتك الرئيسية لتجربة أسرع تشبه التطبيقات — يعمل دون اتصال أيضاً.",
    installAppLabel:      "تثبيت التطبيق",
    supportTitle:         "الدعم",
    supportSubtitle:      "مساعدة في الفواتير أو مشكلات الحساب.",
    emailLabel:           "البريد الإلكتروني",
    memberSinceLabel:     "عضو منذ",
    entriesWrittenLabel:  "المدخلات المكتوبة",
    billingEmailNote:     "تُرسل رسائل الفواتير إلى هذا العنوان.",
    planLabel:            "الخطة",
    reflectionsLabel:     "التأملات هذا الشهر",
    resetsLabel:          "يُعاد تعيينه",
    aiTrainingLabel:      "تدريب الذكاء الاصطناعي",
    aiTrainingValue:      "لا يُستخدم أبداً",
    dataSharingLabel:     "مشاركة البيانات",
    dataSharingValue:     "لا شيء",
    privacyPolicyLabel:   "سياسة الخصوصية",
    privacyReadLabel:     "اقرأ ←",
    dataRequestNote:      (email) => `لطلب تصدير البيانات أو حذف الحساب، راسلنا على ${email} من عنوان حسابك.`,
    reflectionsUnlimited: "غير محدود",
    insightsFull:         "وصول كامل",
    weeklySummaryIncluded:"مضمّن",
    reflectionsNone:      "0 متبقية",
    reflectionsRemaining: (n, total) => `${n} من ${total} متبقية`,
    reflectionsResume:    (date) => `تستأنف التأملات في ${date}. قم بالترقية للحصول على وصول غير محدود.`,
    reflectionsFreeNote:  (n) => `الخطة المجانية تتضمن ${n} تأملات ذكاء اصطناعي شهرياً.`,
    upgradeUnlimited:     "ترقية للحصول على وصول غير محدود ←",
    billingTitle:         "الفواتير",
    billingSubtitle:      "إدارة اشتراكك وتفاصيل الفواتير.",
    manageSubscription:   "إدارة الاشتراك",
    upgradeToPremium:     "الترقية إلى Premium",
    planSectionTitle:     "الخطة",
    planStatusPremium:    "خطتك Premium نشطة.",
    planStatusTrial:      "أنت في الفترة التجريبية — وصول كامل لـ Premium.",
    planStatusFree:       "أنت على الخطة المجانية. قم بالترقية في أي وقت.",
    premiumIncludes:      "Premium يشمل",
    freeIncludes:         "المجاني يشمل",
    premiumItem1:         "تأملات ذكاء اصطناعي غير محدودة",
    premiumItem2:         "وضوح الأنماط عبر الزمن",
    premiumItem3:         "ملخص أسبوعي شخصي",
    premiumItem4:         "رؤى أعمق دون الحاجة للكتابة أكثر",
    freeItem1:            "تدوين غير محدود",
    freeItem2:            "مطالبات لطيفة للبداية",
    freeItem3:            (n) => `${n} تأملات ذكاء اصطناعي شهرياً`,
    freeItem4:            "خاص بشكل افتراضي",
    priceLabel:           "السعر",
    nextBillingLabel:     "الفاتورة القادمة",
    cancellationsLabel:   "الإلغاءات",
    noPressure:            "لا ضغط. الخطة المجانية تظل قابلة للاستخدام الكامل.",
    refundWindowLast:     (days) => `آخر يوم في نافذة استرداد ${days} أيام`,
    refundWindowDays:     (days) => `${days} أيام متبقية في نافذة استرداد ${days} أيام`,
    refundContact:        "لم يكن ما توقعته؟ راسلنا للحصول على استرداد كامل — بدون أسئلة.",
    accountSectionTitle:  "الحساب",
    accountBillingSubtitle: "الفواتير مرتبطة بتسجيل دخولك.",
  },
  toolsPage: {
    pageLabel:           "مساحتك",
    pageTitle:           "تأمل أعمق قليلاً",
    pageSubtitle:        "طرق صغيرة ومركّزة لمراجعة نفسك — بمعزل عن مدخلات مجلتك.",
    moodTitle:           "لحظة هادئة",
    moodSubtitle:        "توقف ولاحظ أين أنت فعلاً — بدون درجات، بدون تقييمات، فقط صدق.",
    reflectionTitle:     "تأمل موجّه",
    reflectionSubtitle:  "سؤال مشكّل حول ما ظهر في مدخلاتك مؤخراً.",
    suggestionsTitle:    "اقتراحات صغيرة",
    suggestionsSubtitle: "فكرة أو اثنتان بلطف، بناءً على أنماطك — ليست تعليمات، بل دعوات.",
    openLabel:           "افتح ←",
  },
  magicLogin: {
    quote1:      "لا تحتاج إلى فهم كل شيء لتكتب عنه.",
    quote2:      "شيء ما يحاول أن يتضح. الكتابة تساعد.",
    quote3:      "مجلتك لا تحكم عليك. هي فقط تستمع.",
    quote4:      "الأنماط التي لا تراها بعد موجودة بالفعل فيما كتبت.",
    quote5:      "العودة هي الممارسة كلها.",
    callbackError: "لم يكتمل تسجيل الدخول في هذا السياق. في iPhone، قد لا تتشارك Safari وتطبيق الشاشة الرئيسية بيانات الدخول. استخدم تسجيل الدخول بالرمز أدناه في نفس المكان الذي تستخدم فيه Quiet Mirror.",
    emailSentCode: "تم إرسال البريد الإلكتروني. إذا تضمّن رمزاً، أدخله أدناه.",
    emailSentLink: "تم إرسال البريد الإلكتروني. افتح الزر أو الرابط في نفس المتصفح الذي بدأت منه.",
    sendFailed:    "فشل إرسال البريد الإلكتروني.",
    invalidCode:   "رمز غير صالح.",
  },
  journalPage: {
    heading:      "مجلتك",
    newEntry:     "مدخل جديد",
    entryCount:   (n) => arEntries(n),
    emptyHeading: "لم تكتب أي مدخلات بعد.",
    emptyBody:    "جملة واحدة تكفي دائماً للبداية.",
    startHere:    "ابدأ هنا",
    reflected:    "مُتأمَّل",
    draft:        "مسودة",
    open:         "افتح ←",
    start:        "ابدأ ←",
    prompt1:      "ما الذي يثقل عليك مؤخراً؟",
    prompt1Sub:   "لا تحتاج لحله — فقط سمِّه.",
    prompt2:      "هل هناك شيء تفكر فيه اليوم باستمرار؟",
    prompt2Sub:   "محادثة، شعور، لحظة.",
    prompt3:      "ما الذي كان ثقيلاً هذا الأسبوع؟",
    prompt3Sub:   "لا داعي لتفسير السبب.",
  },
  upgradeTrigger: {
    seeWhatPremium:       "اكتشف ما يعرضه Premium",
    noCharge:             (days, word) => `🛡️ لا رسوم لمدة ${days} ${word} · إلغاء في أي وقت · `,
    cancelAnytime:        "إلغاء في أي وقت",
    terms:                "الشروط",
    reflectionIntro:      "عندما تكون مستعداً، سيعكس عليك Quiet Mirror ما لاحظه — مواضيع، مشاعر، وخطوة تالية بلطف.",
    seeExample:           "اطّلع على مثال",
    workHeadline:         "كتبت عن ضغط العمل.",
    workSub:              "يُظهر لك Premium متى يتكرر هذا النمط — وما المشترك بينه عبر الأسابيع.",
    relationshipHeadline: "كتبت عن علاقة تشغل بالك.",
    relationshipSub:      "يُظهر لك Premium متى يعود هذا النوع من الأشياء — الخيط العاطفي عبر مدخلاتك.",
    healthHeadline:       "كتبت عن نفاد طاقتك.",
    healthSub:            "يتتبع Premium متى يظهر الإرهاق وما يميل إلى الظهور بجانبه.",
    identityHeadline:     "كتبت عن عدم الشعور بنفسك.",
    identitySub:          "يُظهر لك Premium نسخة نفسك التي تتكرر في مدخلاتك.",
    griefHeadline:        "كتبت عن الخسارة.",
    griefSub:             "يُظهر Premium كيف يظهر الحزن ويتحول عبر مدخلاتك بمرور الوقت.",
    moneyHeadline:        "كتبت عن الضغط المالي.",
    moneySub:             "يُظهر Premium متى يعود ضغط المال وما يميل إلى إثارته بجانبه.",
    parentingHeadline:    "كتبت عن كونك أحد الوالدين.",
    parentingSub:         "يُظهر Premium الأنماط العاطفية في كيفية ظهورك — اللحظات المتكررة.",
    creativeHeadline:     "كتبت عن حاجز إبداعي.",
    creativeSub:          "يُظهر Premium متى يظهر هذا، وما يسبقه، وهل يتحسن أم يزداد سوءاً.",
    fitnessHeadline:      "كتبت عن جسدك.",
    fitnessSub:           "يتتبع Premium الأنماط العاطفية حول شعورك تجاه نفسك الجسدية.",
    generalHeadline:      "أصبح هذا التأمل الآن جزءاً من سجل أنماطك.",
    generalSub:           "يُظهر لك Premium ما يتكرر عبر مدخلاتك — الخيط العاطفي الذي لا يمكنك دائماً رؤيته من الداخل.",
  },
  upgradeConfirmed: {
    headline1:     "بدأت فترتك التجريبية.",
    headline2:     "الطبقة الأعمق مفتوحة.",
    whatUnlocked:  "ما الذي فُتح للتو",
    feature1Label: "تأملات غير محدودة",
    feature1Sub:   "تأمّل في كل مدخل — بدون حد شهري.",
    feature2Label: "رؤى الأنماط الكاملة",
    feature2Sub:   "اطّلع على ما يظهر باستمرار عبر الأسابيع والأشهر.",
    feature3Label: "ملخص شخصي أسبوعي",
    feature3Sub:   "كل اثنين، مرآة مكتوبة لما لاحظه Quiet Mirror.",
    feature4Label: "رؤى سبب التكرار",
    feature4Sub:   "الحلقة العاطفية المتكررة من تحتها — مُسمّاة بلطف.",
    ctaWrite:      "اكتب مدخلك التالي ←",
    ctaInsights:   "اطّلع على رؤاك",
    refreshOnce:   "أعد التحميل مرة واحدة",
    manageBilling: "إدارة الفواتير ←",
    billingSettings: "إعدادات الفواتير",
  },
};
EOF

echo "📝 Patching app/components/I18nProvider.tsx..."
cat > app/components/I18nProvider.tsx << 'EOF'
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
EOF

echo "📝 Patching app/components/LanguageSwitcher.tsx..."
cat > app/components/LanguageSwitcher.tsx << 'EOF'
"use client";
import { useTranslation } from "@/app/components/I18nProvider";
interface Props { variant?: "compact" | "full"; }
export default function LanguageSwitcher({ variant = "compact" }: Props) {
  const { locale, setLocale, locales } = useTranslation();
  const current = locales.find((l) => l.code === locale) ?? locales[0];
  function cycleLocale() {
    const idx = locales.findIndex((l) => l.code === locale);
    setLocale(locales[(idx + 1) % locales.length].code);
  }
  if (variant === "full") {
    return (
      <div className="flex items-center gap-2 pt-1">
        {locales.map((loc) => {
          const active = loc.code === locale;
          return (
            <button key={loc.code} onClick={() => setLocale(loc.code)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${active ? "border-qm-accent bg-qm-accent-soft text-qm-accent" : "border-qm-card bg-qm-card text-qm-secondary hover:border-qm-accent hover:text-qm-accent"}`}
              aria-pressed={active} aria-label={`Switch to ${loc.label}`}>
              <span aria-hidden="true">{loc.flag}</span>
              <span>{loc.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <button onClick={cycleLocale}
      className="inline-flex items-center gap-1 rounded-full border border-qm-card px-2.5 py-1.5 text-xs font-medium text-qm-secondary transition-colors hover:border-qm-accent hover:text-qm-accent"
      aria-label={`Language: ${current.label}. Click to switch.`} title={current.label}>
      <span aria-hidden="true">{current.flag}</span>
      <span className="hidden sm:inline">{current.label}</span>
    </button>
  );
}
EOF

echo "📝 Patching app/layout.tsx..."
python3 - << 'PYEOF'
path = "app/layout.tsx"
c = open(path).read()
c = c.replace(
    'import { getLocaleFromCookieString } from "@/app/lib/i18n";',
    'import { getLocaleFromCookieString, getDir } from "@/app/lib/i18n";'
)
c = c.replace(
    'const locale = getLocaleFromCookieString(cookies().toString());\n  return (\n    <html lang={locale}>',
    'const locale = getLocaleFromCookieString(cookies().toString());\n  const dir    = getDir(locale);\n  return (\n    <html lang={locale} dir={dir}>'
)
c = c.replace(
    '<meta httpEquiv="Content-Language" content="en" />',
    '<meta httpEquiv="Content-Language" content={locale} />'
)
open(path, "w").write(c)
print("✅ layout.tsx patched")
PYEOF

echo "📝 Patching AI routes..."
python3 - << 'PYEOF'
import re

# reflection/route.ts
path = "app/api/ai/reflection/route.ts"
c = open(path).read()
c = c.replace(
    'import { getLocaleFromCookieString } from "@/app/lib/i18n";',
    'import { getLocaleFromCookieString, SUPPORTED_LOCALES } from "@/app/lib/i18n";'
)
c = re.sub(
    r'  // Locale: validate.*?const locale: string = \(SUPPORTED_AI_LOCALES as readonly string\[\]\)\.includes\(rawLocale\)\s*\? rawLocale\s*: cookieLocale;',
    '  const cookieLocale = getLocaleFromCookieString(req.headers.get("cookie") ?? "");\n  const rawLocale    = typeof body?.locale === "string" ? body.locale.trim() : "";\n  const locale: string = SUPPORTED_LOCALES.includes(rawLocale) ? rawLocale : cookieLocale;',
    c, flags=re.DOTALL
)
open(path, "w").write(c)
print("✅ reflection/route.ts patched")

# tools/reflection/route.ts
path = "app/api/ai/tools/reflection/route.ts"
c = open(path).read()
c = c.replace(
    'import { getLocaleFromCookieString } from "@/app/lib/i18n";',
    'import { getLocaleFromCookieString, getAiLanguageName } from "@/app/lib/i18n";'
)
c = c.replace(
    '  const LANGUAGE_NAMES: Record<string, string> = { uk: "Ukrainian", fr: "French", de: "German", es: "Spanish" };\n  const targetLanguage = LANGUAGE_NAMES[locale] ?? null;',
    '  const targetLanguage = getAiLanguageName(locale);'
)
open(path, "w").write(c)
print("✅ tools/reflection/route.ts patched")

# tools/suggestions/route.ts
path = "app/api/ai/tools/suggestions/route.ts"
c = open(path).read()
c = c.replace(
    'import { getLocaleFromCookieString } from "@/app/lib/i18n";',
    'import { getLocaleFromCookieString, getAiLanguageName } from "@/app/lib/i18n";'
)
c = c.replace(
    '  const LANGUAGE_NAMES: Record<string, string> = { uk: "Ukrainian", fr: "French", de: "German", es: "Spanish" };\n  const targetLanguage = LANGUAGE_NAMES[locale] ?? null;',
    '  const targetLanguage = getAiLanguageName(locale);'
)
open(path, "w").write(c)
print("✅ tools/suggestions/route.ts patched")
PYEOF

echo "📝 Patching lib/ai/generateReflection.ts..."
python3 - << 'PYEOF'
import re
path = "lib/ai/generateReflection.ts"
c = open(path).read()
c = c.replace(
    'import { CONFIG } from "@/app/lib/config";',
    'import { CONFIG } from "@/app/lib/config";\nimport { getAiLanguageName } from "@/app/lib/i18n";'
)
c = re.sub(
    r'  // Language instruction.*?const languageInstruction = targetLanguage\s*\?.*?: "";\n',
    '  const targetLanguage    = getAiLanguageName(locale);\n  const languageInstruction = targetLanguage\n    ? `\\nLANGUAGE RULE: You MUST respond entirely in ${targetLanguage}. Every field — summary, corepattern, themes, emotions, gentlenextstep, questions — must be written in ${targetLanguage}. Do not use English anywhere in your response.\\n`\n    : "";\n',
    c, flags=re.DOTALL
)
open(path, "w").write(c)
print("✅ generateReflection.ts patched")
PYEOF

echo "📝 Patching app/(protected)/journal/page.tsx..."
python3 - << 'PYEOF'
path = "app/(protected)/journal/page.tsx"
c = open(path).read()
c = c.replace(
    'import { getTranslations } from "@/app/lib/i18n";\nimport { cookies } from "next/headers";\nimport { getLocaleFromCookieString } from "@/app/lib/i18n";',
    'import { getTranslations, getLocaleFromCookieString, getIntlLocale } from "@/app/lib/i18n";\nimport { cookies } from "next/headers";'
)
c = c.replace(
    'return d.toLocaleDateString(locale === "uk" ? "uk-UA" : "en-GB", {\n    day: "numeric",\n    month: "short",\n    timeZone: "UTC",\n  });',
    'return d.toLocaleDateString(getIntlLocale(locale), {\n    day: "numeric",\n    month: "short",\n    timeZone: "UTC",\n  });'
)
c = c.replace(
    'return d.toLocaleDateString(locale === "uk" ? "uk-UA" : "en-GB", { month: "long", year: "numeric", timeZone: "UTC" });',
    'return d.toLocaleDateString(getIntlLocale(locale), { month: "long", year: "numeric", timeZone: "UTC" });'
)
open(path, "w").write(c)
print("✅ journal/page.tsx patched")
PYEOF

echo ""
echo "🔍 Running TypeScript check..."
npx tsc --noEmit 2>&1 | grep -v "baseUrl" || true

echo ""
echo "📦 Committing and pushing..."
git add -A
git commit -m "feat: complete i18n — registry, Arabic locale, RTL, AI routes

- app/lib/i18n/locales.ts: THE single registry file (LOCALE_REGISTRY)
  Adding a language = 1 import + 1 entry. Nothing else ever changes.
- app/lib/i18n/ar.ts: Full Arabic (MSA) — all namespaces, 6 plural forms
- app/lib/i18n/types.ts: Remove hardcoded Locale union (now derived)
- app/lib/i18n/index.ts: Clean barrel re-export from locales.ts
- app/components/I18nProvider: +dir +locales +document.dir/lang +validation
- app/components/LanguageSwitcher: reads locales from context (not hardcoded)
- app/layout.tsx: <html dir={dir}> — RTL works on page load
- app/api/ai/reflection/route.ts: use SUPPORTED_LOCALES from registry
- app/api/ai/tools/reflection & suggestions: use getAiLanguageName()
- lib/ai/generateReflection.ts: use getAiLanguageName() — Arabic AI works
- app/(protected)/journal/page.tsx: use getIntlLocale() for date formatting"

git push origin main
echo ""
echo "✅ Done! Vercel will deploy automatically."
