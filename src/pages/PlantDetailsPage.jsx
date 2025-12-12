import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Share2,
  MapPin,
  Thermometer,
  Mountain,
  Droplets,
  Sprout,
  Leaf,
  FlaskConical,
  Beaker,
  Sun,
  Wind,
  Layers,
  SunMedium,
  CloudRain,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import plantService from "@/services/plantService";

const PlantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePart, setActivePart] = useState(null);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      setIsLoading(true);
      console.log("Fetching details for plant ID:", id); // DEBUG LOG
      try {
        // Parallel Fetch: Plant Doc + Images + Tags Lookup + Part Usage + Parts Lookup
        const [plantRes, imagesRes, tagsRes, partsRes, allPartsRes] = await Promise.all([
             plantService.getPlant(id),
             plantService.getPlantImages(id),
             plantService.getTags(),
             plantService.getPlantPartUsage(id),
             plantService.getPlantParts(),
        ]);
        
        console.log("Fetched plant doc:", plantRes); // DEBUG LOG
        
        if (!plantRes) {
          console.warn("Plant doc not found or error in fetch");
          setIsLoading(false);
          return;
        }

        if (plantRes) {
          const images = imagesRes?.documents || [];
          // Helper to get image URL safely
          const getImgUrl = (img) => img.url || "";
          
          const imageUrls = images.map(getImgUrl).filter(Boolean);
          const coverImage = imageUrls[0] || "https://images.unsplash.com/photo-1546237769-1f487e413000?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.0.3";

          // Process Tags (Name Resolution)
          const rawTags = plantRes.tags || [];
          const tagsList = tagsRes?.documents || [];
          const localTagsMap = tagsList.reduce((acc, tag) => {
            acc[tag.$id] = tag.name;
            return acc;
          }, {});

          const visibleTags = rawTags.map(t => {
            let tagId = t;
            if (typeof t === 'object' && t.name) return t.name;
            if (typeof t === 'object' && t.$id) tagId = t.$id;

            if (localTagsMap[tagId]) return localTagsMap[tagId];
            
            if (typeof tagId === 'string') {
                if (tagId.length >= 18 && /^[a-zA-Z0-9]+$/.test(tagId)) return null;
                return tagId;
            }
            return null;
          }).filter(Boolean);

          // Fetch Linked Profiles if IDs exist
          let ayurvedicDoc = null;
          let medicinalDoc = null;
          
          const profilePromises = [];
          if (plantRes.ayurvedicProperties && typeof plantRes.ayurvedicProperties === 'string') {
              profilePromises.push(plantService.getAyurvedicProperties(plantRes.ayurvedicProperties).then(res => ayurvedicDoc = res));
          } else if (plantRes.ayurvedicProperties && typeof plantRes.ayurvedicProperties === 'object') {
              ayurvedicDoc = plantRes.ayurvedicProperties;
          }

          if (plantRes.medicinalProfiles && typeof plantRes.medicinalProfiles === 'string') {
              profilePromises.push(plantService.getMedicinalProfile(plantRes.medicinalProfiles).then(res => medicinalDoc = res));
          } else if (plantRes.medicinalProfiles && typeof plantRes.medicinalProfiles === 'object') {
              medicinalDoc = plantRes.medicinalProfiles;
          }

          let habitatDoc = null;
          if (plantRes.habitat && typeof plantRes.habitat === 'string') {
              profilePromises.push(plantService.getHabitat(plantRes.habitat).then(res => habitatDoc = res));
          } else if (plantRes.habitat && typeof plantRes.habitat === 'object') {
              habitatDoc = plantRes.habitat;
          }

          await Promise.all(profilePromises);

          // Create Parts Lookup Map (ID -> Name)
          const partsLookup = {};
          if (allPartsRes && allPartsRes.documents) {
              allPartsRes.documents.forEach(p => {
                  partsLookup[p.$id] = p.name;
              });
          }

          // Process Parts (DEBUG)
          let processedParts = [];
          if (partsRes && partsRes.documents.length > 0) {
            console.log("Images for matching:", images); // DEBUG
            processedParts = partsRes.documents.map(doc => {
              // Get Part ID
              // doc.plantParts might be an object (if expanded) or string (if not)
              let partId = null;
              let partName = "Unknown Part";

              if (doc.plantParts) {
                  if (typeof doc.plantParts === 'object') {
                      partId = doc.plantParts.$id;
                      partName = doc.plantParts.name || partsLookup[partId] || "Unknown Part";
                  } else if (typeof doc.plantParts === 'string') {
                      partId = doc.plantParts;
                      partName = partsLookup[partId] || "Unknown Part";
                  }
              }

              // Match image where shot_part matches the Part ID
              const matchingImage = images.find(img => {
                  const imgPartId = img.shot_part?.$id || img.shot_part;
                  return imgPartId === partId;
              });

              // FIX: Only show matched image or skip if not found
              const partImage = matchingImage?.url || null;
              
              return {
                 id: doc.$id, 
                 part: partName,
                 uses: doc.indication || doc.notes || "Medicinal use.",
                 preparation: doc.preparation_form || "", 
                 image: partImage
              };
            });
          } else {
             // Fallback if no parts usage data found
             processedParts = plantRes.medicinal_uses ? plantRes.medicinal_uses.map(use => ({
                part: "Whole Plant",
                uses: use,
                image: coverImage
            })) : [
                {
                    part: "Leaves",
                    uses: "Traditionally used for various remedies.",
                    image: coverImage
                }
            ];
          }

        // Map Database Fields to UI Structure
        const mappedPlant = {
            id: plantRes.$id,
            commonName: (plantRes.common_names && plantRes.common_names.length > 0) ? plantRes.common_names.join(", ") : plantRes.name,
            scientificName: plantRes.scientific_name || plantRes.species || "Unknown Scientific Name",
            tags: visibleTags,
            overview: plantRes.short_description || plantRes.description || "No overview available.",
            introduction: {
                description: plantRes.full_description || plantRes.botanical_description || plantRes.short_description || "Botanical description not available.",
                keyBioactives: plantRes.chemical_constituents || ["Tannins", "Flavonoids"], // Fallback or fetch from relation
            },
            partsUsed: processedParts,
            habitat: habitatDoc ? {
                nativeRange: plantRes.origin || "Unknown", // Keep origin separate if needed, or map from doc if available
                climate: habitatDoc.climate || "Unknown",
                temperature: (habitatDoc.temperature_min && habitatDoc.temperature_max) ? `${habitatDoc.temperature_min}°C - ${habitatDoc.temperature_max}°C` : "Unknown",
                soil: habitatDoc.soil_type || "Various",
                ph: (habitatDoc.soil_ph_min && habitatDoc.soil_ph_max) ? `${habitatDoc.soil_ph_min.toFixed(1)} - ${habitatDoc.soil_ph_max.toFixed(1)}` : "Unknown",
                light: habitatDoc.light || "Various",
                rainfall: (habitatDoc.rainfall_min && habitatDoc.rainfall_max) ? `${habitatDoc.rainfall_min}mm - ${habitatDoc.rainfall_max}mm` : "Unknown",
                ecology: habitatDoc.typical_habitates || "Various",
            } : {
                nativeRange: plantRes.origin || "Unknown",
                climate: "Tropical / Subtropical", 
                temperature: "15-35°C",
                soil: "Loamy, Well-drained",
                ph: "6.0 - 7.5",
                light: "Full Sun",
                rainfall: "Moderate",
                ecology: "Various",
            },
            images: {
                cover: coverImage,
                gallery: imageUrls.length > 0 ? imageUrls : [coverImage],
            },
            ayurvedic: ayurvedicDoc ? {
                rasa: ayurvedicDoc.rasa || [],
                virya: ayurvedicDoc.virya || "Unknown",
                vipaka: ayurvedicDoc.vipaka || "Unknown",
                dosha: {
                    vata: ayurvedicDoc.dosha_effect_vata,
                    pitta: ayurvedicDoc.dosha_effect_pitta,
                    kapha: ayurvedicDoc.dosha_effect_kapha,
                },
                references: ayurvedicDoc.classical_references || []
            } : null,
            medicinal: medicinalDoc ? {
                actions: medicinalDoc.actions || [],
                systems: medicinalDoc.systems || [],
                uses: {
                    traditional: medicinalDoc.traditional_uses,
                    modern: medicinalDoc.modern_uses
                }
            } : null
        };

        // Attempt to extract richer data if available in nested objects (if expanded)
        if(plantRes.family) {
             // mappedPlant.family = plantRes.family.name;
        }
        
        // Mocking parts if simple string array - merge or override if partsUsed is empty/default
        if(plantRes.parts_used && Array.isArray(plantRes.parts_used) && processedParts.length === 0) {
             mappedPlant.partsUsed = plantRes.parts_used.map(part => ({
                  part: part,
                  uses: `Medicinal uses associated with ${part}.`,
                  image: coverImage
             }));
        }

        setPlant(mappedPlant);
        if (mappedPlant.partsUsed?.length > 0) {
          setActivePart(mappedPlant.partsUsed[0].part);
        }
      }
      } catch (error) {
        console.error("Error fetching plant details:", error);
      } finally {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (id) {
        fetchPlantDetails();
    }
  }, [id, navigate]);

  // Breadcrumb Logic
  const breadcrumbs = useMemo(() => {
    if (!plant) return [];
    return [
      { label: plant.commonName }, 
    ];
  }, [plant]);

  // Helper to generate mock preparation steps if missing
  const getPreparationSteps = (part) => {
    const defaultSteps = [
      {
        title: "Harvest",
        desc: `Collect fresh ${part.toLowerCase()} early in the morning.`,
      },
      {
        title: "Clean",
        desc: "Wash thoroughly with clean water to remove dirt/impurities.",
      },
      {
        title: "Process",
        desc: "Crush or dry depending on the desired usage.",
      },
      {
        title: "Consume",
        desc: "Use as tea, paste, or powder as recommended.",
      },
    ];
    return defaultSteps;
  };

  if (isLoading) {
    return (
      <DashboardLayout breadcrumbs={[{ label: "Loading..." }]}>
        <div className="w-full h-[50vh] relative">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
            <div className="flex items-center justify-center h-40">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!plant) {
      return (
        <DashboardLayout breadcrumbs={[{ label: "Error" }]}>
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">Plant details could not be loaded.</h2>
                <p className="text-muted-foreground mb-8">Please try again later or verify the URL.</p>
                <Button onClick={() => navigate("/home")}>Go Back Home</Button>
                <div className="mt-8 p-4 bg-muted max-w-lg mx-auto rounded text-left font-mono text-xs">
                    Debug ID: {id}
                </div>
            </div>
        </DashboardLayout>
      );
  }

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] min-h-[400px] overflow-hidden group rounded-3xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        <img
          src={plant.images.cover}
          alt={plant.commonName}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 lg:p-20 container mx-auto">
          <div className="max-w-4xl space-y-4 md:space-y-6">
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-4 delay-100 duration-700">
              {plant.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-full px-4 py-1 text-sm font-medium bg-secondary/80 hover:bg-secondary text-secondary-foreground backdrop-blur-md border-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground drop-shadow-sm tracking-tight animate-in slide-in-from-bottom-6 delay-200 duration-700">
              {plant.commonName}
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground font-light italic font-serif animate-in slide-in-from-bottom-8 delay-300 duration-700">
              {plant.scientificName}
            </p>
            <div className="flex flex-wrap gap-4 pt-4 animate-in slide-in-from-bottom-10 delay-400 duration-700">
              <Button
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105"
              >
                Save to Garden
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full bg-background/50 border-input hover:bg-accent hover:text-accent-foreground backdrop-blur-sm transition-all"
              >
                <Share2 className="mr-2 h-5 w-5" /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl animate-in fade-in duration-700 delay-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Quick Nav Sidebar (Desktop Sticky) */}
          <div className="hidden lg:block lg:col-span-3 space-y-8">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-none bg-transparent">
                <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4 pl-2">
                  On This Page
                </h3>
                <nav className="flex flex-col space-y-1 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
                  <a
                    href="#overview"
                    className="pl-4 py-2 border-l-2 border-transparent hover:border-primary text-muted-foreground hover:text-primary transition-all text-sm font-medium"
                  >
                    Overview
                  </a>
                  <a
                    href="#properties"
                    className="pl-4 py-2 border-l-2 border-transparent hover:border-primary text-muted-foreground hover:text-primary transition-all text-sm font-medium"
                  >
                    Properties
                  </a>
                  <a
                    href="#parts"
                    className="pl-4 py-2 border-l-2 border-transparent hover:border-primary text-muted-foreground hover:text-primary transition-all text-sm font-medium"
                  >
                    Medicinal Parts
                  </a>
                  <a
                    href="#habitat"
                    className="pl-4 py-2 border-l-2 border-transparent hover:border-primary text-muted-foreground hover:text-primary transition-all text-sm font-medium"
                  >
                    Habitat
                  </a>
                  <a
                    href="#gallery"
                    className="pl-4 py-2 border-l-2 border-transparent hover:border-primary text-muted-foreground hover:text-primary transition-all text-sm font-medium"
                  >
                    Gallery
                  </a>
                </nav>
              </Card>

              <Card className="p-6 bg-secondary/30 border-none rounded-2xl">
                <h4 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Quick Facts
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs text-muted-foreground font-bold uppercase">
                        Native Range
                      </span>
                      <span className="font-medium">
                        {plant.habitat.nativeRange}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sun className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs text-muted-foreground font-bold uppercase">
                        Light Req.
                      </span>
                      <span className="font-medium">
                        {plant.habitat.light}
                      </span>
                    </div>
                  </div>
                   <div className="flex items-start gap-3">
                    <Droplets className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs text-muted-foreground font-bold uppercase">
                        Rainfall
                      </span>
                      <span className="font-medium">
                        {plant.habitat.rainfall}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-9 space-y-16">
            {/* Overview */}
            <section id="overview" className="scroll-mt-28 space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-serif font-bold mb-4 text-foreground">
                  Introduction
                </h2>
                <p className="text-xl leading-relaxed text-muted-foreground border-l-4 border-primary pl-6 py-2 bg-gradient-to-r from-secondary/50 to-transparent rounded-r-xl">
                  {plant.overview}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 w-fit rounded-xl mb-4 text-green-700 dark:text-green-300">
                      <Sprout className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      Botanical Description
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {plant.introduction.description}
                    </p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 w-fit rounded-xl mb-4 text-blue-700 dark:text-blue-300">
                      <Beaker className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Key Bioactives</h3>
                    <div className="flex flex-wrap gap-2">
                      {plant.introduction.keyBioactives.map((bio) => (
                        <Badge
                          key={bio}
                          variant="secondary"
                          className="rounded-full px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900 hover:bg-blue-100"
                        >
                          {bio}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Ayurvedic & Medicinal Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 scroll-mt-28" id="properties">
                {/* Ayurvedic Profile - Themed */}
                {plant.ayurvedic && (
                <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="p-6 md:p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                                <Leaf className="h-5 w-5" />
                            </div>
                            <h3 className="font-serif font-bold text-2xl text-foreground">Ayurvedic Profile</h3>
                        </div>

                        {/* Core Triad */}
                        <div className="grid grid-cols-3 divide-x divide-border py-4 bg-secondary/30 rounded-2xl border border-border/50">
                            <div className="px-4 text-center space-y-1">
                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Rasa</span>
                                <div className="text-sm font-medium text-foreground break-words">
                                    {plant.ayurvedic.rasa.join(", ")}
                                </div>
                            </div>
                            <div className="px-4 text-center space-y-1">
                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Virya</span>
                                <div className="text-sm font-medium text-foreground">
                                    {plant.ayurvedic.virya}
                                </div>
                            </div>
                            <div className="px-4 text-center space-y-1">
                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Vipaka</span>
                                <div className="text-sm font-medium text-foreground">
                                    {plant.ayurvedic.vipaka}
                                </div>
                            </div>
                        </div>

                        {/* Dosha Balance */}
                        <div>
                            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3 block">Dosha Impact</span>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm group/item">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <span className="w-2 h-2 rounded-full bg-foreground/20" /> Vata
                                    </div>
                                    <span className="font-medium text-foreground">{plant.ayurvedic.dosha.vata || "Neutral"}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm group/item">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <span className="w-2 h-2 rounded-full bg-foreground/20" /> Pitta
                                    </div>
                                    <span className="font-medium text-foreground">{plant.ayurvedic.dosha.pitta || "Neutral"}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm group/item">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <span className="w-2 h-2 rounded-full bg-foreground/20" /> Kapha
                                    </div>
                                    <span className="font-medium text-foreground">{plant.ayurvedic.dosha.kapha || "Neutral"}</span>
                                </div>
                            </div>
                        </div>

                        {/* References */}
                        {plant.ayurvedic.references && plant.ayurvedic.references.length > 0 && (
                             <div className="pt-4 border-t border-border">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Classical Texts</p>
                                <p className="text-xs text-muted-foreground italic font-serif">
                                    "{plant.ayurvedic.references.join(", ")}"
                                </p>
                             </div>
                        )}
                    </div>
                </Card>
                )}

                {/* Medicinal Profile - Themed */}
                {plant.medicinal && (
                <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="p-6 md:p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                                <FlaskConical className="h-5 w-5" />
                             </div>
                            <h3 className="font-serif font-bold text-2xl text-foreground">Medicinal Profile</h3>
                        </div>

                         {/* Actions & Systems Tags */}
                        <div className="space-y-4">
                             <div>
                                 <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-2">Therapeutic Actions</span>
                                 <div className="flex flex-wrap gap-2">
                                     {plant.medicinal.actions.slice(0, 8).map(a => (
                                         <Badge key={a} variant="secondary" className="bg-secondary/50 hover:bg-secondary text-secondary-foreground border-transparent font-normal">
                                             {a}
                                         </Badge>
                                     ))}
                                 </div>
                            </div>
                             <div>
                                 <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-2">Target Systems</span>
                                 <div className="flex flex-wrap gap-2">
                                     {plant.medicinal.systems.map(s => (
                                          <span key={s} className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                                            {s}
                                          </span>
                                     ))}
                                 </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 gap-4">
                             <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                                 <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Traditional Uses</span>
                                 <p className="text-sm text-foreground/80 leading-relaxed">
                                    {plant.medicinal.uses.traditional}
                                 </p>
                             </div>
                             <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                                 <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Modern Applications</span>
                                 <p className="text-sm text-foreground/80 leading-relaxed">
                                    {plant.medicinal.uses.modern}
                                 </p>
                             </div>
                        </div>
                    </div>
                </Card>
                )}
            </div>
            
            <Separator /> 

            {/* Medicinal Parts Tabs */}
            <section id="parts" className="scroll-mt-28">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-serif font-bold mb-2">
                    Medicinal Parts
                  </h2>
                  <p className="text-muted-foreground">
                    Select a part to view usage and preparation.
                  </p>
                </div>
              </div>

              {plant.partsUsed.length > 0 ? (
              <Tabs
                defaultValue={plant.partsUsed[0]?.id || plant.partsUsed[0]?.part} // Use ID if available
                onValueChange={(val) => {
                     // Find part by ID first, then name
                     const p = plant.partsUsed.find(p => p.id === val) || plant.partsUsed.find(p => p.part === val);
                     if(p) setActivePart(p.part);
                }}
                className="w-full"
              >
                <TabsList className="w-full justify-start h-auto p-1 bg-muted/30 rounded-xl mb-8 overflow-x-auto flex-nowrap scrollbar-hide">
                  {plant.partsUsed.map((part) => (
                    <TabsTrigger
                      key={part.id || part.part} // Use unique ID
                      value={part.id || part.part}
                      className="rounded-lg py-2.5 px-6 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
                    >
                      {part.part}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {plant.partsUsed.map((part, index) => (
                  <TabsContent
                    key={part.id || part.part}
                    value={part.id || part.part}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ring-1 ring-border rounded-3xl p-6 md:p-8 bg-card shadow-sm">
                      {/* Visual - Only render if image exists */}
                      {part.image && (
                      <div className="aspect-square rounded-2xl overflow-hidden shadow-inner bg-secondary/20 relative group">
                        <img
                          src={part.image}
                          alt={part.part}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                      </div>
                      )}

                      {/* Details */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold flex items-center gap-3 mb-2">
                            <Leaf className="h-6 w-6 text-primary" />
                            Benefits & Uses
                          </h3>
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            {part.uses} Distinctive properties make it vital for
                            traditional remedies.
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <FlaskConical className="h-5 w-5 text-primary" />
                            Preparation Steps
                          </h3>
                          <div className="relative border-l-2 border-primary/20 ml-2.5 space-y-6 pb-2">
                            {getPreparationSteps(part.part).map((step, i) => (
                              <div key={i} className="pl-6 relative group">
                                <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full bg-background border-2 border-primary group-hover:scale-125 transition-transform" />
                                <h4 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors">
                                  {step.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {step.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              ) : (
                  <div className="text-muted-foreground italic">No medicinal parts information available.</div>
              )}
            </section>

            <Separator />

            {/* Habitat Grid */}
            <section id="habitat" className="scroll-mt-28">
              <h2 className="text-3xl font-serif font-bold mb-8">
                Habitat & Ecology
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Climate Card */}
                <Card className="p-6 border-0 text-center space-y-3 hover:scale-105 transition-transform cursor-default bg-amber-50 dark:bg-amber-950/20">
                    <Sun className="h-8 w-8 mx-auto text-amber-500" />
                    <div>
                      <h4 className="font-bold text-xs uppercase text-muted-foreground/70 mb-1">
                        Climate
                      </h4>
                      <p className="font-semibold text-sm md:text-base leading-tight">
                        {plant.habitat.climate}
                      </p>
                    </div>
                </Card>

                 {/* Temperature Card */}
                 <Card className="p-6 border-0 text-center space-y-3 hover:scale-105 transition-transform cursor-default bg-red-50 dark:bg-red-950/20">
                    <Thermometer className="h-8 w-8 mx-auto text-red-500" />
                    <div>
                      <h4 className="font-bold text-xs uppercase text-muted-foreground/70 mb-1">
                        Temperature
                      </h4>
                      <p className="font-semibold text-sm md:text-base leading-tight">
                        {plant.habitat.temperature}
                      </p>
                    </div>
                </Card>

                 {/* Soil Card */}
                 <Card className="p-6 border-0 text-center space-y-3 hover:scale-105 transition-transform cursor-default bg-stone-50 dark:bg-stone-950/30">
                    <Layers className="h-8 w-8 mx-auto text-stone-500" />
                    <div>
                      <h4 className="font-bold text-xs uppercase text-muted-foreground/70 mb-1">
                         Soil Type
                      </h4>
                      <p className="font-semibold text-sm md:text-base leading-tight">
                        {plant.habitat.soil}
                      </p>
                       <p className="text-xs text-muted-foreground mt-1">pH: {plant.habitat.ph}</p>
                    </div>
                </Card>

                {/* Light Card */}
                 <Card className="p-6 border-0 text-center space-y-3 hover:scale-105 transition-transform cursor-default bg-yellow-50 dark:bg-yellow-950/20">
                    <SunMedium className="h-8 w-8 mx-auto text-yellow-500" />
                    <div>
                      <h4 className="font-bold text-xs uppercase text-muted-foreground/70 mb-1">
                        Light
                      </h4>
                      <p className="font-semibold text-sm md:text-base leading-tight">
                        {plant.habitat.light}
                      </p>
                    </div>
                </Card>
                
                 {/* Rainfall Card */}
                 <Card className="p-6 border-0 text-center space-y-3 hover:scale-105 transition-transform cursor-default bg-blue-50 dark:bg-blue-950/20">
                    <CloudRain className="h-8 w-8 mx-auto text-blue-500" />
                    <div>
                      <h4 className="font-bold text-xs uppercase text-muted-foreground/70 mb-1">
                        Annual Rainfall
                      </h4>
                      <p className="font-semibold text-sm md:text-base leading-tight">
                        {plant.habitat.rainfall}
                      </p>
                    </div>
                </Card>

                 {/* Ecology Card */}
                 <Card className="p-6 border-0 text-center space-y-3 hover:scale-105 transition-transform cursor-default bg-emerald-50 dark:bg-emerald-950/20 col-span-2 md:col-span-1 lg:col-span-2">
                    <Wind className="h-8 w-8 mx-auto text-emerald-500" />
                    <div>
                      <h4 className="font-bold text-xs uppercase text-muted-foreground/70 mb-1">
                        Typical Habitats
                      </h4>
                      <p className="font-semibold text-sm md:text-base leading-tight">
                        {plant.habitat.ecology}
                      </p>
                    </div>
                </Card>
              </div>
            </section>

            {/* Gallery Carousel */}
            <section id="gallery" className="scroll-mt-28">
              <h2 className="text-3xl font-serif font-bold mb-8">
                Visual Gallery
              </h2>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {plant.images.gallery.map((img, i) => (
                  <div
                    key={i}
                    className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group relative"
                  >
                    <img
                      src={img}
                      alt="Gallery"
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlantDetailsPage;
