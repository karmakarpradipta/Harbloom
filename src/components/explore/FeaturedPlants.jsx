import React from "react";
import { Link } from "react-router-dom";

import plants from "@/data/plants.json";

const FeaturedPlants = () => {
  const featured = plants.slice(0, 5);
  const bgColors = [
    "bg-green-100 dark:bg-green-900/20",
    "bg-amber-100 dark:bg-amber-900/20",
    "bg-teal-100 dark:bg-teal-900/20",
    "bg-emerald-100 dark:bg-emerald-900/20",
    "bg-orange-100 dark:bg-orange-900/20",
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Featured Plants
        </h2>
        <Link
          to="/plants"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          View All{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((plant, index) => (
          <Link
            key={plant.id}
            to={`/plant/${plant.id}`}
            className="block group h-full"
            draggable={false}
          >
            <div
              className={`relative w-full rounded-3xl p-6 ${
                bgColors[index % bgColors.length]
              } border border-border/10 hover:border-border/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full overflow-hidden select-none`}
            >
              {/* Decorative circle */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 dark:bg-white/5 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150"></div>

              <div className="flex items-start gap-5 relative z-10">
                <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
                  <img
                    src={plant.images.thumbnail}
                    alt={plant.commonName}
                    className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                </div>
                <div className="flex flex-col gap-2 pt-1 whitespace-normal">
                  <h3 className="font-serif font-bold text-xl text-foreground leading-tight group-hover:text-primary transition-colors">
                    {plant.commonName}
                  </h3>
                  <p className="text-sm text-foreground/70 dark:text-foreground/80 font-medium line-clamp-3 leading-relaxed">
                    {plant.overview}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPlants;
