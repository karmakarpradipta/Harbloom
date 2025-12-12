import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useExplore } from "@/context/ExploreContext";

const categories = [
  "All Plants",
  "Immunity Boosters",
  "Digestive Aid",
  "Skin Care",
  "Respiratory",
  "Stress Relief",
  "Pain Management",
  "Detox",
];

const CategoryChips = () => {
  const { filters, selectedFilters, toggleTag } = useExplore();

  return (
    <div className="w-[90vw] md:w-full lg:w-full">
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-3 px-1">
          {filters.tags && filters.tags.length > 0 ? (
            filters.tags.map((tag) => {
              const isSelected = selectedFilters.tags.includes(tag.$id);
              return (
                <Button
                  key={tag.$id}
                  variant="ghost"
                  onClick={() => toggleTag(tag.$id)}
                  className={`rounded-full px-6 h-10 font-medium whitespace-nowrap transition-all duration-300 border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md hover:bg-primary/90 hover:text-primary-foreground"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-card"
                  }`}
                >
                  {tag.name}
                </Button>
              );
            })
          ) : (
            <div className="px-4 text-sm text-muted-foreground">No tags available</div>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategoryChips;
