// app/providers.tsx
"use client";
import InstallPrompt from "@/components/InstallPrompt";
// ...
return (
  <SupabaseSessionProvider>
    <ServiceWorkerRegister />
    <InstallPrompt />
    {children}
  </SupabaseSessionProvider>
);
