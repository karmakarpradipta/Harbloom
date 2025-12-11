import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import plantService from "@/services/plantService";
import { CheckCircle2 } from "lucide-react";

const PropagationForm = forwardRef(
  ({ onSuccess, onCancel, initialData }, ref) => {
    const { register, handleSubmit, reset, watch } = useForm({
      defaultValues: {
        method_name: initialData?.method_name || "",
        difficulty: initialData?.difficulty || "",
        season: initialData?.season || "",
        steps: initialData?.steps || "",
      },
    });
    const [loading, setLoading] = React.useState(false);

    useImperativeHandle(ref, () => ({
      clear: () => {
        reset({
          method_name: "",
          difficulty: "",
          season: "",
          steps: "",
        });
      },
    }));

    useEffect(() => {
      if (initialData) {
        reset({
          method_name: initialData.method_name || "",
          difficulty: initialData.difficulty || "",
          season: initialData.season || "",
          steps: initialData.steps || "",
        });
      } else {
        reset({
          method_name: "",
          difficulty: "",
          season: "",
          steps: "",
        });
      }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
      setLoading(true);
      try {
        const response = await plantService.createPropagationMethod(data);
        toast.success("Propagation method saved!");
        if (onSuccess) onSuccess(response);
        reset();
      } catch (error) {
        console.error(error);
        toast.error("Failed to save propagation method");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Method Name</Label>
            <div className="relative">
              <Input
                {...register("method_name", { required: true })}
                placeholder="e.g. Seed Stratification"
                className="pr-10"
              />
              {watch("method_name") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <div className="relative">
              <Input
                {...register("difficulty")}
                placeholder="e.g. Moderate"
                className="pr-10"
              />
              {watch("difficulty") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Best Season</Label>
          <div className="relative">
            <Input
              {...register("season")}
              placeholder="e.g. Early Spring"
              className="pr-10"
            />
            {watch("season") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Instructions
            {watch("steps") && (
              <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
            )}
          </Label>
          <Textarea
            {...register("steps")}
            placeholder="Step-by-step propagation guide..."
            className="min-h-[120px]"
          />
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Method"}
          </Button>
        </div>
      </form>
    );
  }
);

PropagationForm.displayName = "PropagationForm";

export default PropagationForm;
