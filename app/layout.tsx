import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Havenly 2.1",
  description: "AI-powered reflection journal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200 min-h-screen">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
