import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import plantService from "@/services/plantService";
import { CheckCircle2 } from "lucide-react";

const AyurvedicPropertiesForm = forwardRef(
  ({ onSuccess, onCancel, initialData }, ref) => {
    const { register, handleSubmit, reset, watch } = useForm({
      defaultValues: {
        tridoshic: initialData?.tridoshic || false,
        rasa: initialData?.rasa ? initialData.rasa.join(", ") : "",
        virya: initialData?.virya || "",
        vipaka: initialData?.vipaka || "",
        dosha_effect_vata: initialData?.dosha_effect_vata || "",
        dosha_effect_pitta: initialData?.dosha_effect_pitta || "",
        dosha_effect_kapha: initialData?.dosha_effect_kapha || "",
        classical_references: initialData?.classical_references
          ? initialData.classical_references.join("; ")
          : "",
      },
    });
    const [loading, setLoading] = React.useState(false);

    useImperativeHandle(ref, () => ({
      clear: () => {
        reset({
          tridoshic: false,
          rasa: "",
          virya: "",
          vipaka: "",
          dosha_effect_vata: "",
          dosha_effect_pitta: "",
          dosha_effect_kapha: "",
          classical_references: "",
        });
      },
    }));

    useEffect(() => {
      if (initialData) {
        reset({
          tridoshic: initialData.tridoshic || false,
          rasa: initialData.rasa ? initialData.rasa.join(", ") : "",
          virya: initialData.virya || "",
          vipaka: initialData.vipaka || "",
          dosha_effect_vata: initialData.dosha_effect_vata || "",
          dosha_effect_pitta: initialData.dosha_effect_pitta || "",
          dosha_effect_kapha: initialData.dosha_effect_kapha || "",
          classical_references: initialData.classical_references
            ? initialData.classical_references.join("; ")
            : "",
        });
      } else {
        reset({
          tridoshic: false,
          rasa: "",
          virya: "",
          vipaka: "",
          dosha_effect_vata: "",
          dosha_effect_pitta: "",
          dosha_effect_kapha: "",
          classical_references: "",
        });
      }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
      setLoading(true);
      try {
        const formattedData = {
          ...data,
          rasa: data.rasa ? data.rasa.split(",").map((s) => s.trim()) : [],
          classical_references: data.classical_references
            ? data.classical_references.split(";").map((s) => s.trim())
            : [],
        };

        const response = await plantService.createAyurvedicProperty(
          formattedData
        );
        toast.success("Ayurvedic properties saved!");
        if (onSuccess) onSuccess(response);
        reset();
      } catch (error) {
        console.error(error);
        toast.error("Failed to save ayurvedic properties");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="tridoshic" {...register("tridoshic")} />
          <Label htmlFor="tridoshic">
            Tridoshic (Balances all three doshas)
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Rasa (Taste)</Label>
            <div className="relative">
              <Input
                {...register("rasa")}
                placeholder="e.g. Madhura, Tikta"
                className="pr-10"
              />
              {watch("rasa") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Virya (Potency)</Label>
            <div className="relative">
              <Input
                {...register("virya")}
                placeholder="e.g. Sheeta (Cooling)"
                className="pr-10"
              />
              {watch("virya") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Vipaka (Post-digestive Effect)</Label>
          <div className="relative">
            <Input
              {...register("vipaka")}
              placeholder="e.g. Madhura"
              className="pr-10"
            />
            {watch("vipaka") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <Label>Vata Effect</Label>
            <div className="relative">
              <Input
                {...register("dosha_effect_vata")}
                placeholder="Pacifices/Aggravates"
                className="pr-10"
              />
              {watch("dosha_effect_vata") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Pitta Effect</Label>
            <div className="relative">
              <Input
                {...register("dosha_effect_pitta")}
                placeholder="Pacifices/Aggravates"
                className="pr-10"
              />
              {watch("dosha_effect_pitta") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Kapha Effect</Label>
            <div className="relative">
              <Input
                {...register("dosha_effect_kapha")}
                placeholder="Pacifices/Aggravates"
                className="pr-10"
              />
              {watch("dosha_effect_kapha") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Classical References (semicolon separated)</Label>
          <div className="relative">
            <Input
              {...register("classical_references")}
              placeholder="Charaka Samhita; Sushruta Samhita"
              className="pr-10"
            />
            {watch("classical_references") && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Properties"}
          </Button>
        </div>
      </form>
    );
  }
);

AyurvedicPropertiesForm.displayName = "AyurvedicPropertiesForm";

export default AyurvedicPropertiesForm;
