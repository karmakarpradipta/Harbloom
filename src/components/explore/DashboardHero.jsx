import React from "react";
import { Button } from "@/components/ui/button";

const DashboardHero = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-100 dark:border-green-900/50 p-6 sm:p-10 md:p-14 lg:p-20 mb-8">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 sm:-mt-20 sm:-mr-20 w-48 sm:w-64 h-48 sm:h-64 bg-green-200/50 dark:bg-green-800/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 sm:-mb-20 sm:-ml-20 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-200/50 dark:bg-emerald-800/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight mb-4">
          Good Evening, User <span className="animate-pulse">🌿</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-10 text-balance">
          Discover nature's healing power. What condition or plant are you
          looking for today?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            size="lg"
            className="rounded-xl font-bold shadow-lg gap-2 w-full sm:w-auto"
          >
            Explore Library
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-xl font-bold border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 gap-2 w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-lg fill-current">
              favorite
            </span>
            My Saved Plants
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
