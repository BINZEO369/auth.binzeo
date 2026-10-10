import ImageKit, { toFile } from "@imagekit/nodejs";

let client: ImageKit | null = null;
let metadataFieldsReady: Promise<boolean> | null = null;

function getImageKit() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  if (!privateKey) {
    throw new Error("ImageKit is not configured. Set IMAGEKIT_PRIVATE_KEY in the server environment.");
  }

  if (!client) {
    client = new ImageKit({ privateKey });
  }

  return client;
}

function safePathPart(value: string, fallback: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return normalized || fallback;
}

function extensionForMimeType(mimeType: string) {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "jpg";
  }
}

type ProfileImageOwner = {
  userId: string;
  binzeoId: string;
  username: string | null;
  displayName: string | null;
  websiteUrl: string;
  profileUrl: string | null;
};

async function ensureProfileMetadataFields(imagekit: ImageKit) {
  if (!metadataFieldsReady) {
    metadataFieldsReady = (async () => {
      try {
        const existing = await imagekit.customMetadataFields.list();
        const existingNames = new Set(existing.map((field) => field.name));
        const fields = [
          ["binzeoId", "BINZEO ID"],
          ["username", "Username"],
          ["displayName", "Display name"],
          ["websiteUrl", "Website URL"],
          ["profileUrl", "Public profile URL"],
        ] as const;

        for (const [name, label] of fields) {
          if (existingNames.has(name)) continue;
          await imagekit.customMetadataFields.create({
            name,
            label,
            schema: { type: "Text", maxLength: 500 },
            description: `BINZEO profile image ${label.toLowerCase()}.`,
          });
        }

        return true;
      } catch (error) {
        console.error("[IMAGEKIT_METADATA_FIELDS_ERROR]", error);
        return false;
      }
    })();
  }

  return metadataFieldsReady;
}

export async function uploadProfileImage(
  buffer: Buffer,
  mimeType: string,
  owner: ProfileImageOwner,
) {
  const imagekit = getImageKit();
  const metadataReady = await ensureProfileMetadataFields(imagekit);
  const binzeoId = safePathPart(owner.binzeoId, `user-${owner.userId.slice(0, 8)}`);
  const username = safePathPart(owner.username ?? "user", `user-${owner.userId.slice(0, 8)}`);
  const folder = `/binzeo/profiles/${binzeoId}-${username}`;
  const fileName = `profile-${username}-${binzeoId}.${extensionForMimeType(mimeType)}`;
  const file = await toFile(buffer, fileName);

  const uploaded = await imagekit.files.upload({
    file,
    fileName,
    folder,
    useUniqueFileName: false,
    overwriteFile: true,
    overwriteCustomMetadata: metadataReady,
    overwriteTags: true,
    isPrivateFile: false,
    tags: ["binzeo-profile", `binzeo-id-${binzeoId}`, `username-${username}`],
    description: `BINZEO profile photo for ${owner.displayName || username} (${owner.binzeoId})`,
    ...(metadataReady ? {
      customMetadata: {
        binzeoId: owner.binzeoId,
        username: owner.username ?? "",
        displayName: owner.displayName ?? "",
        websiteUrl: owner.websiteUrl,
        profileUrl: owner.profileUrl ?? "",
      },
      responseFields: ["customMetadata", "tags"] as const,
    } : {}),
  });

  if (!uploaded.url || !uploaded.fileId) {
    throw new Error("ImageKit did not return a profile image URL.");
  }

  return {
    url: uploaded.url,
    fileId: uploaded.fileId,
    folder,
    fileName,
    metadataReady,
  };
}
