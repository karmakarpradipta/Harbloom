import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import plantService from "@/services/plantService";
import { CheckCircle2 } from "lucide-react";

const ChemicalProfileForm = forwardRef(
  ({ onSuccess, onCancel, initialData }, ref) => {
    const { register, handleSubmit, reset, watch } = useForm({
      defaultValues: {
        overview: initialData?.overview || "",
        main_constituents: initialData?.main_constituents
          ? initialData.main_constituents.join(", ")
          : "",
        notes: initialData?.notes || "",
      },
    });
    const [loading, setLoading] = React.useState(false);

    useImperativeHandle(ref, () => ({
      clear: () => {
        reset({
          overview: "",
          main_constituents: "",
          notes: "",
        });
      },
    }));

    useEffect(() => {
      if (initialData) {
        reset({
          overview: initialData.overview || "",
          main_constituents: initialData.main_constituents
            ? initialData.main_constituents.join(", ")
            : "",
          notes: initialData.notes || "",
        });
      } else {
        reset({
          overview: "",
          main_constituents: "",
          notes: "",
        });
      }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
      setLoading(true);
      try {
        // Validation: Prevent empty saves
        if (
          !data.overview?.trim() &&
          !data.main_constituents?.trim() &&
          !data.notes?.trim()
        ) {
          toast.error("Please fill in at least one field before saving.");
          setLoading(false);
          return;
        }

        // Transform comma separated lists
        const formattedData = {
          ...data,
          main_constituents: data.main_constituents
            ? data.main_constituents.split(",").map((s) => s.trim())
            : [],
        };

        let response;
        if (initialData?.$id) {
          response = await plantService.updateChemicalProfile(
            initialData.$id,
            formattedData
          );
          toast.success("Chemical profile updated!");
        } else {
          response = await plantService.createChemicalProfile(formattedData);
          toast.success("Chemical profile created!");
        }

        if (onSuccess) onSuccess(response);
        reset();
      } catch (error) {
        console.error(error);
        toast.error(
          error.message || "Failed to save profile. Please check your data."
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Overview
            {watch("overview") && (
              <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
            )}
          </Label>
          <Textarea
            {...register("overview")}
            placeholder="General overview of chemical composition..."
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Main Constituents (comma separated)</Label>
          <div className="relative">
            <Input
              {...register("main_constituents")}
              placeholder="e.g. Menthol, Menthone"
              className="pr-10"
            />
            {watch("main_constituents") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Notes
            {watch("notes") && (
              <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
            )}
          </Label>
          <Textarea
            {...register("notes")}
            placeholder="Additional notes..."
            className="min-h-[80px]"
          />
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update" : "Save Profile"}
          </Button>
        </div>
      </form>
    );
  }
);

ChemicalProfileForm.displayName = "ChemicalProfileForm";

export default ChemicalProfileForm;
