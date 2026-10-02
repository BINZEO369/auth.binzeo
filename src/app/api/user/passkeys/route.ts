import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const { data, error } = await supabase
      .from("user_passkeys")
      .select("id, device_name, authenticator_type, transports, aaguid, is_discoverable, is_backed_up, last_used_at, expires_at, revoked_at, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return fail(error.message, 400, "PASSKEYS_FETCH_FAILED");
    return ok({ passkeys: data ?? [] });
  } catch (err) {
    console.error("[PASSKEYS_GET_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
