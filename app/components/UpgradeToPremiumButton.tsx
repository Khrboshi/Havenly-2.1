"use client";

import { useRouter } from "next/navigation";
import { trackUpgradeIntent } from "@/app/components/telemetry";

type Props = {
  source: string;
  className?: string;
};

export default function UpgradeToPremiumButton({
  source,
  className,
}: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        trackUpgradeIntent(source);
        router.push("/premium");
      }}
    >
      Upgrade to Premium
    </button>
  );
}
