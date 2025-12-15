import { redirect } from "next/navigation";

/**
 * Deprecated route.
 * Premium page has been consolidated under /(public)/premium
 */
export default function DeprecatedPremiumPage() {
  redirect("/premium");
}
