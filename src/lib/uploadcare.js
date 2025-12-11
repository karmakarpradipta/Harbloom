import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";

export const UPLOADCARE_PUB_KEY = "8fd62d97f98920880622";

export const extractUuidFromUrl = (url) => {
  if (!url) return null;
  // Matches both standard ucarecdn.com and custom *.ucarecd.net domains
  const match = url.match(
    /https?:\/\/(?:ucarecdn\.com|.*\.ucarecd\.net)\/([a-f0-9-]{36})\//
  );
  return match ? match[1] : null;
};

export const deleteFileFromUploadcare = async (uuid) => {
  if (!uuid) return;

  const secretKey = import.meta.env.VITE_UPLOADCARE_SECRET_KEY;

  if (!secretKey) {
    console.warn(
      "Uploadcare Secret Key not found. File deletion skipped. To enable deletion, set VITE_UPLOADCARE_SECRET_KEY in .env"
    );
    return;
  }

  const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
    publicKey: UPLOADCARE_PUB_KEY,
    secretKey: secretKey,
  });

  try {
    const result = await deleteFile(
      { uuid },
      { authSchema: uploadcareSimpleAuthSchema }
    );
    console.log(`File ${uuid} deleted from Uploadcare.`, result);
  } catch (error) {
    console.error("Error deleting file from Uploadcare:", error);
  }
};
