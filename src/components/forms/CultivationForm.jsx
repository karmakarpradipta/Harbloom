import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import plantService from "@/services/plantService";
import { CheckCircle2 } from "lucide-react";

const CultivationForm = forwardRef(
  ({ onSuccess, onCancel, initialData }, ref) => {
    const { register, handleSubmit, reset, watch } = useForm({
      defaultValues: {
        land_preparation: initialData?.land_preparation || "",
        sowing_time: initialData?.sowing_time || "",
        yield_info: initialData?.yield_info || "",
        spacing: initialData?.spacing || "",
        irrigation: initialData?.irrigation || "",
        fertilizer: initialData?.fertilizer || "",
        harvest_time: initialData?.harvest_time || "",
      },
    });
    const [loading, setLoading] = React.useState(false);

    useImperativeHandle(ref, () => ({
      clear: () => {
        reset({
          land_preparation: "",
          sowing_time: "",
          yield_info: "",
          spacing: "",
          irrigation: "",
          fertilizer: "",
          harvest_time: "",
        });
      },
    }));

    useEffect(() => {
      if (initialData) {
        reset({
          land_preparation: initialData.land_preparation || "",
          sowing_time: initialData.sowing_time || "",
          yield_info: initialData.yield_info || "",
          spacing: initialData.spacing || "",
          irrigation: initialData.irrigation || "",
          fertilizer: initialData.fertilizer || "",
          harvest_time: initialData.harvest_time || "",
        });
      } else {
        reset({
          land_preparation: "",
          sowing_time: "",
          yield_info: "",
          spacing: "",
          irrigation: "",
          fertilizer: "",
          harvest_time: "",
        });
      }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
      setLoading(true);
      try {
        if (
          !data.land_preparation?.trim() &&
          !data.sowing_time?.trim() &&
          !data.yield_info?.trim() &&
          !data.spacing?.trim() &&
          !data.irrigation?.trim() &&
          !data.fertilizer?.trim() &&
          !data.harvest_time?.trim()
        ) {
          toast.error("Please fill in at least one field.");
          setLoading(false);
          return;
        }

        const formattedData = {
          land_preparation: data.land_preparation,
          sowing_time: data.sowing_time,
          yield_info: data.yield_info,
          spacing: data.spacing,
          irrigation: data.irrigation,
          fertilizer: data.fertilizer,
          harvest_time: data.harvest_time,
        };

        let response;
        if (initialData?.$id) {
          response = await plantService.updateCultivationProfile(
            initialData.$id,
            formattedData
          );
          toast.success("Cultivation profile updated!");
        } else {
          response = await plantService.createCultivationProfile(formattedData);
          toast.success("Cultivation profile created!");
        }

        if (onSuccess) onSuccess(response);
        reset();
      } catch (error) {
        console.error(error);
        toast.error("Failed to save cultivation data");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1: Long Text Areas */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Land Preparation (Max 500)</Label>
              <span className="text-xs text-muted-foreground">
                {watch("land_preparation")?.length || 0}/500
              </span>
            </div>
            <Textarea
              {...register("land_preparation", { maxLength: 500 })}
              placeholder="e.g. Deep ploughing, soil treatment..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Sowing Time (Max 500)</Label>
              <span className="text-xs text-muted-foreground">
                {watch("sowing_time")?.length || 0}/500
              </span>
            </div>
            <Textarea
              {...register("sowing_time", { maxLength: 500 })}
              placeholder="e.g. Early spring, June-July..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        {/* Row 2: Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Yield Info</Label>
            <Input
              {...register("yield_info", { maxLength: 256 })}
              placeholder="e.g. 5-6 tons/hectare"
            />
          </div>
          <div className="space-y-2">
            <Label>Spacing</Label>
            <Input
              {...register("spacing", { maxLength: 256 })}
              placeholder="e.g. 30cm x 30cm"
            />
          </div>
          <div className="space-y-2">
            <Label>Irrigation</Label>
            <Input
              {...register("irrigation", { maxLength: 256 })}
              placeholder="e.g. Drip irrigation, weekly"
            />
          </div>
          <div className="space-y-2">
            <Label>Fertilizer</Label>
            <Input
              {...register("fertilizer", { maxLength: 256 })}
              placeholder="e.g. NPK 10:10:10"
            />
          </div>
          <div className="space-y-2">
            <Label>Harvest Time</Label>
            <Input
              {...register("harvest_time", { maxLength: 256 })}
              placeholder="e.g. After 3 months"
            />
          </div>
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
              ? "Update"
              : "Save Requirements"}
          </Button>
        </div>
      </form>
    );
  }
);

CultivationForm.displayName = "CultivationForm";

export default CultivationForm;
