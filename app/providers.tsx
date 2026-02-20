"use client";

import { SupabaseSessionProvider } from "@/components/SupabaseSessionProvider";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseSessionProvider>
      <ServiceWorkerRegister />
      {children}
    </SupabaseSessionProvider>
  );
}
