import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Mission from "@/components/home/Mission";
import Features from "@/components/home/Features";
import Categories from "@/components/home/Categories";
import FeaturedPlant from "@/components/home/FeaturedPlant";
import PopularPlants from "@/components/home/PopularPlants";
import Blog from "@/components/home/Blog";
import Experts from "@/components/home/Experts";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import { Separator } from "@/components/ui/separator";

const LandingPage = () => {
  return (
    <div className="relative flex w-full flex-col group/design-root overflow-x-hidden bg-background text-foreground font-sans">
      <Header />
      <main className="flex flex-col items-center w-full">
        <Hero />
        <Mission />
        <div className="w-full max-w-7xl mx-auto px-4">
          <Separator className="my-4" />
        </div>
        <Features />
        <Categories />
        <FeaturedPlant />
        <PopularPlants />
        <Blog />
        <Experts />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
