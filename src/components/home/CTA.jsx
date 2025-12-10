import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="w-full max-w-6xl px-4 py-16 sm:py-20 lg:py-32 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center justify-center text-center p-8 sm:p-12 md:p-16 lg:p-20 rounded-2xl overflow-hidden bg-cover bg-center shadow-2xl"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAoTwQfsLjEodmOcUH3JP4vrltq9C8bCwhtzK3C_N4SDTW6DQOMnANVGrrvFCIz3vkUeW1eFFsjBWkE_g_fn-e5TCEYpyxYF-cyqZ-OqtJvdA42OEuQbrw4mUThGsoj6Fn8sYEkdI5eP9Bk0AHCBqmPPsCXeWi37URQhE1XH1KLnONH21NinBBo7WV7WE-krixqNEk_9OBD7I1Scfr8VZpLjNBWjU_-mWTGJWvDeMyBB0CvkaqfTjJHtgrOW4llP7pn1c3Yb1kM5avy")',
        }}
      >
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight tracking-[-0.015em] max-w-2xl drop-shadow-lg">
          Start Your Herbal Journey
        </h2>
        <p className="text-white/90 mt-4 sm:mt-6 max-w-xl text-base sm:text-lg font-sans font-normal leading-relaxed drop-shadow-md">
          Dive into our complete collection and uncover the secrets of
          traditional herbal medicine.
        </p>
        <Link to="/home">
          <Button
            size="lg"
            className="mt-8 sm:mt-10 h-12 sm:h-14 px-6 sm:px-8 bg-primary text-white text-base sm:text-lg font-bold hover:bg-primary/90 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Explore All Plants
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default CTA;
