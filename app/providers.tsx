"use client";

import { SupabaseSessionProvider } from "@/app/components/SupabaseSessionProvider";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import { PostHogProvider } from "./components/PostHogProvider";
import { I18nProvider } from "@/app/components/I18nProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <I18nProvider>
        <SupabaseSessionProvider>
          <ServiceWorkerRegister />
          {children}
        </SupabaseSessionProvider>
      </I18nProvider>
    </PostHogProvider>
  );
}
