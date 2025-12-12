import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import plantService from "@/services/plantService";
import { Query } from "appwrite";
import { useExplore } from "@/context/ExploreContext";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PlantGrid = () => {
  const { selectedFilters } = useExplore();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tagsMap, setTagsMap] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Prepare queries
        let queries = [Query.limit(50), Query.orderDesc("$createdAt")];
        if (selectedFilters.families.length > 0) {
           queries.push(Query.equal("families", selectedFilters.families));
        }
        if (selectedFilters.habitats.length > 0) {
            queries.push(Query.equal("habitats", selectedFilters.habitats));
        }
        if (selectedFilters.tags && selectedFilters.tags.length > 0) {
            // Filter by selected tags
            // Appwrite 'tags' relationship - using 'equal' with array acts as OR logic usually, 
            // but for array attributes it might check for ANY.
            queries.push(Query.equal("tags", selectedFilters.tags));
        }

        // Parallel Fetch: Plants + Tags
        const [plantsRes, tagsRes] = await Promise.all([
             plantService.getPlants(queries),
             plantService.getTags() 
        ]);

        // Create Tags Map
        const localTagsMap = {};
        if (tagsRes && tagsRes.documents) {
            tagsRes.documents.forEach(tag => {
                localTagsMap[tag.$id] = tag.name;
            });
            setTagsMap(localTagsMap);
        }

        // Process Plants
        if (plantsRes && plantsRes.documents) {
             const mappedPlants = await Promise.all(plantsRes.documents.map(async (doc) => {
                const images = await plantService.getPlantImages(doc.$id);
                const imageUrl = images?.documents?.[0]?.url || "https://images.unsplash.com/photo-1546237769-1f487e413000?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.0.3"; 
                
                // Process Tags
                const rawTags = doc.tags || [];
                const visibleTags = rawTags.map(t => {
                    let tagId = t;
                    if (typeof t === 'object' && t.name) return t.name;
                    if (typeof t === 'object' && t.$id) tagId = t.$id;

                    if (localTagsMap[tagId]) return localTagsMap[tagId];
                    
                    if (typeof tagId === 'string') {
                        // Appwrite IDs are 20 chars. If it looks like an ID, hide it if not in map.
                        // Assuming valid tags are just words e.g. "Indoor"
                        if (tagId.length >= 18 && /^[a-zA-Z0-9]+$/.test(tagId)) return null; 
                        return tagId;
                    }
                    return null;
                }).filter(Boolean);

                return {
                    id: doc.$id,
                    commonName: (doc.common_names && doc.common_names.length > 0) ? doc.common_names.join(", ") : (doc.name || "Unnamed"),
                    scientificName: doc.scientific_name || doc.species || "Unknown",
                    tags: visibleTags,
                    image: imageUrl
                };
             }));
             setPlants(mappedPlants);
        } else {
            setPlants([]);
        }

      } catch (error) {
        console.error("Failed to fetch content", error);
        setPlants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [selectedFilters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Explore Collection
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : plants.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
              <p>No plants found matching your filters.</p>
              <p className="text-sm">Try adjusting your criteria.</p>
          </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-y-10">
        {plants.map((plant) => (
          <Link key={plant.id} to={`/plant/${plant.id}`} className="group">
            <Card className="h-full border-0 bg-transparent shadow-none hover:bg-transparent overflow-visible">
              <div className="relative aspect-[16/10] md:aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img
                  src={plant.image}
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
                    <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {plant.commonName}
                    </h3>
                    <p className="text-sm italic text-muted-foreground font-sans mt-0.5 line-clamp-1">
                      {plant.scientificName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {plant.tags && plant.tags.slice(0, 3).map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs font-semibold bg-secondary/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
};

export default PlantGrid;
