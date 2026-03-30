"use client";
import { useEffect } from "react";
import ErrorPage from "@/app/components/ErrorPage";
import { useTranslation } from "@/app/components/I18nProvider";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  const { t } = useTranslation();
  return <ErrorPage reset={reset} message={t.errors.safeReload} backHref="/dashboard" backLabel={t.nav.backToDashboard} />;
}
