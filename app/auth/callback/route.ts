// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function safeNext(pathname: string | null) {
  // only allow internal paths
  if (!pathname) return "/dashboard";
  if (!pathname.startsWith("/")) return "/dashboard";
  if (pathname.startsWith("//")) return "/dashboard";
  return pathname;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  // No code => go back to magic-login with next preserved
  if (!code) {
    const to = new URL("/magic-login", url.origin);
    to.searchParams.set("next", next);
    return NextResponse.redirect(to);
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options, path: "/" });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options, path: "/" });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // iOS in-app browsers often fail here due to blocked cookies.
    // Send user back to magic-login with a flag so you can show “Open in Safari”.
    const to = new URL("/magic-login", url.origin);
    to.searchParams.set("callback_error", "1");
    to.searchParams.set("next", next);
    return NextResponse.redirect(to);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
