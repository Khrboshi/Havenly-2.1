import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ClientNavWrapper from "./components/ClientNavWrapper";
import SiteHeader from "./components/SiteHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Havenly 2.1",
  description: "A calmer, kinder way to understand your day.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientNavWrapper>
          <SiteHeader />
        </ClientNavWrapper>

        <main className="min-h-screen">{children}</main>

        <footer className="text-center py-10 text-slate-500 text-sm">
          Havenly 2.1 · A calmer, kinder way to understand your day. © 2025
        </footer>
      </body>
    </html>
  );
}
