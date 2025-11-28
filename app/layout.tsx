import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteHeader from "./components/SiteHeader";
import ClientNavWrapper from "./components/ClientNavWrapper";
import PwaInstallHint from "./components/PwaInstallHint";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Havenly",
  description: "A gentle journaling experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <ClientNavWrapper>
          <SiteHeader />
        </ClientNavWrapper>

        {/* Floating mobile-only PWA Install hint */}
        <PwaInstallHint />

        {children}
      </body>
    </html>
  );
}
