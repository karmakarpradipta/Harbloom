import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-screen flex items-center text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/hero_bg_4.png"
          alt="Background botanical illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-6 sm:gap-8 lg:gap-10 max-w-2xl"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight text-white drop-shadow-2xl">
              Step into the Digital Sanctuary of Healing Plants
            </h1>

            <p className="text-base sm:text-lg md:text-xl font-sans font-normal text-white/85 leading-relaxed drop-shadow-lg antialiased">
              Discover the ancient wisdom of AYUSH through an immersive,
              interactive journey into the world of medicinal herbs.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-2 sm:mt-6">
              <Link to="/home" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 sm:h-14 px-6 sm:px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full"
                >
                  Explore Now
                </Button>
              </Link>

              <Link to="/about" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 sm:h-14 px-6 sm:px-8 text-base font-semibold bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Empty space to let background show */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden lg:block"
          >
            {/* This space intentionally left to showcase the background image */}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce"
      >
        <span className="material-symbols-outlined text-white/60 text-3xl sm:text-4xl cursor-pointer hover:text-white transition-colors">
          keyboard_arrow_down
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
