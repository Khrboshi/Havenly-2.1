import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import DeepLinkBootstrap from "./components/DeepLinkBootstrap";
import InstallPrompt from "./components/InstallPrompt";

export const metadata: Metadata = {
  title: "Havenly",
  description: "A calm, private journaling companion with gentle AI reflections.",
  icons: {
    icon: [
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/pwa/icon-192.png",
    apple: "/pwa/icon-192.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <DeepLinkBootstrap />
          <Navbar />
          {children}
          <InstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
