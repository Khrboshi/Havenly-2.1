"use client";

import SiteHeader from "./SiteHeader";

/**
 * Backwards-compatible Navbar component.
 * Internally reuses the new SiteHeader so the design stays consistent.
 * Safe to keep even if nothing imports it.
 */
export default function Navbar() {
  return <SiteHeader />;
}
