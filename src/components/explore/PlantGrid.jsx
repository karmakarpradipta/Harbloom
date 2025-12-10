import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import plants from "@/data/plants.json";

const PlantGrid = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Explore Collection
        </h2>
        {/* Filter Trigger could go here */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-y-10">
        {plants.map((plant) => (
          <Link key={plant.id} to={`/plant/${plant.id}`} className="group">
            <Card className="h-full border-0 bg-transparent shadow-none hover:bg-transparent overflow-visible">
              <div className="relative aspect-[16/10] md:aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img
                  src={plant.images.thumbnail}
                  alt={plant.commonName}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <Button
                  size="icon"
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 text-red-500 shadow-md translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:scale-110"
                >
                  <span className="material-symbols-outlined text-[1.2rem] fill-current">
                    favorite
                  </span>
                </Button>
              </div>

              <div className="pt-4 px-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {plant.commonName}
                    </h3>
                    <p className="text-sm italic text-muted-foreground font-sans mt-0.5">
                      {plant.scientificName}
                    </p>
                  </div>
                  {/* Rating or compact metric could go here */}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {plant.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-xs font-semibold border border-transparent group-hover:border-border transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlantGrid;
