import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";
import { logUserActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await logUserActivity(supabase, req, {
        userId: user.id,
        activityType: "logout_success",
        description: "Signed out successfully.",
      });
    }
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
