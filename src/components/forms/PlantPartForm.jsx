import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { plantPartSchema } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import plantService from "@/services/plantService";
import { CheckCircle2 } from "lucide-react";

const PlantPartForm = forwardRef(
  ({ onSuccess, onCancel, initialData }, ref) => {
    const {
      register,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(plantPartSchema),
      defaultValues: {
        name: initialData?.name || "",
        description: initialData?.description || "",
      },
    });

    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      clear: () => {
        reset({
          name: "",
          description: "",
        });
      },
    }));

    useEffect(() => {
      if (initialData) {
        reset({
          name: initialData.name || "",
          description: initialData.description || "",
        });
      } else {
        reset({
          name: "",
          description: "",
        });
      }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
      setLoading(true);
      try {
        const payload = {
          name: data.name,
          description: data.description,
        };

        if (initialData?.$id) {
          await plantService.updatePlantPart(initialData.$id, payload);
          toast.success("Plant part updated successfully!");
        } else {
          await plantService.createPlantPart(payload);
          toast.success("Plant part created successfully!");
        }

        if (onSuccess) onSuccess();
        reset();
      } catch (error) {
        console.error(error);
        toast.error("Error saving plant part");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Part Name (e.g. Root)</Label>
            <div className="relative">
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter plant part name"
                className="pr-10"
              />
              {watch("name") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Description
              {watch("description") && (
                <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
              )}
            </Label>
            <Textarea
              {...register("description")}
              placeholder="Describe the plant part..."
              className="min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : initialData
              ? "Update Plant Part"
              : "Save Plant Part"}
          </Button>
        </div>
      </form>
    );
  }
);

PlantPartForm.displayName = "PlantPartForm";

export default PlantPartForm;
