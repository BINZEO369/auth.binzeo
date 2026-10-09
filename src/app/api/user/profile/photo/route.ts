import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";
import { uploadProfileImage } from "@/lib/cloudinary";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return fail("Please select an image file.", 422, "IMAGE_REQUIRED");
    if (!ALLOWED_TYPES.has(file.type)) return fail("Only JPEG, PNG, WebP, and AVIF images are supported.", 422, "IMAGE_TYPE_NOT_ALLOWED");
    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) return fail("Profile images must be smaller than 5 MB.", 422, "IMAGE_TOO_LARGE");

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadProfileImage(buffer, user.id);
    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update({ profile_photo_url: uploaded.secure_url, profile_photo_public_id: uploaded.public_id })
      .eq("id", user.id)
      .select("profile_photo_url, profile_photo_public_id")
      .single();

    if (updateError) {
      console.error("[PROFILE_PHOTO_DB_UPDATE_ERROR]", updateError);
      return fail("Image uploaded, but the profile could not be updated.", 500, "PROFILE_PHOTO_SAVE_FAILED");
    }

    return ok({ profile });
  } catch (error) {
    const uploadError = error as Error & { http_code?: number; cloudinary_name?: string };
    console.error("[PROFILE_PHOTO_UPLOAD_ERROR]", {
      message: uploadError.message,
      http_code: uploadError.http_code,
      cloudinary_name: uploadError.cloudinary_name,
    });
    const message = error instanceof Error && error.message.startsWith("Cloudinary is not configured")
      ? "Profile image storage is not configured yet."
      : uploadError.http_code === 401 || uploadError.http_code === 403
        ? "Cloudinary rejected the upload credentials or permissions. Verify the Production Cloudinary API key, API secret, and cloud name."
      : "Unable to upload profile image. Please try again.";
    return fail(message, 500, "PROFILE_PHOTO_UPLOAD_FAILED");
  }
}
