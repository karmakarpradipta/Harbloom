import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  return (
    <div className="w-[90vw] md:w-full lg:w-full">
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-3 px-1">
          {categories.map((cat, i) => (
            <Button
              key={cat}
              variant="ghost"
              className={`rounded-full px-6 h-10 font-medium whitespace-nowrap transition-all duration-300 border ${
                i === 0
                  ? "bg-primary text-primary-foreground border-primary shadow-md hover:bg-primary/90 hover:text-primary-foreground"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-card"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategoryChips;
