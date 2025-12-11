import { CheckCircle2 } from "lucide-react";
import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import plantService from "@/services/plantService";
import { databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import conf from "@/conf/conf";

const FamilyForm = forwardRef(({ onSuccess, onCancel, initialData }, ref) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      author_citation: initialData?.author_citation || "",
      description: initialData?.description || "",
    },
  });
  const [loading, setLoading] = React.useState(false);

  useImperativeHandle(ref, () => ({
    clear: () => {
      reset({
        name: "",
        author_citation: "",
        description: "",
      });
    },
  }));

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        author_citation: initialData.author_citation || "",
        description: initialData.description || "",
      });
    } else {
      reset({
        name: "",
        author_citation: "",
        description: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const familyData = {
        name: data.name,
        author_citation: data.author_citation,
        description: data.description,
      };

      if (initialData?.$id) {
        await plantService.updateFamily(initialData.$id, familyData);
        toast.success("Family updated successfully!");
      } else {
        await databases.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionIdFamilies,
          ID.unique(),
          familyData
        );
        toast.success("Family added successfully!");
      }

      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving family:", error);
      toast.error("Failed to save family.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Family Name</Label>
        <div className="relative">
          <Input
            {...register("name", { required: true })}
            placeholder="e.g. Lamiaceae"
            className="pr-10"
          />
          {watch("name") && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Author Citation</Label>
        <div className="relative">
          <Input
            {...register("author_citation")}
            placeholder="e.g. Martinov"
            className="pr-10"
          />
          {watch("author_citation") && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          )}
        </div>
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
          placeholder="Family characteristics..."
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
          {loading
            ? "Saving..."
            : initialData
            ? "Update Family"
            : "Save Family"}
        </Button>
      </div>
    </form>
  );
});

FamilyForm.displayName = "FamilyForm"; // Good practice for forwardRef

export default FamilyForm;
