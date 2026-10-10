import ImageKit, { toFile } from "@imagekit/nodejs";

let client: ImageKit | null = null;

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

export async function uploadProfileImage(buffer: Buffer, userId: string) {
  const imagekit = getImageKit();
  const file = await toFile(buffer, `profile-${userId}.jpg`);
  const uploaded = await imagekit.files.upload({
    file,
    fileName: "profile.jpg",
    folder: "/binzeo/profiles",
    useUniqueFileName: false,
    overwriteFile: true,
    isPrivateFile: false,
    tags: ["binzeo-profile", `user-${userId}`],
  });

  if (!uploaded.url || !uploaded.fileId) {
    throw new Error("ImageKit did not return a profile image URL.");
  }

  return {
    url: uploaded.url,
    fileId: uploaded.fileId,
  };
}
