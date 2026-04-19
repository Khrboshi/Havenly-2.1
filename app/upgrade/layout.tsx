import type { Metadata } from "next";
import { CONFIG } from "@/app/lib/config";
import { PRICING } from "@/app/lib/pricing";
import { getRequestTranslations } from "@/app/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getRequestTranslations();
  return {
    title:       t.upgradePage.metaTitle(CONFIG.appName),
    description: t.upgradePage.metaDescription(CONFIG.appName, PRICING.monthlyCadence),
  };
}

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
