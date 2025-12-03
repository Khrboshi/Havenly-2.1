// app/(protected)/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // SERVER-SAFE redirect target
  // Next.js exposes the URL through headers instead of window
  const url = new URL(
    // @ts-ignore
    (await import("next/headers")).headers().get("x-url") || "/"
  );

  if (!session?.user) {
    redirect(`/magic-login?redirectedFrom=${encodeURIComponent(url.pathname)}`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main>{children}</main>
    </div>
  );
}
