import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validators/auth";
import { ok, fail } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
      return fail(firstError, 422, "VALIDATION_ERROR");
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return fail("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const { data: verification } = await supabase
      .from("user_verification_records")
      .select("verification_status")
      .eq("user_id", data.user.id)
      .eq("verification_type", "email")
      .maybeSingle();
    if (verification?.verification_status !== "verified") {
      await supabase.auth.signOut();
      return fail(
        "Please verify your email with the OTP before signing in",
        403,
        "EMAIL_VERIFICATION_REQUIRED"
      );
    }

    // Fetch profile for user details
    const { data: profile } = await supabase
      .from("profiles")
      .select("binzeo_user_id, first_name, last_name, display_name, account_status")
      .eq("id", data.user.id)
      .maybeSingle();

    // Only active, OTP-verified accounts may establish a login session.
    if (profile?.account_status !== "active") {
      await supabase.auth.signOut();
      return fail(
        `Account ${profile?.account_status ?? "pending"}`,
        403,
        "ACCOUNT_BLOCKED"
      );
    }

    return ok({
      user: {
        id: data.user.id,
        email: data.user.email,
        binzeo_user_id: profile?.binzeo_user_id ?? null,
        first_name: profile?.first_name ?? null,
        last_name: profile?.last_name ?? null,
        display_name: profile?.display_name ?? null,
        account_status: profile?.account_status ?? "pending",
      },
    });
  } catch (err) {
    console.error("[LOGIN_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
