import { createServerSupabase } from "@/lib/supabase/server";

export async function setUserRole(userId: string, role: "free" | "premium") {
  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  });

  if (error) {
    console.error("Failed to update user role:", error);
  }
}
