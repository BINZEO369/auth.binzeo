import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";

export async function POST() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return fail(error.message, 400, "SIGNOUT_FAILED");
    }

    return ok({ message: "Logged out successfully" });
  } catch (err) {
    console.error("[LOGOUT_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
