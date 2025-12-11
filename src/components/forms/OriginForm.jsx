import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import plantService from "@/services/plantService";
import { CheckCircle2 } from "lucide-react";

const OriginForm = forwardRef(({ onSuccess, onCancel, initialData }, ref) => {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      region: initialData?.region || "",
      countries: initialData?.countries ? initialData.countries.join(", ") : "",
      notes: initialData?.notes || "",
    },
  });
  const [loading, setLoading] = React.useState(false);

  useImperativeHandle(ref, () => ({
    clear: () => {
      reset({
        region: "",
        countries: "",
        notes: "",
      });
    },
  }));

  useEffect(() => {
    if (initialData) {
      reset({
        region: initialData.region || "",
        countries: initialData.countries
          ? initialData.countries.join(", ")
          : "",
        notes: initialData.notes || "",
      });
    } else {
      reset({
        region: "",
        countries: "",
        notes: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        region: data.region,
        countries: data.countries
          ? data.countries
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [],
        notes: data.notes,
      };

      if (initialData?.$id) {
        await plantService.updateOrigin(initialData.$id, formattedData);
        toast.success("Origin updated successfully");
      } else {
        await plantService.createOrigin(formattedData);
        toast.success("Origin created successfully");
      }
      if (onSuccess) onSuccess();
      reset();
    } catch (error) {
      console.error("Error saving origin:", error);
      toast.error("Failed to save origin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Continent / Region</Label>
          <div className="relative">
            <Input
              {...register("region", { required: true })}
              placeholder="e.g. South East Asia"
              className="pr-10"
            />
            {watch("region") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Countries (comma separated)</Label>
          <div className="relative">
            <Input
              {...register("countries")}
              placeholder="e.g. India, Nepal"
              className="pr-10"
            />
            {watch("countries") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Notes / Specific Locality
          {watch("notes") && (
            <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
          )}
        </Label>
        <Textarea
          {...register("notes")}
          placeholder="Specific region details..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : initialData
            ? "Update Origin"
            : "Save Origin"}
        </Button>
      </div>
    </form>
  );
});

OriginForm.displayName = "OriginForm";

export default OriginForm;
