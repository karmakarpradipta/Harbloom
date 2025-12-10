import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

const PopularPlants = () => {
  return (
    <section className="w-full max-w-6xl px-4 py-20 sm:py-32 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-12"
      >
        <div className="text-center">
          <h2 className="text-foreground text-3xl md:text-4xl font-serif font-bold leading-tight tracking-[-0.015em]">
            Popular Medicinal Plants
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-6 min-h-[600px] md:min-h-[800px]">
          <Card className="group relative col-span-1 md:col-span-2 row-span-1 md:row-span-2 flex flex-col rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl border-0">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Close-up image of a vibrant green Tulsi plant."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAahWN1SSjhDk6lXrzI9yC40LP4fZPTo2G17J-dnGFVhTDBA7tNH74WjtXoSgspoOfWzJEM735yeUqXHYAEFgKrxziPv2-dUnAj3dxomNpwrn0Fsr1Hp9kwEuX71OMzJcV3AMIc0erNOiq-3QxvJsW-qvXad-9xe38QE6Ldir0sFZwBFcYtmO0LOUsyUC-or2EkAKE-pmiGxg7OuZ0rGFbJh-7KH81sFpimLizFJh13F4YaDRRu73pU8_RhIs5gWVvJs8H0PdPUlikR"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative mt-auto p-8 text-white z-10">
              <Badge className="bg-primary/90 text-white hover:bg-primary border-0 px-3 py-1 text-sm font-bold mb-3">
                Immunity Booster
              </Badge>
              <h3 className="text-3xl font-serif font-bold mt-2">Tulsi</h3>
              <p className="text-base text-white/90 mt-2 max-w-md font-sans leading-relaxed">
                Known as Holy Basil, this adaptogenic herb is revered for its
                ability to reduce stress and enhance the body's natural
                defenses.
              </p>
              <Button
                variant="ghost"
                className="mt-6 h-12 px-6 gap-2 bg-white/10 text-white text-base font-bold backdrop-blur-md border border-white/20 hover:bg-white/20 hover:text-white transition-all"
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                >
                  eco
                </span>
                <span>View Details</span>
              </Button>
            </div>
          </Card>
          <Card className="group relative col-span-1 md:col-span-2 row-span-1 flex flex-col rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl border-0">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="A lush Aloe Vera plant showing its thick, gel-filled leaves."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmdl0esUODbAvjVPG7Bjy7CB0Au1orbmJqeYC5U5VQwHq3SWhm5CpQkkoCeobBIB0kxKyoGZKBmJwDQL5R78NYM_h0-bWteJeCRjX8nW-KJb3XlGRMFa1pkY5LDnMJZSl2TeObLseUkImoZW32gugy4sNdyjulx-dOwwN0GBxsA1HErHnYrQEHGFBXtnnvMGsFLL_nESL_Hc94AnvlZanqLDZCqlcDOHGGqEShjqlJlBkI_SCb17hvq1RMin15NpN3vcfHBCHAGQ2m"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative mt-auto p-8 text-white z-10">
              <Badge className="bg-primary/90 text-white hover:bg-primary border-0 px-3 py-1 text-sm font-bold mb-3">
                Skin Health
              </Badge>
              <h3 className="text-2xl font-serif font-bold mt-2">Aloe Vera</h3>
              <p className="text-sm text-white/90 mt-2 font-sans leading-relaxed">
                Soothes skin and supports digestive health with its gel-like
                substance.
              </p>
              <Button
                variant="ghost"
                className="mt-4 h-10 px-4 gap-2 bg-white/10 text-white text-sm font-bold backdrop-blur-md border border-white/20 hover:bg-white/20 hover:text-white transition-all"
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                >
                  eco
                </span>
                <span>View Details</span>
              </Button>
            </div>
          </Card>
          <Card className="group relative col-span-1 row-span-1 flex flex-col rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl border-0">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="A branch of a Neem tree with its characteristic leaves."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXgaZjeRznmCYLdg2a0r876tmKVc_iNr-84KAF9WnblVIhkeSHffzBb_trYGJ4KbOi_Osowongok8OCVH4EEuMbF9s5P0f2a5hJOZhQhZHE802mfZ_et7QVXGZmp4C1DwMibeMjZ6KFknSzn57SC6mcs3Jwi4OLYN8to3gZnoDq-rRAy5b1Guxg0M_K5JSo6ay2LqgkwG90dKwm7oFHVtcgiuyq0aFDCnynT7roAbSGYSfV4qxVDi9IgC-O8A9owRlwMvsP_xKScs0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative mt-auto p-6 text-white z-10">
              <Badge className="bg-primary/90 text-white hover:bg-primary border-0 px-2 py-0.5 text-xs font-bold mb-2">
                Purifier
              </Badge>
              <h3 className="text-xl font-serif font-bold mt-1">Neem</h3>
              <p className="text-xs text-white/90 mt-1 font-sans leading-relaxed">
                A powerful purifier with antibacterial properties.
              </p>
              <Button
                variant="ghost"
                className="mt-3 h-8 px-3 gap-1.5 bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/20 hover:bg-white/20 hover:text-white transition-all"
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                >
                  eco
                </span>
                <span>View Details</span>
              </Button>
            </div>
          </Card>
          <Card className="group relative col-span-1 row-span-1 flex flex-col rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl border-0">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Ashwagandha plant roots and leaves, displayed artistically."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvWqIkXN-lx2wGm4fz6TMpqQG2N1eAOGKa3ttA0TsSBD95W7UYJpULh8BYiaAbS6yYuufiUs--nMWHdkQnypOrsvX6aDWDQequeEivytgBkS9eQBQQjMnnVpSTf0c9h9yR4y7kM7nCslJlyOTqpixeo8POsruvptTDN28C4u9jxR_NE55A3Aj-lcTy1EA0QzVG0zGwpkgCExKOaobpa29Ta1MbhrITjIUXvlBx2uK9XiEu5qFz4Mo8ZuxkTDwLEFXyK91LaLE98BWv"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative mt-auto p-6 text-white z-10">
              <Badge className="bg-primary/90 text-white hover:bg-primary border-0 px-2 py-0.5 text-xs font-bold mb-2">
                Stress Relief
              </Badge>
              <h3 className="text-xl font-serif font-bold mt-1">Ashwagandha</h3>
              <p className="text-xs text-white/90 mt-1 font-sans leading-relaxed">
                The king of adaptogens, enhances vitality.
              </p>
              <Button
                variant="ghost"
                className="mt-3 h-8 px-3 gap-1.5 bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/20 hover:bg-white/20 hover:text-white transition-all"
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                >
                  eco
                </span>
                <span>View Details</span>
              </Button>
            </div>
          </Card>
        </div>
      </motion.div>
    </section>
  );
};

export default PopularPlants;
