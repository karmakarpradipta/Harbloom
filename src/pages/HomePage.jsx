import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHero from "@/components/explore/DashboardHero";
import CategoryChips from "@/components/explore/CategoryChips";
import PlantGrid from "@/components/explore/PlantGrid";

const HomePage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <DashboardHero />

        <div className="space-y-12 w-full mt-8 md:mt-12 lg:mt-16">
          <CategoryChips />
          <PlantGrid />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HomePage;
