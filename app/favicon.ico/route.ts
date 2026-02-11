import { NextResponse } from "next/server";

// Minimal, safe fix: serve something at /favicon.ico so the browser stops 404'ing.
// We return SVG bytes even though the path ends with .ico (modern browsers accept it).

export const dynamic = "force-dynamic";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#10B981"/>
  <text x="50" y="60" font-size="48" text-anchor="middle"
        fill="#0F172A" font-family="Arial, sans-serif" font-weight="700">H</text>
</svg>`;

export async function GET() {
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
