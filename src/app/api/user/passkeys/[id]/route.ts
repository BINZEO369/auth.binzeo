import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";
import { z } from "zod";

const idSchema = z.string().uuid();

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = idSchema.safeParse(id);
    if (!parsed.success) return fail("Invalid passkey id", 422, "VALIDATION_ERROR");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const { data, error } = await supabase.rpc("revoke_my_passkey", {
      passkey_id: parsed.data,
    });

    if (error) return fail(error.message, 400, "PASSKEY_REVOKE_FAILED");
    if (!data) return fail("Passkey not found or already revoked", 404, "PASSKEY_NOT_FOUND");

    return ok({ message: "Passkey revoked" });
  } catch (err) {
    console.error("[PASSKEY_REVOKE_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
