"use client";

import { SupabaseSessionProvider } from "@/components/SupabaseSessionProvider";
import ServiceWorkerRegisterer from "@/components/ServiceWorkerRegisterer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseSessionProvider>
      <ServiceWorkerRegisterer />
      {children}
    </SupabaseSessionProvider>
  );
}
