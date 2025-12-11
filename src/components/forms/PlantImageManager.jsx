import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X as XIcon } from "lucide-react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
// import ManualUploader from "@/components/common/ManualUploader";
import {
  deleteFileFromUploadcare,
  extractUuidFromUrl,
  UPLOADCARE_PUB_KEY,
} from "@/lib/uploadcare";
import { toast } from "sonner";

const PlantImageManager = () => {
  const { control } = useFormContext();
  // We use internal state for immediate UI feedback, but sync to form
  // Robust array management
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "images",
    // keyName default is "id"
  });

  const handleImageUpload = (fileInfo) => {
    console.log("handleImageUpload received:", fileInfo);

    if (fileInfo && fileInfo.cdnUrl) {
      // Replace default domain with custom domain to ensure "proper" CDN
      // This preserves any crop/edit modifiers in the URL
      const customUrl = fileInfo.cdnUrl.replace(
        "https://ucarecdn.com/",
        "https://61xqy7evlv.ucarecd.net/"
      );

      // Prevent duplicates
      if (fields.some((img) => img.url === customUrl)) {
        toast.warning("This image is already added.");
        return;
      }

      const newImage = {
        url: customUrl,
        caption: "",
        description: "",
        license: "All Rights Reserved",
        photographer_citation: "",
      };

      append(newImage);
      toast.success("Image added to gallery.");
    }
  };

  const removeImage = async (index, urlToRemove) => {
    // 1. Remove from UI immediately
    remove(index);
    toast.info("Image removed from gallery.");

    // 2. Delete from storage
    if (urlToRemove) {
      const uuid = extractUuidFromUrl(urlToRemove);
      if (uuid) {
        await deleteFileFromUploadcare(uuid);
        // toast.info("Image removed from storage.");
      }
    }
  };

  const updateImageDetails = (index, field, value) => {
    // We update the specific field in the object
    const currentItem = fields[index];
    update(index, { ...currentItem, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/5 hover:bg-muted/10 transition-colors">
        <div className="mb-4">
          <FileUploaderRegular
            sourceList="local, camera, gdrive"
            cameraModes="photo"
            cloudImageEditorAutoOpen={true}
            classNameUploader="uc-green"
            pubkey={UPLOADCARE_PUB_KEY}
            onFileUploadSuccess={handleImageUpload}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center max-w-sm">
          Supports JPG, PNG, WEBP. Max 10 images.
        </p>
      </div>

      {/* Image Grid */}
      {fields.length > 0 && (
        <div className="space-y-2">
          <Label>Gallery Preview ({fields.length})</Label>
          <div className="flex flex-col gap-4">
            {fields.map((img, index) => (
              <div
                key={img.id}
                className="relative flex flex-col md:flex-row gap-4 p-4 border rounded-xl bg-card text-card-foreground shadow-sm items-start"
              >
                {/* 1. Image Thumbnail (Left) */}
                <div className="shrink-0 w-full md:w-48 aspect-square md:aspect-auto md:h-48 rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={img.url}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* 2. Edit Fields (Right) */}
                <div className="flex-1 w-full space-y-4 md:pr-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Caption</Label>
                      <Input
                        value={img.caption || ""}
                        onChange={(e) =>
                          updateImageDetails(index, "caption", e.target.value)
                        }
                        placeholder="Brief caption..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>License</Label>
                      <Select
                        value={img.license}
                        onValueChange={(val) =>
                          updateImageDetails(index, "license", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select license" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Rights Reserved">
                            All Rights Reserved
                          </SelectItem>
                          <SelectItem value="CC BY">
                            CC BY (Attribution)
                          </SelectItem>
                          <SelectItem value="CC BY-SA">
                            CC BY-SA (ShareAlike)
                          </SelectItem>
                          <SelectItem value="CC0">
                            CC0 (Public Domain)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={img.description || ""}
                      onChange={(e) =>
                        updateImageDetails(index, "description", e.target.value)
                      }
                      placeholder="Detailed description..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Photographer</Label>
                    <Input
                      value={img.photographer_citation || ""}
                      onChange={(e) =>
                        updateImageDetails(
                          index,
                          "photographer_citation",
                          e.target.value
                        )
                      }
                      placeholder="Photographer name or source"
                    />
                  </div>
                </div>

                {/* 3. Remove Button (Top Right Absolute) */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-destructive"
                  onClick={() => removeImage(index, img.url)}
                  title="Remove Image"
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantImageManager;
