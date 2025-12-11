import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import plantService from "@/services/plantService";
import { CheckCircle2 } from "lucide-react";

const MedicinalProfileForm = forwardRef(
  ({ onSuccess, onCancel, initialData }, ref) => {
    const { register, handleSubmit, reset, watch } = useForm({
      defaultValues: {
        systems: initialData?.systems ? initialData.systems.join(", ") : "",
        actions: initialData?.actions ? initialData.actions.join(", ") : "",
        traditional_uses: initialData?.traditional_uses || "",
        modern_uses: initialData?.modern_uses || "",
      },
    });
    const [loading, setLoading] = React.useState(false);

    useImperativeHandle(ref, () => ({
      clear: () => {
        reset({
          systems: "",
          actions: "",
          traditional_uses: "",
          modern_uses: "",
        });
      },
    }));

    useEffect(() => {
      if (initialData) {
        reset({
          systems: initialData.systems ? initialData.systems.join(", ") : "",
          actions: initialData.actions ? initialData.actions.join(", ") : "",
          traditional_uses: initialData.traditional_uses || "",
          modern_uses: initialData.modern_uses || "",
        });
      } else {
        reset({
          systems: "",
          actions: "",
          traditional_uses: "",
          modern_uses: "",
        });
      }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
      setLoading(true);
      try {
        // Validation: Prevent empty saves
        if (
          !data.systems?.trim() &&
          !data.actions?.trim() &&
          !data.traditional_uses?.trim() &&
          !data.modern_uses?.trim()
        ) {
          toast.error("Please fill in at least one field.");
          setLoading(false);
          return;
        }

        const formattedData = {
          systems: data.systems
            ? data.systems
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          actions: data.actions
            ? data.actions
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          traditional_uses: data.traditional_uses,
          modern_uses: data.modern_uses,
        };

        let response;
        if (initialData?.$id) {
          response = await plantService.updateMedicinalProfile(
            initialData.$id,
            formattedData
          );
          toast.success("Medicinal profile updated!");
        } else {
          response = await plantService.createMedicinalProfile(formattedData);
          toast.success("Medicinal profile created!");
        }

        if (onSuccess) onSuccess(response);
        reset();
      } catch (error) {
        console.error(error);
        toast.error("Error saving medicinal profile");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Systems Affected (comma separated)</Label>
            <div className="relative">
              <Input
                {...register("systems")}
                placeholder="e.g. Respiratory, Digestive"
                className="pr-10"
              />
              {watch("systems") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Actions (comma separated)</Label>
            <div className="relative">
              <Input
                {...register("actions")}
                placeholder="e.g. Anti-inflammatory, Expectorant"
                className="pr-10"
              />
              {watch("actions") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="flex items-center gap-2">
              Traditional Uses
              {watch("traditional_uses") && (
                <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
              )}
            </Label>
            <span
              className={`text-xs ${
                (watch("traditional_uses")?.length || 0) > 500
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {watch("traditional_uses")?.length || 0}/500
            </span>
          </div>
          <Textarea
            {...register("traditional_uses", {
              maxLength: {
                value: 500,
                message: "Max 500 characters allowed",
              },
            })}
            placeholder="Historical or traditional applications..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="flex items-center gap-2">
              Modern Uses / Clinical Applications
              {watch("modern_uses") && (
                <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
              )}
            </Label>
            <span
              className={`text-xs ${
                (watch("modern_uses")?.length || 0) > 500
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {watch("modern_uses")?.length || 0}/500
            </span>
          </div>
          <Textarea
            {...register("modern_uses", {
              maxLength: {
                value: 500,
                message: "Max 500 characters allowed",
              },
            })}
            placeholder="Contemporary medical uses..."
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
            {loading ? "Saving..." : initialData ? "Update" : "Save Profile"}
          </Button>
        </div>
      </form>
    );
  }
);

MedicinalProfileForm.displayName = "MedicinalProfileForm";

export default MedicinalProfileForm;
