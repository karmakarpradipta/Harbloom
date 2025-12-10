import React from "react";
import { motion } from "motion/react";

const Mission = () => {
  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-primary/5 to-background"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(76,175,80,0.1),transparent_50%)]"></div>

      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit">
                <span className="material-symbols-outlined text-lg">
                  verified
                </span>
                <span>Our Mission</span>
              </div>
              <h2 className="text-foreground text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
                Empowering Herbal Wisdom
                <br />
                through Technology
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                We connect modern learners with centuries of Ayurvedic healing
                knowledge. Through immersive digital experiences, our mission is
                to preserve, educate, and promote the benefits of India’s
                medicinal plants for future generations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Feature
                icon="menu_book"
                title="Authentic Knowledge"
                desc="Rooted in AYUSH-recognized medicinal data and traditional texts."
              />
              <Feature
                icon="view_in_ar"
                title="Immersive Learning"
                desc="Interactive visuals and 3D models for deeper understanding."
              />
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center items-center"
          >
            <div className="absolute w-72 h-72 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl"></div>
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-sm aspect-square rounded-3xl object-cover shadow-xl border border-primary/20"
              src="./assets/images/mission_img.png"
              alt="Holographic representation of a medicinal plant"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="p-5 rounded-xl bg-card hover:bg-accent/50 border border-border hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <h3 className="text-foreground font-semibold text-lg mb-1">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Mission;
