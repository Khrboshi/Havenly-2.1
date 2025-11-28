"use client";

import { useEffect, useState } from "react";

/**
 * Ensures navbar renders only after hydration,
 * preventing layout shifts and React mismatch errors.
 */
export default function ClientNavWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}
