import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
      return fail(firstError, 422, "VALIDATION_ERROR");
    }

    const { email, password, first_name, last_name, country_code } =
      parsed.data;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          country_code: country_code || null,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      },
    });

    if (error) {
      return fail(error.message, 400, error.name);
    }

    // Update profile with names (trigger only creates id)
    if (data.user) {
      await supabase
        .from("profiles")
        .update({
          first_name,
          last_name,
          display_name: `${first_name} ${last_name}`.trim(),
          country_code: country_code || null,
        })
        .eq("id", data.user.id);
    }

    return ok(
      {
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email,
              first_name,
              last_name,
            }
          : null,
        requires_email_confirmation: !data.session,
      },
      201
    );
  } catch (err) {
    console.error("[SIGNUP_ERROR]", err);
    return fail("Internal server error", 500, "INTERNAL_ERROR");
  }
}
