import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

const FeaturedPlant = () => {
  return (
    <section className="w-full bg-primary/5 dark:bg-primary/10 py-20 sm:py-32">
      <div className="w-full max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-10"
        >
          <div className="text-center">
            <h2 className="text-foreground text-3xl md:text-4xl font-serif font-bold leading-tight tracking-[-0.015em]">
              Plant of the Week
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex justify-between">
              <img
                alt="A high-quality image of a Turmeric plant, showing its vibrant green leaves and the earthy turmeric root."
                className="rounded-2xl object-cover w-full h-auto max-w-md shadow-xl hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAe-b2NrNOksxpR41heXFNqKkJt-0qyJ21Ddazb-XhrWXGOHYLyp5DKOWLJzDGmXhbvvR61c_580GmJRY6A5L9VyXWYHvd7pE9jpwUt4A7mWlgVV5aXTTSDboNcdi9XOn-NPyprm_X-NQrebWqJqq7UhptmckbrLZPIH64UEtdy4OoOuJyWtDhn8GOmvK5GLuIh3tS01EyYAHyOeKtzn_C1_OVIrLZxYWuaM2rQtn1JYf0a2994EOwS6r47rIx43tpSLZbHydWXn7A"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 px-3 py-1 text-sm font-bold"
                  >
                    Featured
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-muted-foreground border-muted-foreground/30"
                  >
                    Curcuma longa
                  </Badge>
                </div>
                <h3 className="text-foreground text-3xl md:text-4xl font-serif font-bold leading-tight">
                  Turmeric
                </h3>
                <p className="text-muted-foreground text-lg font-sans font-normal leading-relaxed">
                  Known as the 'Golden Spice', Turmeric (Curcuma longa) is
                  celebrated in Ayurveda for its powerful anti-inflammatory and
                  antioxidant properties, traditionally used to support joint
                  health, digestion, and skin vitality.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4 bg-background/50 p-4 rounded-r-lg">
                <p className="text-muted-foreground text-base font-sans italic leading-relaxed">
                  <span className="font-bold not-italic text-foreground font-serif">
                    Botanical Fact:
                  </span>{" "}
                  The vibrant yellow color of turmeric comes from curcumin, its
                  primary active compound, which is also responsible for most of
                  its medicinal benefits.
                </p>
              </div>
              <Button
                size="lg"
                className="w-fit h-12 px-8 bg-primary text-white text-base font-bold hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPlant;
