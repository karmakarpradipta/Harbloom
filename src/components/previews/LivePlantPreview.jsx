import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, MapPin, Thermometer, Info, Leaf } from "lucide-react";
import RichTextDisplay from "@/components/common/RichTextDisplay";

const LivePlantPreview = ({
  families = [],
  habitats = [],
  origins = [],
  parts = [],
  tags = [],
}) => {
  const { watch } = useFormContext();
  const formData = watch();

  // Helper to lookup labels
  const getLabel = (options, value) => {
    if (!value) return "Not specified";
    const found = options.find((opt) => opt.value === value);
    return found ? found.label : "Unknown ID";
  };

  const getTagName = (tagId) => {
    // Tags in AddPlant are raw documents or options?
    // Assuming raw documents based on fetchTags, or options based on other patterns.
    // Let's handle both: if tag has .name use it, if tag has .label use it.
    // Use safe find.
    const found = tags.find((t) => t.$id === tagId || t.value === tagId);
    return found ? found.name || found.label : "Tag";
  };

  // Helper to safely get values
  const commonName = formData.common_names_input
    ? formData.common_names_input.split(",")[0]
    : formData.scientific_name || "New Plant";

  const coverImage =
    formData.images && formData.images.length > 0
      ? formData.images[0].url
      : "https://placehold.co/600x400?text=No+Image";

  const gallery = formData.images || [];
  const commonNames = formData.common_names_input
    ? formData.common_names_input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" /> Preview
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] md:w-[700px] overflow-hidden flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" /> Live Preview
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 h-full">
          <div className="pb-10">
            {/* Hero Section */}
            <div className="relative w-full h-64 md:h-80 overflow-hidden group bg-muted">
              <img
                src={coverImage}
                alt={commonName}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <Badge className="bg-primary/80 backdrop-blur-sm hover:bg-primary">
                    {formData.plant_type || "Type Unspecified"}
                  </Badge>
                  {commonNames.map((name, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="backdrop-blur-sm"
                    >
                      {name}
                    </Badge>
                  ))}
                  {(formData.tags || []).map((tagId, i) => (
                    <Badge
                      key={`tag-${i}`}
                      variant="outline"
                      className="bg-background/20 backdrop-blur-sm border-white/30 text-white"
                    >
                      #{getTagName(tagId)}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl font-serif font-bold text-foreground drop-shadow-sm line-clamp-2">
                  {commonName}
                </h1>
                <p className="text-xl text-muted-foreground italic font-serif">
                  {formData.scientific_name}
                </p>
              </div>
            </div>

            <div className="px-6 py-6 space-y-8">
              {/* Quick Facts / Characteristics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-card border shadow-sm space-y-1">
                  <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    Origin
                  </div>
                  <p
                    className="font-semibold text-sm truncate"
                    title={getLabel(origins, formData.origin)}
                  >
                    {getLabel(origins, formData.origin)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-card border shadow-sm space-y-1">
                  <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    Family
                  </div>
                  <p
                    className="font-semibold text-sm truncate"
                    title={getLabel(families, formData.family)}
                  >
                    {getLabel(families, formData.family)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-card border shadow-sm space-y-1">
                  <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    Habitat
                  </div>
                  <p
                    className="font-semibold text-sm truncate"
                    title={getLabel(habitats, formData.habitat)}
                  >
                    {getLabel(habitats, formData.habitat)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-card border shadow-sm space-y-1">
                  <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    Genus
                  </div>
                  <p className="font-semibold text-sm truncate">
                    {formData.genus || "-"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-serif flex items-center gap-2">
                  Introduction
                </h3>
                <RichTextDisplay
                  content={
                    formData.short_description || "No description provided yet."
                  }
                  className="text-muted-foreground leading-relaxed border-l-4 border-primary/50 pl-4 py-1"
                />
              </div>

              {/* Profiles Section (Stubbed for now as we don't have lists yet) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/10">
                  <h4 className="font-bold text-sm text-blue-700 dark:text-blue-300 mb-1">
                    Chemical Profile
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formData.chemical_profile
                      ? "Profile Linked"
                      : "None Selected"}
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-green-50/50 dark:bg-green-900/10">
                  <h4 className="font-bold text-sm text-green-700 dark:text-green-300 mb-1">
                    Medicinal Profile
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formData.medicinal_profile
                      ? "Profile Linked"
                      : "None Selected"}
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-amber-50/50 dark:bg-amber-900/10">
                  <h4 className="font-bold text-sm text-amber-700 dark:text-amber-300 mb-1">
                    Cultivation Profile
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formData.cultivation_profile
                      ? "Profile Linked"
                      : "None Selected"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Gallery Grid */}
              {gallery.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-serif">
                    Gallery ({gallery.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {gallery.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg overflow-hidden border bg-muted relative group"
                      >
                        <img
                          src={img.url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <p className="text-xs text-white truncate w-full">
                            {img.caption || "No caption"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medicinal Parts */}
              {formData.parts_data && formData.parts_data.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-serif">
                    Medicinal Parts
                  </h3>
                  <div className="space-y-3">
                    {formData.parts_data.map((part, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border bg-card/50"
                      >
                        <h4 className="font-bold flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-primary" />
                          {getLabel(parts, part.part_id)}
                        </h4>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {part.usages?.length || 0} usage(s) defined.
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default LivePlantPreview;
