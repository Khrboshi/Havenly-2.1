// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Havenly 2.1",
  description: "A calm space to reflect with gentle AI-assisted journaling.",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/icon.svg" },
    { rel: "apple-touch-icon", url: "/apple-icon.png" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#040b14] text-slate-50 antialiased">
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
