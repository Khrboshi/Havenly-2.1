import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Keep Supabase auth cookies in sync for every request.
  // Do NOT do any auth redirects here; the (protected) layout handles protection.
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|icon.svg|apple-touch-icon).*)",
  ],
};
