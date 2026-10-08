import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { resolveRequestLocation } from "@/lib/request-location";
import { upsertUserDevice } from "@/lib/device-tracking";
import { upsertUserBirthday, validateBirthDate } from "@/lib/birthday";
import { isValidUsername, normalizeUsername, usernameExists } from "@/lib/username";
import { ok, fail } from "@/lib/api/response";
import { logUserActivity } from "@/lib/activity-log";

const completeSchema = z.object({
  username: z.string().min(3).max(30),
  first_name: z.string().min(2).max(80).optional(),
  last_name: z.string().min(1).max(80).optional(),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  terms_accepted: z.literal(true),
  privacy_accepted: z.literal(true),
  location_consent: z.literal(true),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy_meters: z.number().min(0).max(100000),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return fail("Please continue with Google first", 401, "UNAUTHORIZED");

    const parsed = completeSchema.safeParse(await req.json());
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422, "VALIDATION_ERROR");
    const input = parsed.data;
    const username = normalizeUsername(input.username);
    if (!isValidUsername(username)) return fail("Choose a valid available username", 422, "INVALID_USERNAME");
    const birthDateError = validateBirthDate(input.date_of_birth);
    if (birthDateError) return fail(birthDateError, 422, "INVALID_DATE_OF_BIRTH");
    const location = await resolveRequestLocation(req.headers, true, {
      latitude: input.location.latitude,
      longitude: input.location.longitude,
      accuracyMeters: input.location.accuracy_meters,
    });
    const admin = getSupabaseAdmin();
    const { data: profile } = await admin
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .maybeSingle();
    const firstName = input.first_name?.trim() || profile?.first_name || String(user.user_metadata?.given_name ?? "Google").trim();
    const lastName = input.last_name?.trim() || profile?.last_name || String(user.user_metadata?.family_name ?? "User").trim();
    if (await usernameExists(username)) {
      const { data: current } = await admin.from("profiles").select("username").eq("id", user.id).maybeSingle();
      if (current?.username !== username) return fail(`@${username} is already taken. Choose another username.`, 409, "USERNAME_ALREADY_EXISTS");
    }
    const consentDate = new Date().toISOString();
    const { error: profileError } = await admin.from("profiles").update({
      first_name: firstName,
      last_name: lastName,
      display_name: `${firstName} ${lastName}`.trim(),
      username,
      date_of_birth: input.date_of_birth,
      country_code: location.country,
      terms_accepted: true,
      terms_version: "2026-10-02",
      privacy_accepted: true,
      privacy_version: "2026-10-02",
      location_consent: true,
      location_consent_at: consentDate,
      consent_date: consentDate,
      account_status: "active",
    }).eq("id", user.id);
    if (profileError) {
      if (profileError.code === "23505") return fail(`@${username} is already taken. Choose another username.`, 409, "USERNAME_ALREADY_EXISTS");
      console.error("[GOOGLE_PROFILE_SETUP_ERROR]", profileError);
      return fail("Profile setup failed", 500, "PROFILE_SETUP_FAILED");
    }
    await upsertUserBirthday({ userId: user.id, email: user.email ?? "", displayName: `${firstName} ${lastName}`.trim(), birthDate: input.date_of_birth });
    await admin.from("user_verification_records").upsert({
      user_id: user.id,
      verification_type: "email",
      verification_status: "verified",
      source_of_truth: "google_oauth",
      verified_at: consentDate,
      last_requested_at: null,
      expires_at: null,
      attempt_count: 0,
      updated_at: consentDate,
    }, { onConflict: "user_id,verification_type" });
    const device = await upsertUserDevice(supabase, user.id, req.headers, location.ip);
    await supabase.from("user_login_history").insert({
      user_id: user.id,
      login_method: "google",
      login_status: "success",
      ip_address: location.ip,
      device_id: device.id,
      user_agent: req.headers.get("user-agent"),
      country: location.country,
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude,
      location_accuracy_meters: location.accuracyMeters,
      location_source: location.source,
    });
    if (location.city || location.region || location.country || location.latitude !== null || location.longitude !== null) {
      await supabase.from("user_addresses").insert({
        user_id: user.id,
        address_type: "home",
        address_line_1: [location.city, location.region, location.country].filter(Boolean).join(", ") || "Approximate location",
        country_code: location.country,
        state_province: location.region,
        city: location.city,
        latitude: location.latitude,
        longitude: location.longitude,
        location_accuracy_meters: location.accuracyMeters,
        location_source: location.source,
        is_primary: true,
      });
    }
    await logUserActivity(supabase, req, {
      userId: user.id,
      activityType: "account_created",
      description: "BINZEO account created with Google OAuth.",
      deviceId: device.id,
      metadata: { signup_method: "google", email_verified_by: "google_oauth" },
    });
    return ok({ user: { id: user.id, email: user.email, first_name: firstName, last_name: lastName } }, 201);
  } catch (err) {
    console.error("[GOOGLE_PROFILE_SETUP_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
