import React, { useState, useEffect } from "react";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Pill,
  Settings2,
  X,
} from "lucide-react";
import UploadcareWrapper from "@/components/common/UploadcareWrapper";
import plantService from "@/services/plantService";
import { toast } from "sonner";
import { deleteFileFromUploadcare, extractUuidFromUrl } from "@/lib/uploadcare";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const PlantPartsManager = () => {
  const { control, register, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts_data",
  });

  const [availableParts, setAvailableParts] = useState([]);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const response = await plantService.getPlantParts();
      if (response?.documents) {
        setAvailableParts(
          response.documents.map((p) => ({ label: p.name, value: p.$id }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch parts:", error);
    }
  };

  const handlePartImageUpload = (index, fileInfo) => {
    if (fileInfo && fileInfo.cdnUrl) {
      // 1. Enforce Custom CDN Domain
      const customUrl = fileInfo.cdnUrl.replace(
        "https://ucarecdn.com/",
        "https://61xqy7evlv.ucarecd.net/"
      );

      const currentParts = watch("parts_data");
      const currentPart = currentParts[index];
      const currentImages = currentPart.images || [];

      // 2. Prevent Duplicates
      if (currentImages.some((img) => img.url === customUrl)) {
        toast.warning("This image is already added to this part.");
        return;
      }

      const newImage = {
        url: customUrl,
        caption: "",
        license: "All Rights Reserved",
      };

      setValue(`parts_data.${index}.images`, [...currentImages, newImage]);
      toast.success("Image added to part.");
    }
  };

  const removePartImage = async (partIndex, imgIndex) => {
    const currentParts = watch("parts_data");
    const imageToRemove = currentParts[partIndex].images[imgIndex];

    // 1. Remove from UI immediately
    const currentImages = [...(currentParts[partIndex].images || [])];
    currentImages.splice(imgIndex, 1);
    setValue(`parts_data.${partIndex}.images`, currentImages);
    toast.info("Image removed.");

    // 2. Clean up from cloud
    if (imageToRemove?.url) {
      const uuid = extractUuidFromUrl(imageToRemove.url);
      if (uuid) {
        try {
          await deleteFileFromUploadcare(uuid);
        } catch (error) {
          console.error("Background deletion failed:", error);
        }
      }
    }
  };

  const addUsage = (index) => {
    const currentParts = watch("parts_data");
    const currentUsages = currentParts[index].usages || [];
    setValue(`parts_data.${index}.usages`, [
      ...currentUsages,
      { indication: "", route: "", preparation_form: "", notes: "" },
    ]);
  };

  const removeUsage = (partIndex, usageIndex) => {
    const currentParts = watch("parts_data");
    const currentUsages = [...(currentParts[partIndex].usages || [])];
    currentUsages.splice(usageIndex, 1);
    setValue(`parts_data.${partIndex}.usages`, currentUsages);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Plant Parts Configuration
          </h3>
          <p className="text-sm text-muted-foreground">
            Define which parts are used (e.g., Roots, Leaves) and their specific
            applications.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => append({ part_id: "", usages: [], images: [] })}
          className="gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Part
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-muted/5 space-y-3">
          <div className="p-4 bg-primary/10 rounded-full">
            <Settings2 className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground max-w-sm">
            No parts defined yet. Click <strong>Add Part</strong> to start
            documenting usages and uploading part-specific photos.
          </p>
        </div>
      )}

      <div className="grid gap-8">
        {fields.map((field, index) => (
          <Card
            key={field.id}
            className="border-primary/10 shadow-md bg-background/50 relative overflow-hidden group"
          >
            {/* Part Header */}
            <CardHeader className="bg-muted/10 pb-4 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="w-full max-w-sm">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                      Select Plant Part
                    </Label>
                    <Controller
                      name={`parts_data.${index}.part_id`}
                      control={control}
                      rules={{ required: "Part is required" }}
                      render={({ field }) => (
                        <Combobox
                          options={availableParts}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Search parts (e.g. Leaf)..."
                          className="w-full"
                        />
                      )}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remove Part
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 p-6">
              {/* MEDICAL USAGE SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <Pill className="h-4 w-4" /> Medical Applications
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addUsage(index)}
                    className="h-8 border-dashed"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Usage
                  </Button>
                </div>

                <div className="space-y-3">
                  {watch(`parts_data.${index}.usages`)?.map((usage, uIndex) => (
                    <div
                      key={uIndex}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 rounded-lg border bg-card hover:border-primary/20 transition-colors"
                    >
                      <div className="md:col-span-4 space-y-1.5">
                        <Label className="text-xs">Indication</Label>
                        <Input
                          {...register(
                            `parts_data.${index}.usages.${uIndex}.indication`
                          )}
                          placeholder="e.g. Cough, Fever"
                          className="bg-background h-9"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-1.5">
                        <Label className="text-xs">Preparation</Label>
                        <Input
                          {...register(
                            `parts_data.${index}.usages.${uIndex}.preparation_form`
                          )}
                          placeholder="e.g. Tea, Paste"
                          className="bg-background h-9"
                        />
                      </div>
                      <div className="md:col-span-4 space-y-1.5">
                        <Label className="text-xs">Method/Route</Label>
                        <Input
                          {...register(
                            `parts_data.${index}.usages.${uIndex}.route`
                          )}
                          placeholder="e.g. Oral, Topical"
                          className="bg-background h-9"
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end pb-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeUsage(index, uIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* Optional Notes Row if complex */}
                      <div className="md:col-span-12 pt-2">
                        <Input
                          {...register(
                            `parts_data.${index}.usages.${uIndex}.notes`
                          )}
                          placeholder="Optional notes or dosage instructions..."
                          className="bg-transparent border-0 border-b rounded-none px-0 h-8 focus-visible:ring-0 placeholder:text-muted-foreground/50 text-xs"
                        />
                      </div>
                    </div>
                  ))}

                  {(!watch(`parts_data.${index}.usages`) ||
                    watch(`parts_data.${index}.usages`).length === 0) && (
                    <div className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg text-center border border-dashed">
                      No medical usages added yet.
                    </div>
                  )}
                </div>
              </div>

              {/* IMAGES SECTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <ImageIcon className="h-4 w-4" /> Visual Verification
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Uploader Button */}
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/50 hover:bg-muted/30 transition-colors h-32 w-full aspect-square relative">
                    <div className="scale-75 origin-center absolute inset-0 flex items-center justify-center">
                      <UploadcareWrapper
                        onUploadSuccess={(info) =>
                          handlePartImageUpload(index, info)
                        }
                      />
                    </div>
                  </div>

                  {/* Image List */}
                  {watch(`parts_data.${index}.images`)?.map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="relative group aspect-square rounded-xl overflow-hidden border shadow-sm"
                    >
                      <img
                        src={img.url}
                        alt={`Part ${imgIndex}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => removePartImage(index, imgIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-1 bg-black/50 backdrop-blur-sm">
                        <Input
                          value={img.caption || ""}
                          onChange={(e) => {
                            const currentParts = watch("parts_data");
                            const currentImages = [
                              ...currentParts[index].images,
                            ];
                            currentImages[imgIndex].caption = e.target.value;
                            setValue(
                              `parts_data.${index}.images`,
                              currentImages
                            );
                          }}
                          placeholder="Caption..."
                          className="h-6 text-[10px] bg-transparent border-0 text-white placeholder:text-white/50 focus-visible:ring-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlantPartsManager;
