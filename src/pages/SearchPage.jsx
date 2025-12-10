import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import plantsData from "@/data/plants.json";
import { Badge } from "@/components/ui/badge";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const filteredPlants = useMemo(() => {
    if (!query) return plantsData;
    const lowerQuery = query.toLowerCase();
    return plantsData.filter(
      (plant) =>
        plant.commonName.toLowerCase().includes(lowerQuery) ||
        plant.scientificName.toLowerCase().includes(lowerQuery) ||
        plant.overview.toLowerCase().includes(lowerQuery) ||
        plant.medicinalUses.some((use) =>
          use.toLowerCase().includes(lowerQuery)
        )
    );
  }, [query]);

  return (
    <DashboardLayout showSidebar={false}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">
            {query ? `Search Results for "${query}"` : "All Plants"}
          </h1>
          <p className="text-muted-foreground">
            {filteredPlants.length} plant{filteredPlants.length !== 1 && "s"}{" "}
            found
          </p>
        </div>

        {filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => (
              <Link
                key={plant.id}
                to={`/plant/${plant.id}`}
                className="group block h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={plant.images.thumbnail}
                    alt={plant.commonName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
                      {plant.cultivation.season}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold font-serif mb-1 group-hover:text-green-600 transition-colors">
                    {plant.commonName}
                  </h3>
                  <p className="text-sm text-muted-foreground italic mb-3">
                    {plant.scientificName}
                  </p>
                  <p className="text-sm text-foreground/80 line-clamp-2 mb-4">
                    {plant.overview}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {plant.medicinalUses.slice(0, 3).map((use, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-secondary/50"
                      >
                        {use}
                      </Badge>
                    ))}
                    {plant.medicinalUses.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-secondary/50"
                      >
                        +{plant.medicinalUses.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="bg-muted/50 p-6 rounded-full">
              <span className="material-symbols-outlined text-4xl text-muted-foreground">
                search_off
              </span>
            </div>
            <h3 className="text-xl font-bold">No plants found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any plants matching "{query}". Try checking for
              typos or using broader terms.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;
