import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import plantsData from "@/data/plants.json";

const PlantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    // Find plant by ID
    const foundPlant = plantsData.find((p) => p.id === id);
    if (!foundPlant) {
      // If plant not found, redirect to 404 with message
      navigate("/404", {
        state: {
          message:
            "The plant you are looking for does not exist in our garden.",
        },
      });
      return;
    }
    setPlant(foundPlant);
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (!plant) return null;

  return (
    <DashboardLayout breadcrumbs={[{ label: plant.commonName }]}>
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[60vh] overflow-hidden rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 w-full h-full" />
        <img
          src={plant.images.cover}
          alt={plant.commonName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 lg:p-16">
          <div className="flex flex-wrap gap-2 mb-4">
            {plant.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                className="bg-primary/90 hover:bg-primary text-white border-0 px-3 py-1 text-sm shadow-sm backdrop-blur-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white drop-shadow-lg mb-2">
            {plant.commonName}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light italic mb-6">
            {plant.scientificName}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="rounded-xl font-bold shadow-lg bg-green-600 hover:bg-green-700 text-white border-none"
            >
              <span className="material-symbols-outlined mr-2 text-[20px]">
                favorite
              </span>
              Save Plant
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl font-bold bg-white/10 text-white border-white/50 hover:bg-white/20 hover:border-white hover:text-white backdrop-blur-md"
            >
              <span className="material-symbols-outlined mr-2 text-[20px]">
                share
              </span>
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-16 min-w-0">
            {/* Overview Section */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <h2 className="text-2xl font-serif font-bold mb-4">
                  Introduction
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {plant.introduction.description}
                </p>
                <p className="mt-4 text-secondary-foreground italic border-l-4 border-green-500 pl-4 py-1 bg-green-50 dark:bg-green-900/10">
                  {plant.overview}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-secondary/20 border-border">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">
                      biotech
                    </span>
                    Key Bioactives
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-1">
                    {plant.introduction.keyBioactives.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-6 bg-secondary/20 border-border">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">
                      settings
                    </span>
                    Mechanisms
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-1">
                    {plant.introduction.mechanisms.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              </div>

              <section>
                <h3 className="text-xl font-bold mb-3">
                  Chemical Constituents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(plant.chemicalConstituents).map(
                    ([key, value]) => {
                      if (key === "distributionSummary") return null;
                      return (
                        <div
                          key={key}
                          className="p-4 rounded-xl border border-border"
                        >
                          <h4 className="capitalize font-semibold text-sm mb-2 text-muted-foreground">
                            {key}
                          </h4>
                          <p className="font-medium text-foreground text-sm">
                            {Array.isArray(value) ? value.join(", ") : value}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
                {plant.chemicalConstituents.distributionSummary && (
                  <p className="mt-4 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    <span className="font-bold">Summary:</span>{" "}
                    {plant.chemicalConstituents.distributionSummary}
                  </p>
                )}
              </section>
            </div>

            <Separator />

            {/* Cultivation Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-green-800 dark:text-green-200">
                Cultivation & Habitat
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">
                      landscape
                    </span>
                    Habitat
                  </h3>
                  <dl className="space-y-4">
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <dt className="text-sm font-semibold text-muted-foreground">
                        Native Range
                      </dt>
                      <dd className="text-foreground font-medium text-right">
                        {plant.habitat.nativeRange}
                      </dd>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <dt className="text-sm font-semibold text-muted-foreground">
                        Climate
                      </dt>
                      <dd className="text-foreground font-medium text-right">
                        {plant.habitat.climate}
                      </dd>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <dt className="text-sm font-semibold text-muted-foreground">
                        Altitude
                      </dt>
                      <dd className="text-foreground font-medium text-right">
                        {plant.habitat.altitude}
                      </dd>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <dt className="text-sm font-semibold text-muted-foreground">
                        Ecology
                      </dt>
                      <dd className="text-foreground font-medium text-right">
                        {plant.habitat.ecology}
                      </dd>
                    </div>
                  </dl>
                </section>
                <section>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">
                      potted_plant
                    </span>
                    Cultivation Details
                  </h3>
                  <dl className="space-y-4">
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <dt className="text-sm font-semibold text-muted-foreground">
                        Soil
                      </dt>
                      <dd className="text-foreground font-medium text-right max-w-[60%]">
                        {plant.cultivation.soil}
                      </dd>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <dt className="text-sm font-semibold text-muted-foreground">
                        Season
                      </dt>
                      <dd className="text-foreground font-medium text-right">
                        {plant.cultivation.season}
                      </dd>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <dt className="text-sm font-semibold text-muted-foreground">
                        Crop Duration
                      </dt>
                      <dd className="text-foreground font-medium text-right">
                        {plant.cultivation.cropDuration}
                      </dd>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <dt className="text-sm font-bold text-foreground mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">
                          agriculture
                        </span>
                        Planting Info
                      </dt>
                      <dd className="text-sm text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Propagation:</span>
                          <span className="font-medium text-foreground">
                            {plant.cultivation.planting.propagation}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spacing:</span>
                          <span className="font-medium text-foreground">
                            {plant.cultivation.planting.spacing}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seed Rate:</span>
                          <span className="font-medium text-foreground">
                            {plant.cultivation.planting.seedRate}
                          </span>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
              <section>
                <h3 className="text-xl font-bold mb-4">Varieties</h3>
                <div className="flex flex-wrap gap-4">
                  {plant.cultivation.varieties.map((variety) => (
                    <Badge
                      key={variety}
                      variant="outline"
                      className="text-base px-4 py-1 border-primary/30 bg-primary/5 hover:bg-primary/10"
                    >
                      {variety}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>

            <Separator />

            {/* Medicinal Uses Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-green-800 dark:text-green-200">
                Medical Uses & Properties
              </h2>
              <section>
                <h3 className="text-xl font-bold mb-4">Parts Used</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plant.partsUsed.map((part, idx) => (
                    <Card
                      key={idx}
                      className="p-4 flex items-start gap-4 border-border shadow-sm"
                    >
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                        <span className="material-symbols-outlined">eco</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{part.part}</h4>
                        <p className="text-muted-foreground text-sm">
                          {part.uses}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h3 className="text-xl font-bold mb-4">Medicinal Uses</h3>
                  <ul className="space-y-3">
                    {plant.medicinalUses.map((use, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-foreground/80 p-3 bg-secondary/20 rounded-lg"
                      >
                        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="text-xl font-bold mb-4">
                    Therapeutic Properties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {plant.medicinalProperties.map((prop, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80"
                      >
                        {prop}
                      </Badge>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <Separator />

            {/* Gallery Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-green-800 dark:text-green-200">
                Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plant.images.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-border"
                  >
                    <img
                      src={img}
                      alt={`${plant.commonName} gallery ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
                <div className="aspect-square rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-zinc-900 border border-border flex items-center justify-center relative group p-4">
                  <img
                    src={plant.images.illustration}
                    alt="Illustration"
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-screen opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-end flex-col pb-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent">
                    <Badge className="bg-white text-black hover:bg-white/90">
                      Botanical Illustration
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / quick info */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <h3 className="font-serif font-bold text-xl mb-4 text-green-900 dark:text-green-100">
                  Quick Facts
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-600 mt-0.5">
                      public
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-0.5">
                        Native Range
                      </p>
                      <p className="font-medium text-sm leading-tight">
                        {plant.habitat.nativeRange}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-600 mt-0.5">
                      science
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-0.5">
                        Key Bioactives
                      </p>
                      <p className="font-medium text-sm leading-tight">
                        {plant.introduction.keyBioactives
                          .slice(0, 3)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    menu_book
                  </span>
                  Scientific References
                </h3>
                <ul className="text-xs text-muted-foreground space-y-3 list-disc list-inside">
                  {plant.references.slice(0, 3).map((ref, idx) => (
                    <li key={idx} className="line-clamp-2 leading-relaxed">
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Related Plants */}
        <div className="pb-12">
          <h2 className="text-2xl font-serif font-bold mb-8">
            Explore More Plants
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {plantsData
              .filter((p) => p.id !== plant.id)
              .sort(() => 0.5 - Math.random()) // Simple shuffle
              .slice(0, 4)
              .map((relatedPlant) => (
                <Link
                  key={relatedPlant.id}
                  to={`/plant/${relatedPlant.id}`}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-none bg-transparent">
                    <div className="aspect-[4/5] rounded-xl overflow-hidden mb-3 shadow-md relative">
                      <img
                        src={relatedPlant.images.thumbnail}
                        alt={relatedPlant.commonName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {relatedPlant.commonName}
                    </h3>
                    <p className="text-sm text-muted-foreground italic font-serif">
                      {relatedPlant.scientificName}
                    </p>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlantDetailsPage;
