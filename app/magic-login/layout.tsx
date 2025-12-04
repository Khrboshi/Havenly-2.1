// app/magic-login/layout.tsx
import type { ReactNode } from "react";

/**
 * Magic Login layout
 *
 * This is a NESTED layout, so it must NOT declare <html> or <body>.
 * We let the root layout handle Navbar, Footer, Supabase provider, etc.
 * Here we can optionally wrap the page content if we need extra styling.
 */
export default function MagicLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
