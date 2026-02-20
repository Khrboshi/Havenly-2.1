"use client";

import { SupabaseSessionProvider } from "@/components/SupabaseSessionProvider";
import ServiceWorkerRegisterer from "@/app/components/ServiceWorkerRegister";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseSessionProvider>
      <ServiceWorkerRegisterer />
      {children}
    </SupabaseSessionProvider>
  );
}
