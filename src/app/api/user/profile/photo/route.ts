import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/response";
import { uploadProfileImage } from "@/lib/imagekit";

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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("binzeo_user_id, username")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile?.binzeo_user_id) {
      console.error("[PROFILE_PHOTO_OWNER_LOOKUP_ERROR]", profileError);
      return fail("Your BINZEO profile is not ready for image upload.", 409, "PROFILE_NOT_READY");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadProfileImage(buffer, file.type, {
      userId: user.id,
      binzeoId: profile.binzeo_user_id,
      username: profile.username,
    });

    const { data: savedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({ profile_photo_url: uploaded.url, profile_photo_public_id: uploaded.fileId })
      .eq("id", user.id)
      .select("profile_photo_url, profile_photo_public_id")
      .single();

    if (updateError) {
      console.error("[PROFILE_PHOTO_DB_UPDATE_ERROR]", updateError);
      return fail("Image uploaded, but the profile could not be updated.", 500, "PROFILE_PHOTO_SAVE_FAILED");
    }

    return ok({
      profile: savedProfile,
      image: {
        folder: uploaded.folder,
        fileName: uploaded.fileName,
      },
    });
  } catch (error) {
    const uploadError = error as Error & { status?: number; statusCode?: number };
    console.error("[PROFILE_PHOTO_UPLOAD_ERROR]", {
      message: uploadError.message,
      status: uploadError.status,
      statusCode: uploadError.statusCode,
    });
    const message = error instanceof Error && error.message.startsWith("ImageKit is not configured")
      ? "Profile image storage is not configured yet."
      : uploadError.status === 401 || uploadError.status === 403 || uploadError.statusCode === 401 || uploadError.statusCode === 403
        ? "ImageKit rejected the upload credentials or permissions. Verify the Production ImageKit private key."
      : "Unable to upload profile image. Please try again.";
    return fail(message, 500, "PROFILE_PHOTO_UPLOAD_FAILED");
  }
}
