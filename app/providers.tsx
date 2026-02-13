// app/providers.tsx
"use client";

import React from "react";
import { SupabaseSessionProvider } from "@/components/SupabaseSessionProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseSessionProvider>
      <ServiceWorkerRegister />
      <InstallPrompt />
      {children}
    </SupabaseSessionProvider>
  );
}
