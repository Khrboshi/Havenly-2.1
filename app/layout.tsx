import "./globals.css";
import { Inter } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Havenly 2.1",
  description: "A calmer, kinder way to understand your day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteHeader />
        <main className="pt-4">{children}</main>
      </body>
    </html>
  );
}
