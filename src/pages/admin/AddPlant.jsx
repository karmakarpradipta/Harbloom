import React, { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Save,
  Loader2,
  FlaskConical,
  Stethoscope,
  Sprout,
  Image as ImageIcon,
  X,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import plantService from "@/services/plantService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // Added import
import PlantPartsManager from "@/components/forms/PlantPartsManager";
import PlantImageManager from "@/components/forms/PlantImageManager";
// ... existing imports ...
import OriginForm from "@/components/forms/OriginForm";
import HabitatForm from "@/components/forms/HabitatForm";
import FamilyForm from "@/components/forms/FamilyForm";
import TagForm from "@/components/forms/TagForm";
import LivePlantPreview from "@/components/previews/LivePlantPreview";
import { deleteFileFromUploadcare } from "@/lib/uploadcare";
import { Progress } from "@/components/ui/progress";

const AddPlant = () => {
  const navigate = useNavigate(); // Hook
  const [activeTab, setActiveTab] = useState("general");
  const [families, setFamilies] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [parts, setParts] = useState([]);
  const [tags, setTags] = useState([]);
  const [chemicalProfiles, setChemicalProfiles] = useState([]);
  const [medicinalProfiles, setMedicinalProfiles] = useState([]);
  const [ayurvedicProfiles, setAyurvedicProfiles] = useState([]);
  const [cultivationProfiles, setCultivationProfiles] = useState([]);

  // ... (existing fetchers)

  const fetchAyurvedicProfiles = async () => {
    try {
      const response = await plantService.getAyurvedicProperties();
      if (response && response.documents) {
        setAyurvedicProfiles(
          response.documents.map((doc) => ({
            label:
              doc.rasa || doc.virya
                ? `${doc.rasa || "?"} / ${doc.virya || "?"}`
                : "Unnamed Property",
            value: doc.$id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching ayurvedic profiles:", error);
    }
  };

  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [tempFamilyName, setTempFamilyName] = useState("");

  const fetchParts = async () => {
    try {
      const response = await plantService.getPlantParts();
      if (response?.documents) {
        setParts(response.documents);
      }
    } catch (error) {
      console.error("Failed to fetch parts:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await plantService.getTags();
      if (response && response.documents) {
        setTags(response.documents);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchChemicalProfiles = async () => {
    try {
      const response = await plantService.getChemicalProfiles();
      if (response && response.documents) {
        setChemicalProfiles(
          response.documents.map((doc) => ({
            label: doc.overview
              ? `${doc.overview.substring(0, 40)}...`
              : "Unnamed Profile",
            value: doc.$id,
            description: doc.main_constituents,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching chemical profiles:", error);
    }
  };

  const fetchMedicinalProfiles = async () => {
    try {
      const response = await plantService.getMedicinalProfiles();
      if (response && response.documents) {
        setMedicinalProfiles(
          response.documents.map((doc) => ({
            label:
              doc.traditional_uses || doc.modern_uses
                ? `${(doc.traditional_uses || doc.modern_uses).substring(
                    0,
                    40
                  )}...`
                : "Unnamed Profile",
            value: doc.$id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching medicinal profiles:", error);
    }
  };

  const fetchCultivationProfiles = async () => {
    try {
      const response = await plantService.getCultivationProfiles();
      if (response && response.documents) {
        setCultivationProfiles(
          response.documents.map((doc) => ({
            label:
              doc.yield_info || doc.land_preparation
                ? `${(doc.yield_info || doc.land_preparation).substring(
                    0,
                    40
                  )}...`
                : "Unnamed Profile",
            value: doc.$id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching cultivation profiles:", error);
    }
  };

  useEffect(() => {
    fetchFamilies();
    fetchOrigins();
    fetchHabitats();
    fetchParts();
    fetchTags();
    fetchChemicalProfiles();
    fetchMedicinalProfiles();
    fetchAyurvedicProfiles();
    fetchCultivationProfiles();
  }, []);

  const defaultValues = {
    scientific_name: "",
    common_names: [],
    common_names_input: "",
    genus: "",
    species: "",
    family: "",
    origin: "",
    habitat: "",
    plant_type: "",
    short_description: "",
    chemical_profile: "",
    medicinal_profile: "",
    cultivation_profile: "",
    parts_data: [],
    tags: [],
    images: [],
  };

  const getSavedData = () => {
    try {
      const saved = localStorage.getItem("harbloom_plant_draft");
      return saved ? { ...defaultValues, ...JSON.parse(saved) } : defaultValues;
    } catch (e) {
      console.error("Error loading draft:", e);
      return defaultValues;
    }
  };

  const formMethods = useForm({
    defaultValues: getSavedData(),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = formMethods;

  const watchedData = watch();

  // Auto-save draft
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("harbloom_plant_draft", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const calculateProgress = () => {
    let score = 0;
    const totalWeight = 14;

    // Basic Info
    if (watchedData.scientific_name) score++;
    if (
      (watchedData.common_names && watchedData.common_names.length > 0) ||
      watchedData.common_names_input
    )
      score++;
    if (watchedData.genus) score++;
    if (watchedData.species) score++;
    if (watchedData.family) score++;
    if (watchedData.origin) score++;
    if (watchedData.habitat) score++;
    if (watchedData.plant_type) score++;
    if (watchedData.short_description) score++;

    // Profiles
    if (watchedData.chemical_profile) score++;
    if (watchedData.medicinal_profile) score++;
    if (watchedData.cultivation_profile) score++;

    // Rich Data
    if (watchedData.images && watchedData.images.length > 0) score++;
    if (watchedData.parts_data && watchedData.parts_data.length > 0) score++;

    return Math.min(Math.round((score / totalWeight) * 100), 100);
  };

  const progress = calculateProgress();

  // ... (Image handling code typically here) ...

  // Fetchers
  const fetchFamilies = async () => {
    try {
      const response = await plantService.getFamilies();
      if (response && response.documents) {
        setFamilies(
          response.documents.map((doc) => ({
            label: doc.name,
            value: doc.$id, // storing ID as value
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching families:", error);
      toast.error("Failed to load families.");
    }
  };

  const fetchOrigins = async () => {
    try {
      const response = await plantService.getOrigins();
      if (response && response.documents) {
        setOrigins(
          response.documents.map((doc) => ({
            label: `${doc.region} (${doc.country_code})`,
            value: doc.$id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching origins:", error);
    }
  };

  const fetchHabitats = async () => {
    try {
      const response = await plantService.getHabitats();
      if (response && response.documents) {
        setHabitats(
          response.documents.map((doc) => ({
            label: `${doc.climate} - ${doc.soil_type}`,
            value: doc.$id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching habitats:", error);
    }
  };

  useEffect(() => {
    fetchFamilies();
    fetchOrigins();
    fetchHabitats();
    fetchParts();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 1. Create Plant First (to get ID)
      const selectedFamily = families.find((f) => f.value === data.family);

      const plantData = {
        scientificName: data.scientific_name,
        familyName: selectedFamily ? selectedFamily.label : null,
        common_names: data.common_names_input
          ? data.common_names_input.split(",").map((s) => s.trim())
          : [],
        genus: data.genus,
        species: data.species,
        families: data.family,
        origins: data.origin || null,
        habitats: data.habitat || null,
        plant_type: data.plant_type,
        short_description: data.short_description,
        full_description: data.full_description,
        chemicalProfiles: data.chemical_profile || null,
        medicinalProfiles: data.medicinal_profile || null,
        ayurvedicProperties: data.ayurveda || null,
        cultivationRequirements: data.cultivation_profile || null,
        tags: data.tags || [],
        images: [], // Initialize empty, update later
      };

      const newPlant = await plantService.createPlant(plantData);

      // 2. Create Image Documents linked to Plant
      const imageUrls = [];
      if (data.images && data.images.length > 0) {
        const imagePromises = data.images.map((img) =>
          plantService.createImageRecord({
            plants: newPlant.$id,
            url: img.url,
            caption: img.caption,
            license: img.license,
            photographer: img.photographer_citation,
          })
        );

        const imageResults = await Promise.all(imagePromises);
        imageResults.forEach((doc) => {
          if (doc && doc.url) imageUrls.push(doc.url);
        });

        // 3. Update Plant with Image URLs
        if (imageUrls.length > 0) {
          await plantService.updatePlant(newPlant.$id, {
            images: imageUrls,
          });
        }
      }

      // 3. Process Plant Parts & Usage
      if (data.parts_data && data.parts_data.length > 0) {
        // We will process each part sequentially or parallel
        const partPromises = data.parts_data.map(async (part) => {
          if (!part.part_id) return;

          // 3a. Create Usages
          if (part.usages && part.usages.length > 0) {
            const usagePromises = part.usages.map((usage) =>
              plantService.createPlantPartUsage({
                plants: newPlant.$id,
                plantParts: part.part_id,
                indication: usage.indication || "General",
                preparation_form: usage.preparation_form,
                route: usage.route,
                notes: usage.notes,
              })
            );
            await Promise.all(usagePromises);
          }

          // 3b. Create Images for this Part
          if (part.images && part.images.length > 0) {
            const partImagePromises = part.images.map((img) =>
              plantService.createImageRecord({
                plants: newPlant.$id,
                url: img.url,
                shot_part: part.part_id, // Relation for "shot of a specific part"?
                // Note: 'shot_part' in schema is string. ID is fine.
                caption: img.caption,
                license: img.license,
              })
            );
            await Promise.all(partImagePromises);
          }
        });

        await Promise.all(partPromises);
      }

      toast.success("Plant successfully created!");
      localStorage.removeItem("harbloom_plant_draft");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error creating plant:", error);
      toast.error("Failed to create plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsResetting(true);
    const images = formMethods.getValues("images");

    // Cleanup images if any
    if (images && images.length > 0) {
      toast.info("Cleaning up and resetting...");
      try {
        await Promise.all(
          images.map(async (img) => {
            const uuid = extractUuidFromUrl(img.url);
            if (uuid) {
              await deleteFileFromUploadcare(uuid);
            }
          })
        );
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    }

    // Reset Form
    localStorage.removeItem("harbloom_plant_draft");
    formMethods.reset(defaultValues);
    setActiveTab("general");
    window.scrollTo({ top: 0, behavior: "smooth" });

    toast.success("Form reset successfully.");
    setIsResetting(false);
  };

  return (
    <FormProvider {...formMethods}>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/5">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Add New Plant
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Create a comprehensive botanical entry
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col w-48 gap-1">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Entry Completeness</span>
                  <span className="text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isResetting || loading}
                  className="hidden sm:flex min-w-[100px]"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting
                    </>
                  ) : (
                    "Reset Form"
                  )}
                </Button>
                <LivePlantPreview
                  families={families}
                  habitats={habitats}
                  origins={origins}
                  parts={parts}
                  tags={tags}
                />
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Plant
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1 w-full bg-muted/5">
          <div className="max-w-5xl mx-auto p-6 w-full">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8 flex flex-col items-center w-full"
            >
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full h-auto p-1 bg-muted/80 backdrop-blur-md border border-border rounded-xl gap-1">
                <TabsTrigger
                  value="general"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2"
                >
                  Identity
                </TabsTrigger>
                <TabsTrigger
                  value="taxonomy"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2"
                >
                  Taxonomy
                </TabsTrigger>
                <TabsTrigger
                  value="chemistry"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2"
                >
                  Chemistry
                </TabsTrigger>
                <TabsTrigger
                  value="medicinal"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2"
                >
                  Medicinal
                </TabsTrigger>
                <TabsTrigger
                  value="parts"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2"
                >
                  Parts & Usage
                </TabsTrigger>
                <TabsTrigger
                  value="cultivation"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2"
                >
                  Cultivation
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2"
                >
                  Media
                </TabsTrigger>
              </TabsList>

              {/* TAB: GENERAL IDENTITY */}
              <TabsContent
                value="general"
                className="w-full space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-xl">Basic Identity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="scientific_name"
                          className="text-sm font-medium"
                        >
                          Scientific Name{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="scientific_name"
                            {...register("scientific_name", { required: true })}
                            placeholder="e.g. Ocimum sanctum"
                            className="bg-background pr-10"
                          />
                          {watch("scientific_name") && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        {errors.scientific_name && (
                          <p className="text-destructive text-xs">
                            {errors.scientific_name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="common_names"
                          className="text-sm font-medium"
                        >
                          Common Names (comma separated)
                        </Label>
                        <div className="relative">
                          <Input
                            id="common_names"
                            {...register("common_names_input")}
                            placeholder="e.g. Holy Basil, Tulsi"
                            className="bg-background pr-10"
                          />
                          {watch("common_names_input") && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Family <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="family"
                          control={control}
                          rules={{ required: "Family is required" }}
                          render={({ field }) => (
                            <Combobox
                              options={families}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select Family"
                              emptyText="No family found."
                              onCreate={(query) => {
                                setTempFamilyName(query);
                                setIsFamilyModalOpen(true);
                              }}
                              createLabel='Create Family "%s"'
                              className="w-full"
                            />
                          )}
                        />
                        {errors.family && (
                          <p className="text-destructive text-xs">
                            {errors.family.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="genus" className="text-sm font-medium">
                          Genus
                        </Label>
                        <div className="relative">
                          <Input
                            id="genus"
                            {...register("genus")}
                            placeholder="e.g. Ocimum"
                            className="bg-background pr-10"
                          />
                          {watch("genus") && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="species"
                          className="text-sm font-medium"
                        >
                          Species
                        </Label>
                        <div className="relative">
                          <Input
                            id="species"
                            {...register("species")}
                            placeholder="e.g. sanctum"
                            className="bg-background pr-10"
                          />
                          {watch("species") && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="plant_type"
                          className="text-sm font-medium"
                        >
                          Plant Type
                        </Label>
                        <div className="relative">
                          <Input
                            id="plant_type"
                            {...register("plant_type")}
                            placeholder="e.g. Herb, Shrub, Tree"
                            className="bg-background pr-10"
                          />
                          {watch("plant_type") && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-200">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Tags</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-primary"
                          onClick={() => setIsTagModalOpen(true)}
                        >
                          <Plus className="mr-2 h-3 w-3" />
                          New Tag
                        </Button>
                      </div>
                      <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                              {field.value.length === 0 && (
                                <span className="text-sm text-muted-foreground self-center px-1">
                                  No tags selected
                                </span>
                              )}
                              {field.value.map((tagId) => {
                                const foundTag = tags.find(
                                  (t) => t.$id === tagId
                                );
                                return (
                                  <Badge
                                    key={tagId}
                                    variant="secondary"
                                    className="gap-1 pr-0.5 bg-background/50"
                                  >
                                    {foundTag ? foundTag.name : tagId}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newTags = field.value.filter(
                                          (t) => t !== tagId
                                        );
                                        field.onChange(newTags);
                                      }}
                                      className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                );
                              })}
                            </div>
                            <Combobox
                              options={tags.map((t) => ({
                                label: t.name,
                                value: t.$id,
                              }))}
                              value=""
                              onChange={(val) => {
                                if (val && !field.value.includes(val)) {
                                  field.onChange([...field.value, val]);
                                }
                              }}
                              placeholder="Select or create tags..."
                              onCreate={async (name) => {
                                if (!name) return;
                                try {
                                  const newTag = await plantService.createTag({
                                    name,
                                    type: "general",
                                  });
                                  toast.success(`Tag "${name}" created`);
                                  await fetchTags(); // Refresh list to get new tag in options

                                  if (!field.value.includes(newTag.$id)) {
                                    field.onChange([
                                      ...field.value,
                                      newTag.$id,
                                    ]);
                                  }
                                } catch (e) {
                                  console.error(e);
                                  toast.error("Failed to create tag");
                                }
                              }}
                              createLabel={`Create tag "%s"`}
                            />
                            <p className="text-xs text-muted-foreground">
                              Select existing tags or type to create new ones
                              (e.g., "Indoor", "Pet Safe").
                            </p>
                          </div>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        Short Description
                        {watch("short_description") && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
                        )}
                      </Label>
                      <div className="min-h-[150px]">
                        <Controller
                          name="short_description"
                          control={control}
                          render={({ field }) => (
                            <Textarea
                              className="min-h-[150px] bg-background"
                              {...field}
                              placeholder="Write a brief botanical summary..."
                            />
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: TAXONOMY */}
              <TabsContent
                value="taxonomy"
                className="w-full space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="h-full border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Where is it from?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Origin Profile</Label>
                        <Controller
                          name="origin"
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              options={origins}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select Origin"
                              emptyText="No origin found."
                              onCreate={() => navigate("/admin/origins")}
                              createLabel="Create New Origin"
                            />
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          Select the geographical origin or create a new one.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="h-full border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Where does it grow?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Habitat Profile</Label>
                        <Controller
                          name="habitat"
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              options={habitats}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select Habitat"
                              emptyText="No habitat found."
                              onCreate={() => navigate("/admin/habitats")}
                              createLabel="Create New Habitat"
                            />
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          Select the ecological habitat details.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-base font-semibold">
                      Morphology & Habit
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plant_type">Plant Type / Habit</Label>
                        <Input
                          id="plant_type"
                          {...register("plant_type")}
                          placeholder="e.g. Perennial Herb, Shrub, Tree"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: CHEMISTRY */}
              <TabsContent
                value="chemistry"
                className="w-full animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FlaskConical className="h-6 w-6 text-primary" />
                      Chemical Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1 space-y-4 w-full">
                        <Label className="text-base">
                          Select Active Chemical Profile
                        </Label>
                        <Controller
                          name="chemical_profile"
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              options={chemicalProfiles}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Search chemical profiles..."
                              emptyText="No profiles found."
                              onCreate={() =>
                                navigate("/admin/chemical-profiles")
                              }
                              createLabel="Create New Profile"
                              className="w-full"
                            />
                          )}
                        />
                        <p className="text-sm text-muted-foreground">
                          Link a chemical analysis profile containing major
                          constituents and secondary metabolites.
                        </p>
                      </div>
                      <div className="w-full md:w-64 p-4 rounded-lg bg-primary/5 border border-primary/10 text-sm">
                        <h4 className="font-semibold mb-2 text-primary">
                          Need a new profile?
                        </h4>
                        <p className="text-muted-foreground mb-3">
                          Create comprehensive chemical data including
                          constituents and structures.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => navigate("/admin/chemical-profiles")}
                        >
                          Go to Manager
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: MEDICINAL */}
              <TabsContent
                value="medicinal"
                className="w-full animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Stethoscope className="h-6 w-6 text-primary" />
                      Medicinal & Ayurvedic Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1 space-y-4 w-full">
                        <Label className="text-base">
                          Select Medicinal Profile
                        </Label>
                        <Controller
                          name="medicinal_profile"
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              options={medicinalProfiles}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Search medicinal profiles..."
                              emptyText="No profiles found."
                              onCreate={() =>
                                navigate("/admin/medicinal-profiles")
                              }
                              createLabel="Create New Profile"
                              className="w-full"
                            />
                          )}
                        />
                        <p className="text-sm text-muted-foreground">
                          Link therapeutic uses, actions, and traditional
                          ayurvedic properties.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-start border-t border-white/10 pt-6">
                      <div className="flex-1 space-y-4 w-full">
                        <Label className="text-base">
                          Select Ayurvedic Property
                        </Label>
                        <Controller
                          name="ayurveda"
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              options={ayurvedicProfiles}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Search ayurvedic properties..."
                              emptyText="No properties found."
                              onCreate={() =>
                                navigate("/admin/ayurvedic-properties")
                              }
                              createLabel="Create New Property"
                              className="w-full"
                            />
                          )}
                        />
                        <p className="text-sm text-muted-foreground">
                          Link Rasa, Guna, Virya, Vipaka, and Dosha details.
                        </p>
                      </div>

                      <div className="w-full md:w-64 p-4 rounded-lg bg-primary/5 border border-primary/10 text-sm">
                        <h4 className="font-semibold mb-2 text-primary">
                          Ayurvedic Data
                        </h4>
                        <p className="text-muted-foreground mb-3">
                          Manage traditional properties separately.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            navigate("/admin/ayurvedic-properties")
                          }
                        >
                          Go to Manager
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: PARTS */}
              <TabsContent
                value="parts"
                className="w-full animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <PlantPartsManager />
              </TabsContent>

              {/* TAB: CULTIVATION */}
              <TabsContent
                value="cultivation"
                className="w-full animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sprout className="h-6 w-6 text-primary" />
                      Cultivation & Propagation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1 space-y-4 w-full">
                        <Label className="text-base">
                          Select Cultivation Profile
                        </Label>
                        <Controller
                          name="cultivation_profile"
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              options={cultivationProfiles}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Search cultivation data..."
                              emptyText="No profiles found."
                              onCreate={() =>
                                navigate("/admin/cultivation-data")
                              }
                              createLabel="Create New Profile"
                              className="w-full"
                            />
                          )}
                        />
                        <p className="text-sm text-muted-foreground">
                          Link propagation methods, soil requirements, and
                          hardiness zones.
                        </p>
                      </div>
                      <div className="w-full md:w-64 p-4 rounded-lg bg-primary/5 border border-primary/10 text-sm">
                        <h4 className="font-semibold mb-2 text-primary">
                          Need a new profile?
                        </h4>
                        <p className="text-muted-foreground mb-3">
                          Add growth requirements and propagation guides.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => navigate("/admin/cultivation-data")}
                        >
                          Go to Manager
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: MEDIA */}
              <TabsContent
                value="media"
                className="w-full animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <ImageIcon className="h-6 w-6 text-primary" />
                      Media & Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <PlantImageManager />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        <div className="p-4 bg-muted/5">
          {" "}
          {/* Footer spacer if needed, or keeping structure */}{" "}
        </div>
      </div>
      {/* Family Dialog */}
      <Dialog open={isFamilyModalOpen} onOpenChange={setIsFamilyModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Family</DialogTitle>
            <DialogDescription>
              Add a new botanical family to the records.
            </DialogDescription>
          </DialogHeader>
          <FamilyForm
            initialName={tempFamilyName}
            onSuccess={async (newFamily) => {
              setIsFamilyModalOpen(false);
              await fetchFamilies();
              if (newFamily && newFamily.$id) {
                formMethods.setValue("family", newFamily.$id);
              }
            }}
            onCancel={() => setIsFamilyModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      {/* Tag Dialog */}
      <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>
              Add a new tag to the system. You can specify a type and
              description.
            </DialogDescription>
          </DialogHeader>
          <TagForm
            onSuccess={(newTag) => {
              setIsTagModalOpen(false);
              fetchTags(); // Refresh the list
              // Add to current selection
              const currentTags = formMethods.getValues("tags") || [];
              if (!currentTags.includes(newTag.name)) {
                formMethods.setValue("tags", [...currentTags, newTag.name]);
              }
            }}
            onCancel={() => setIsTagModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};

export default AddPlant;
