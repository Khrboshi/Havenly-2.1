"use client";

import SiteHeader from "./SiteHeader";

/**
 * Compatibility shim.
 * If any existing page still imports Navbar,
 * it will automatically load the new SiteHeader.
 */
export default function Navbar() {
  return <SiteHeader />;
}
