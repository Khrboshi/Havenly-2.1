import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/magic-login");
  }

  const user = session.user;
  const role =
    (user.user_metadata as { role?: string } | null)?.role || "free";

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white px-6 pt-20 pb-32 max-w-4xl mx-auto">

      {/* Free Plan Label */}
      {role === "free" && (
        <div className="mb-6 text-sm text-[#8eeacb] bg-[#132225] border border-[#1d3a3d] rounded-md p-3">
          You’re on the free plan — daily journaling is fully included.
          <br />
          <span className="text-gray-300">
            Soon you’ll be able to upgrade for deeper weekly insights,
            emotion patterns, and clarity summaries — optional add-on.
          </span>
        </div>
      )}

      {/* Welcome */}
      <h1 className="text-3xl font-semibold mb-3">
        Welcome back,{" "}
        <span className="text-[#54E1B3]">
          {user.email?.split("@")[0]}
        </span>
      </h1>

      <p className="text-gray-300 mb-8">
        Take a moment to slow down and notice how you’re really doing today.
      </p>

      {/* ✅ MAIN CTA — always goes to /journal/new */}
      <Link
        href="/journal/new"
        className="bg-[#47D7A9] text-black font-semibold px-6 py-3 rounded-full hover:bg-[#35c497] transition inline-block mb-10"
      >
        Start today’s reflection
      </Link>

      {/* Recent reflections placeholder */}
      <h2 className="text-lg font-semibold mb-2">
        Recent reflections
      </h2>

      <p className="text-gray-400 mb-6">
        You haven’t written anything yet — your first reflection will appear
        here once you’ve checked in.
      </p>

      <Link href="/journal" className="text-[#54E1B3] underline">
        View full journal →
      </Link>
    </main>
  );
}
