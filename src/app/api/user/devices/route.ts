import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const { data, error } = await supabase
      .from("user_devices")
      .select("*")
      .eq("user_id", user.id)
      .order("last_seen_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) return fail(error.message, 400, "DEVICES_FETCH_FAILED");
    return ok({ devices: data ?? [] });
  } catch (err) {
    console.error("[DEVICES_GET_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
