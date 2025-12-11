import { useState } from "react";
import { uploadDirect } from "@uploadcare/upload-client";
import { UPLOADCARE_PUB_KEY } from "@/lib/uploadcare";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Uploads a single file to Uploadcare manually.
   * @param {File} file - The file object to upload
   * @returns {Promise<{uuid: string, cdnUrl: string, name: string}>}
   */
  const uploadImage = async (file) => {
    if (!file) return null;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadDirect(file, {
        publicKey: UPLOADCARE_PUB_KEY,
        store: "auto",
        onProgress: (progressEvent) => {
          if (progressEvent.isComputable) {
            // progressEvent.value is 0 to 1
            setProgress(Math.round(progressEvent.value * 100));
          }
        },
      });

      setUploading(false);
      setProgress(100);

      // Construct CDN URL (default behavior of uploadcare-client commonly returns uuid)
      // result structure: { uuid, name, size, isImage, ... }
      const cdnUrl = `https://61xqy7evlv.ucarecd.net/${result.uuid}/`;

      return {
        uuid: result.uuid,
        cdnUrl: cdnUrl,
        name: result.name,
      };
    } catch (err) {
      console.error("Manual Upload Error:", err);
      setError(err.message || "Upload failed");
      setUploading(false);
      throw err;
    }
  };

  const resetState = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
  };

  return {
    uploadImage,
    uploading,
    progress,
    error,
    resetState,
  };
};
