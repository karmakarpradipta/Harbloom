import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import plantService from "@/services/plantService";
import { CheckCircle2 } from "lucide-react";

const TagForm = forwardRef(({ onSuccess, onCancel, initialData }, ref) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "General",
      description: initialData?.description || "",
    },
  });
  const [loading, setLoading] = React.useState(false);

  useImperativeHandle(ref, () => ({
    clear: () => {
      reset({
        name: "",
        type: "General",
        description: "",
      });
    },
  }));

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        type: initialData.type || "General",
        description: initialData.description || "",
      });
    } else {
      reset({
        name: "",
        type: "General",
        description: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const tagData = {
        name: data.name,
        type: data.type || "General",
        description: data.description,
      };

      if (initialData?.$id) {
        await plantService.updateTag(initialData.$id, tagData);
        toast.success(`Tag "${tagData.name}" updated successfully!`);
      } else {
        const response = await plantService.createTag(tagData);
        toast.success(`Tag "${response.name}" created successfully!`);
      }

      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving tag:", error);
      toast.error("Failed to save tag.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>
          Tag Name <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            {...register("name", { required: "Name is required" })}
            placeholder="e.g. Fast Growing"
            className="pr-10"
          />
          {watch("name") && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          )}
        </div>
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Type / Category</Label>
        <Controller
          name="type"
          control={control}
          defaultValue="General"
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Season">Season</SelectItem>
                <SelectItem value="Characteristic">Characteristic</SelectItem>
                <SelectItem value="Usage">Usage</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
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
          placeholder="Tag details..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Tag" : "Create Tag"}
        </Button>
      </div>
    </form>
  );
});

TagForm.displayName = "TagForm";

export default TagForm;
