import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHero from "@/components/explore/DashboardHero";
import CategoryChips from "@/components/explore/CategoryChips";
import FeaturedPlants from "@/components/explore/FeaturedPlants";
import PlantGrid from "@/components/explore/PlantGrid";

import { ExploreProvider } from "@/context/ExploreContext";

const HomePage = () => {
  return (
    <ExploreProvider>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <DashboardHero />

          <div className="space-y-12 w-full mt-8 md:mt-12 lg:mt-16">
            <CategoryChips />
            <FeaturedPlants />
            <PlantGrid />
          </div>
        </div>
      </DashboardLayout>
    </ExploreProvider>
  );
};

export default HomePage;
