import { v2 as cloudinary } from "cloudinary";

let configured = false;

function getCloudinary() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (cloudinaryUrl) {
    if (!configured) {
      // The SDK natively parses CLOUDINARY_URL, including encoded secrets.
      cloudinary.config(true);
      configured = true;
    }
    return cloudinary;
  }
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_URL or the three CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET variables.");
  }
  if (!configured) {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
    configured = true;
  }
  return cloudinary;
}

export function uploadProfileImage(buffer: Buffer, userId: string) {
  const client = getCloudinary();
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: "binzeo/profiles",
        public_id: userId,
        resource_type: "image",
        overwrite: true,
        invalidate: true,
        type: "upload",
      },
      (error, result) => {
        if (error || !result?.secure_url || !result.public_id) {
          const details = error as (Error & { http_code?: number; name?: string }) | undefined;
          const diagnostic = new Error(error?.message ?? "Cloudinary did not return an image URL.");
          Object.assign(diagnostic, { http_code: details?.http_code, cloudinary_name: details?.name });
          reject(diagnostic);
          return;
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      },
    );
    stream.end(buffer);
  });
}
