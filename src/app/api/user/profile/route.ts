import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";
import { calculateAge, upsertUserBirthday, validateBirthDate } from "@/lib/birthday";

const ALLOWED_FIELDS = [
  "first_name",
  "middle_name",
  "last_name",
  "display_name",
  "username",
  "date_of_birth",
  "gender",
  "profile_photo_url",
  "country_code",
  "preferred_language",
  "timezone",
  "date_format",
  "time_format",
  "currency",
  "marketing_email",
  "marketing_sms",
  "push_notifications",
  "security_notifications",
  "recovery_email",
  "terms_accepted",
  "terms_version",
  "privacy_accepted",
  "privacy_version",
  "marketing_consent",
] as const;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return fail("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        binzeo_user_id,
        first_name,
        middle_name,
        last_name,
        display_name,
        username,
        date_of_birth,
        gender,
        profile_photo_url,
        country_code,
        preferred_language,
        timezone,
        date_format,
        time_format,
        currency,
        marketing_email,
        marketing_sms,
        push_notifications,
        security_notifications,
        recovery_email,
        account_status,
        status_reason,
        suspended_at,
        suspended_until,
        deactivated_at,
        terms_accepted,
        terms_version,
        privacy_accepted,
        privacy_version,
        marketing_consent,
        consent_date,
        created_at,
        updated_at
        `
      )
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      return fail(error.message, 400, "PROFILE_FETCH_FAILED");
    }

    return ok({
      profile: profile ? { ...profile, age: profile.date_of_birth ? calculateAge(profile.date_of_birth) : null } : profile,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("[PROFILE_GET_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return fail("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const patch: Record<string, unknown> = {};

    for (const key of ALLOWED_FIELDS) {
      if (key in body) patch[key] = body[key];
    }

    if (Object.keys(patch).length === 0) {
      return fail("No valid fields to update", 422, "NO_UPDATE_FIELDS");
    }

    if ("date_of_birth" in patch) {
      const birthDateError = validateBirthDate(patch.date_of_birth);
      if (birthDateError) return fail(birthDateError, 422, "INVALID_DATE_OF_BIRTH");
    }

    // Auto-set consent_date when terms or privacy accepted
    if (
      (patch.terms_accepted === true || patch.privacy_accepted === true) &&
      !("consent_date" in body)
    ) {
      patch.consent_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return fail(error.message, 400, "PROFILE_UPDATE_FAILED");
    }

    if (data.date_of_birth) {
      try {
        await upsertUserBirthday({
          userId: user.id,
          email: user.email ?? "unknown@example.com",
          displayName: data.display_name || [data.first_name, data.last_name].filter(Boolean).join(" ") || "BINZEO user",
          birthDate: data.date_of_birth,
        });
      } catch (birthdayError) {
        console.error("[PROFILE_BIRTHDAY_SYNC_ERROR]", birthdayError);
        return fail("Profile saved, but birthday record could not be synchronized", 500, "BIRTHDAY_SYNC_FAILED");
      }
    }

    return ok({ profile: data });
  } catch (err) {
    console.error("[PROFILE_PATCH_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
