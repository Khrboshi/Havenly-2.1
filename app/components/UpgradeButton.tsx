"use client";
/**
 * app/components/UpgradeButton.tsx
 *
 * Interactive upgrade / checkout button — the only piece of the /upgrade page
 * that requires client-side state (loading, error) and router navigation.
 *
 * Extracted from app/upgrade/page.tsx so that page can be a server component,
 * rendering pricing copy into SSR HTML (making it cache-verifiable and immune
 * to edge-cache stale-price issues).
 *
 * Props are intentionally plain strings so the server component can pass
 * already-resolved translations without shipping a Translations object to
 * the client bundle.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAYMENT } from "@/app/lib/payment";

interface UpgradeButtonProps {
  /** Primary button label, e.g. "Start 3-day free trial" */
  label: string;
  /** Label shown while the checkout redirect is in progress */
  redirectingLabel: string;
  /** Error message prefix shown when checkout fails, e.g. "Something went wrong." */
  errorPrefix: string;
  /** Support email shown in the error message */
  supportEmail: string;
  /** Tailwind class string forwarded to the <button> element */
  className?: string;
}

export default function UpgradeButton({
  label,
  redirectingLabel,
  errorPrefix,
  supportEmail,
  className,
}: UpgradeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(PAYMENT.checkoutApiRoute, { method: "POST" });
      if (res.status === 401) {
        router.push("/magic-login?next=/upgrade");
        return;
      }
      const data = await res.json();
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(`${errorPrefix} ${supportEmail}.`);
      }
    } catch {
      setError(`${errorPrefix} ${supportEmail}.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={loading}
        className={className}
      >
        {loading ? redirectingLabel : label}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-qm-danger">{error}</p>
      )}
    </>
  );
}
