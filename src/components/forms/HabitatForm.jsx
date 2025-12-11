import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import plantService from "@/services/plantService";
import { CheckCircle2 } from "lucide-react";

const HabitatForm = forwardRef(({ onSuccess, onCancel, initialData }, ref) => {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      climate: initialData?.climate || "",
      typical_habitates: initialData?.typical_habitates || "",
      temperature_min: initialData?.temperature_min || "",
      temperature_max: initialData?.temperature_max || "",
      soil_type: initialData?.soil_type || "",
      soil_ph_min: initialData?.soil_ph_min || "",
      soil_ph_max: initialData?.soil_ph_max || "",
      light: initialData?.light || "",
      rainfall_min: initialData?.rainfall_min || "",
      rainfall_max: initialData?.rainfall_max || "",
    },
  });
  const [loading, setLoading] = React.useState(false);

  useImperativeHandle(ref, () => ({
    clear: () => {
      reset({
        climate: "",
        typical_habitates: "",
        temperature_min: "",
        temperature_max: "",
        soil_type: "",
        soil_ph_min: "",
        soil_ph_max: "",
        light: "",
        rainfall_min: "",
        rainfall_max: "",
      });
    },
  }));

  useEffect(() => {
    if (initialData) {
      reset({
        climate: initialData.climate || "",
        typical_habitates: initialData.typical_habitates || "",
        temperature_min: initialData.temperature_min || "",
        temperature_max: initialData.temperature_max || "",
        soil_type: initialData.soil_type || "",
        soil_ph_min: initialData.soil_ph_min || "",
        soil_ph_max: initialData.soil_ph_max || "",
        light: initialData.light || "",
        rainfall_min: initialData.rainfall_min || "",
        rainfall_max: initialData.rainfall_max || "",
      });
    } else {
      reset({
        climate: "",
        typical_habitates: "",
        temperature_min: "",
        temperature_max: "",
        soil_type: "",
        soil_ph_min: "",
        soil_ph_max: "",
        light: "",
        rainfall_min: "",
        rainfall_max: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        climate: data.climate,
        typical_habitates: data.typical_habitates,
        temperature_min: data.temperature_min
          ? parseFloat(data.temperature_min)
          : null,
        temperature_max: data.temperature_max
          ? parseFloat(data.temperature_max)
          : null,
        soil_type: data.soil_type,
        soil_ph_min: data.soil_ph_min ? parseFloat(data.soil_ph_min) : null,
        soil_ph_max: data.soil_ph_max ? parseFloat(data.soil_ph_max) : null,
        light: data.light,
        rainfall_min: data.rainfall_min ? parseFloat(data.rainfall_min) : null,
        rainfall_max: data.rainfall_max ? parseFloat(data.rainfall_max) : null,
      };

      if (initialData?.$id) {
        await plantService.updateHabitat(initialData.$id, formattedData);
        toast.success("Habitat updated successfully");
      } else {
        await plantService.createHabitat(formattedData);
        toast.success("Habitat created successfully");
      }
      if (onSuccess) onSuccess();
      reset();
    } catch (error) {
      console.error("Error saving habitat:", error);
      toast.error("Failed to save habitat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Row 1: Climate & Light */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Climate</Label>
          <div className="relative">
            <Input
              {...register("climate", { required: true })}
              placeholder="e.g. Tropical"
              className="pr-10"
            />
            {watch("climate") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Light Exposure</Label>
          <div className="relative">
            <Input
              {...register("light")}
              placeholder="e.g. Full Sun"
              className="pr-10"
            />
            {watch("light") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Typical Habitats & Soil Type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Typical Habitats</Label>
          <div className="relative">
            <Input
              {...register("typical_habitates")}
              placeholder="e.g. Rainforest floor"
              className="pr-10"
            />
            {watch("typical_habitates") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Soil Type</Label>
          <div className="relative">
            <Input
              {...register("soil_type")}
              placeholder="e.g. Loamy"
              className="pr-10"
            />
            {watch("soil_type") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Temperature Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Temp Min (°C)</Label>
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              {...register("temperature_min")}
              placeholder="Min"
              className="pr-10"
            />
            {watch("temperature_min") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Temp Max (°C)</Label>
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              {...register("temperature_max")}
              placeholder="Max"
              className="pr-10"
            />
            {watch("temperature_max") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Soil pH Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Soil pH Min</Label>
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              {...register("soil_ph_min")}
              placeholder="e.g. 5.5"
              className="pr-10"
            />
            {watch("soil_ph_min") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Soil pH Max</Label>
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              {...register("soil_ph_max")}
              placeholder="e.g. 7.0"
              className="pr-10"
            />
            {watch("soil_ph_max") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 5: Rainfall Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Rainfall Min (mm)</Label>
          <div className="relative">
            <Input
              type="number"
              {...register("rainfall_min")}
              placeholder="Min"
              className="pr-10"
            />
            {watch("rainfall_min") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Rainfall Max (mm)</Label>
          <div className="relative">
            <Input
              type="number"
              {...register("rainfall_max")}
              placeholder="Max"
              className="pr-10"
            />
            {watch("rainfall_max") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : initialData
            ? "Update Habitat"
            : "Save Habitat"}
        </Button>
      </div>
    </form>
  );
});

HabitatForm.displayName = "HabitatForm";

export default HabitatForm;
