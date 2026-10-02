import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";

function requestIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const { data, error } = await supabase.rpc("issue_email_verification_code", {
      target_user_id: user.id,
      request_ip: requestIp(req),
    });

    if (error) return fail(error.message, 400, "EMAIL_VERIFICATION_ISSUE_FAILED");
    const challenge = Array.isArray(data) ? data[0] : data;
    if (!challenge) return fail("Could not issue verification challenge", 400, "EMAIL_VERIFICATION_ISSUE_FAILED");

    // The verification code is intentionally not returned by this API.
    // A mail provider can be connected here later without exposing the code to clients.
    return ok({
      challenge_id: challenge.challenge_id,
      expires_at: challenge.expires_at,
    }, 201);
  } catch (err) {
    console.error("[EMAIL_VERIFICATION_ISSUE_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
