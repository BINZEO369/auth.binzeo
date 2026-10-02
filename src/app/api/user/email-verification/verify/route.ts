import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";
import { z } from "zod";

const verifySchema = z.object({
  challenge_id: z.string().uuid(),
  code: z.string().trim().min(1).max(12),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const parsed = verifySchema.safeParse(await req.json());
    if (!parsed.success) return fail("Invalid verification request", 422, "VALIDATION_ERROR");

    const { data, error } = await supabase.rpc("verify_email_verification_code", {
      challenge_id: parsed.data.challenge_id,
      submitted_code: parsed.data.code,
    });

    if (error) return fail(error.message, 400, "EMAIL_VERIFICATION_FAILED");
    const result = Array.isArray(data) ? data[0] : data;
    if (!result?.verified) return fail(result?.reason ?? "Verification failed", 400, "EMAIL_VERIFICATION_FAILED");
    if (result.user_id !== user.id) return fail("Challenge does not belong to this user", 403, "FORBIDDEN");

    return ok({ verified: true, verified_at: result.verified_at });
  } catch (err) {
    console.error("[EMAIL_VERIFICATION_VERIFY_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
