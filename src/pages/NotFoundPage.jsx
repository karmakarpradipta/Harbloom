import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const location = useLocation();
  const message =
    location.state?.message ||
    "Oops! The page you're looking for doesn't exist.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-md"
      >
        <div className="relative">
          <span className="material-symbols-outlined text-[120px] text-muted-foreground/20 select-none">
            sentiment_dissatisfied
          </span>
          <h1 className="text-8xl font-bold text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-sm">
            404
          </h1>
        </div>

        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Page Not Found
        </h2>

        <p className="text-muted-foreground">{message}</p>

        <div className="pt-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/home">
              <span className="material-symbols-outlined mr-2">home</span>
              Go Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
