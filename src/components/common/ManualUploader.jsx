import React, { useState, useRef } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const ManualUploader = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Use our custom hook for logic
  const { uploadImage, uploading, progress, error, resetState } =
    useImageUpload();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setSelectedFile(file);
      // Create local preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      resetState(); // Clear any previous errors/states
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    resetState();
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadImage(selectedFile);
      if (result) {
        toast.success("Image uploaded successfully!");
        onUploadSuccess(result); // Pass back { uuid, cdnUrl, name }
        handleClear(); // clear selection after success
      }
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
      <div className="flex flex-col gap-2">
        <Label>Select Image</Label>
        <div className="flex gap-2 items-center">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Preview Section */}
      {selectedFile && (
        <div className="mt-4 space-y-3">
          <div className="relative border rounded-md overflow-hidden bg-background w-full max-w-[200px] aspect-square flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="text-muted-foreground w-8 h-8" />
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-2">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-xs font-medium">{progress}%</span>
              </div>
            )}
          </div>

          {!uploading && (
            <div className="flex gap-2">
              <Button onClick={handleUploadClick} disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={uploading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}

          {uploading && (
            <Progress value={progress} className="w-full max-w-[200px] h-2" />
          )}
        </div>
      )}
    </div>
  );
};

export default ManualUploader;
