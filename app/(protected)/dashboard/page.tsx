import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const role = user.user_metadata?.role || "free";
  const displayName = user.email?.split("@")[0] ?? "there";

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white px-6 pt-20 pb-32 max-w-4xl mx-auto">
      {/* Free Plan Label */}
      {role === "free" && (
        <div className="mb-6 rounded-md border border-[#1d3a3d] bg-[#132225] p-3 text-sm text-[#8eeacb]">
          You’re on the free plan — daily journaling is fully included.
          <br />
          <span className="text-gray-300">
            Soon you’ll be able to upgrade for deeper weekly insights, emotion
            patterns, and clarity summaries — all optional.
          </span>
        </div>
      )}

      <h1 className="mb-3 text-3xl font-semibold">
        Welcome back,{" "}
        <span className="text-[#54E1B3]">
          {displayName}
        </span>
      </h1>

      <p className="mb-8 text-gray-300">
        Take a moment to slow down and notice how you’re really doing today.
      </p>

      <Link
        href="/journal"
        className="mb-10 inline-block rounded-full bg-[#47D7A9] px-6 py-3 font-semibold text-black transition hover:bg-[#35c497]"
      >
        Start today’s reflection
      </Link>

      <h2 className="mb-2 text-lg font-semibold">Recent reflections</h2>
      <p className="mb-6 text-gray-400">
        You haven’t written anything yet — your first reflection will appear
        here once you’ve checked in.
      </p>

      <Link href="/journal" className="text-[#54E1B3] underline">
        View full journal →
      </Link>
    </main>
  );
}
