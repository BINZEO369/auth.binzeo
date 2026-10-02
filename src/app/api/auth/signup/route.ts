import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { transporter, EMAIL_FROM, buildOtpEmail } from "@/lib/email/transporter";
import { z } from "zod";
import { ok, fail } from "@/lib/api/response";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(80, "First name too long"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(80, "Last name too long"),
  country_code: z
    .string()
    .length(2, "Country code must be 2 characters")
    .optional(),
});

function requestIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
      return fail(firstError, 422, "VALIDATION_ERROR");
    }

    const { email, password, first_name, last_name, country_code } = parsed.data;

    // Supabase must not send its built-in confirmation link. The application
    // OTP below is the only email-verification step for a newly created user.
    const { data: created, error: createError } =
      await getSupabaseAdmin().auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { first_name, last_name, country_code: country_code || null },
      });

    if (createError || !created.user) {
      return fail(createError?.message ?? "Unable to create account", 400, createError?.name ?? "SIGNUP_FAILED");
    }

    const user = created.user;
    const supabase = await createClient();
    const { data: sessionData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (signInError || !sessionData.session) {
      return fail("Account created, but sign-in could not be started", 500, "SIGNIN_AFTER_SIGNUP_FAILED");
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name,
        last_name,
        display_name: `${first_name} ${last_name}`.trim(),
        country_code: country_code || null,
      })
      .eq("id", user.id);
    if (profileError) {
      console.error("[SIGNUP_PROFILE_UPDATE_ERROR]", profileError);
      return fail("Account created, but profile setup failed", 500, "PROFILE_SETUP_FAILED");
    }

    const { data: challengeData, error: challengeError } = await supabase.rpc(
      "issue_email_verification_code",
      { target_user_id: user.id, request_ip: requestIp(req) }
    );
    if (challengeError) {
      console.error("[SIGNUP_OTP_ISSUE_ERROR]", challengeError);
      return fail("Account created, but verification code could not be sent", 502, "OTP_ISSUE_FAILED");
    }

    const challenge = Array.isArray(challengeData) ? challengeData[0] : challengeData;
    const challengeId = challenge?.challenge_id;
    const verificationCode = challenge?.verification_code;
    if (!challengeId || !verificationCode) {
      console.error("[SIGNUP_OTP_SHAPE_ERROR]", challenge);
      return fail("Account created, but verification code was invalid", 502, "OTP_RESPONSE_INVALID");
    }

    try {
      const emailContent = buildOtpEmail(String(verificationCode), 30);
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    } catch (mailError) {
      console.error("[SIGNUP_OTP_MAIL_ERROR]", mailError);
      return fail("Account created, but verification email could not be sent", 502, "OTP_MAIL_SEND_FAILED");
    }

    return ok(
      {
        user: { id: user.id, email: user.email, first_name, last_name },
        challenge_id: challengeId,
        requires_custom_email_verification: true,
        requires_email_confirmation: false,
      },
      201
    );
  } catch (err) {
    console.error("[SIGNUP_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
