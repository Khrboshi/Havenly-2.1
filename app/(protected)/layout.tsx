import "../globals.css";
import Navbar from "@/components/Navbar";
import { SupabaseSessionProvider } from "@/components/SupabaseSessionProvider";

export const metadata = {
  title: "Havenly – Dashboard",
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      {/* Global Auth Provider */}
      <SupabaseSessionProvider>
        
        {/* Correct Navbar (only once) */}
        <Navbar />

        {/* Page content */}
        <main className="flex-1 pt-4">{children}</main>
      </SupabaseSessionProvider>
    </div>
  );
}
