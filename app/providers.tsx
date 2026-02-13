"use client";

import SupabaseSessionProvider from "@/components/SupabaseSessionProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SupabaseSessionProvider>{children}</SupabaseSessionProvider>;
}
