import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
// import plantService from "@/services/plantService"; // Pending implementation

const ChemicalConstituentForm = ({ onSuccess, onCancel }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // await plantService.createChemicalConstituent(data);
      console.log("Chemical Data:", data);
      toast.info("Chemical creation logic pending.");
      if (onSuccess) onSuccess({ ...data, $id: "temp-id" });
      reset();
    } catch (error) {
      toast.error("Failed to save chemical");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-dashed shadow-none">
      <CardHeader>
        <CardTitle className="text-base">New Chemical Constituent</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                {...register("name", { required: true })}
                placeholder="e.g. Eugenol"
              />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Input {...register("class")} placeholder="e.g. Phenylpropene" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Formula</Label>
              <Input {...register("formula")} placeholder="e.g. C10H12O2" />
            </div>
            <div className="space-y-2">
              <Label>CAS Number</Label>
              <Input {...register("cas_number")} placeholder="e.g. 97-53-0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>PubChem CID</Label>
            <Input {...register("pubchem_cid")} placeholder="e.g. 3314" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Chemical description..."
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
              {loading ? "Saving..." : "Save Constituent"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChemicalConstituentForm;
