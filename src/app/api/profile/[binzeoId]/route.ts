import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ binzeoId: string }> }
) {
  try {
    const { binzeoId } = await params;

    if (!binzeoId || binzeoId.length < 10) {
      return fail("Invalid Binzeo ID", 400, "INVALID_ID");
    }

    const supabase = await createClient();

    // Only return public-safe fields
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        `
        binzeo_user_id,
        display_name,
        username,
        first_name,
        last_name,
        profile_photo_url,
        country_code,
        account_status,
        created_at
        `
      )
      .eq("binzeo_user_id", binzeoId)
      .eq("account_status", "active")
      .maybeSingle();

    if (error) {
      return fail(error.message, 400, "PROFILE_FETCH_FAILED");
    }

    if (!profile) {
      return fail("Profile not found", 404, "PROFILE_NOT_FOUND");
    }

    // Fetch verified contacts (public only)
    const { data: contacts } = await supabase
      .from("user_contacts")
      .select("contact_type, contact_value, label, is_primary")
      .eq("user_id", (
        await supabase
          .from("profiles")
          .select("id")
          .eq("binzeo_user_id", binzeoId)
          .maybeSingle()
      ).data?.id ?? "")
      .eq("is_verified", true);

    // Fetch sector access
    const { data: sectors } = await supabase
      .from("user_sector_access")
      .select(
        `
        status,
        sectors:sector_id (
          sector_code,
          sector_name
        )
        `
      )
      .eq("user_id", (
        await supabase
          .from("profiles")
          .select("id")
          .eq("binzeo_user_id", binzeoId)
          .maybeSingle()
      ).data?.id ?? "")
      .eq("status", "active");

    return ok({
      profile,
      contacts: contacts ?? [],
      sectors: sectors ?? [],
    });
  } catch (err) {
    console.error("[PUBLIC_PROFILE_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
