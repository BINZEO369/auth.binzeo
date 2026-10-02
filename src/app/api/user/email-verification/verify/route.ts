import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return fail("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const challengeId = body?.challenge_id;
    const code = body?.code;

    // Validation
    if (!challengeId || typeof challengeId !== "string") {
      return fail("Missing challenge_id", 422, "VALIDATION_ERROR");
    }

    if (!code || typeof code !== "string") {
      return fail("Missing code", 422, "VALIDATION_ERROR");
    }

    if (!/^\d{6}$/.test(code)) {
      return fail(
        "Code must be exactly 6 digits",
        422,
        "INVALID_CODE_FORMAT"
      );
    }

    // UUID format check (basic)
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        challengeId
      )
    ) {
      return fail("Invalid challenge_id format", 422, "INVALID_UUID");
    }

    // Supabase RPC কল — verify
    const { data, error } = await supabase.rpc(
      "verify_email_verification_code",
      {
        challenge_id: challengeId,
        submitted_code: code,
      }
    );

    if (error) {
      console.error("[OTP_VERIFY_RPC_ERROR]", error);
      return fail(error.message, 400, "OTP_VERIFY_FAILED");
    }

    const result = Array.isArray(data) ? data[0] : data;

    const verified = result?.verified === true;
    if (verified && result?.user_id !== user.id) {
      return fail("Verification challenge does not belong to this user", 403, "FORBIDDEN");
    }
    const reason: string = result?.reason ?? (verified ? "verified" : "verification_failed");

    return ok({
      verified,
      reason,
    });
  } catch (err) {
    console.error("[OTP_VERIFY_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
