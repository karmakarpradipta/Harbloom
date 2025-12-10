import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "motion/react";

const expertsData = [
  {
    name: "Dr. Ananya Sharma",
    role: "Ayurvedic Practitioner",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8VxC0jZqcSIscxv4FN8Rxwg_gQ6rqMwccRhOyJBg5YQvMfw3pU9Kv1M_ropjT7DVGlQrcmG2LAh0T4XPInglI6-aSopMrbSkr8HzJscbgZPNPG6Vfe7jkqEktw0bGLjFZPJZUc7dgSSm2OSsPARFwGCQZjBRVHvFC1vCzxMcmhssfsaenwEq_Wvrp6HzJr5DvkuUVgHQQvSPU3iCH0BDbimSHwgKkjH7Lc5obYMrJNmBXy2YGQ7anFlZkp0s5G10aDuV1xc7V0pBT",
    initials: "AS",
  },
  {
    name: "Rohan Verma",
    role: "Botanist & Researcher",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiOSnzuJlfnLHfUzcKzv3hipDme0ytV_SsHLnsxB99bQ8LhdhcU3Xe_qGw2o4ee3kKkIDVmUVK_5H9UpPziwc46-OjpEmqbKNl41DDNen7u4LWgMgQS8wEc1h8bsW7b6fduO1OXF0tmmSfgFssYqm_vj8W5_w8T3EouMe_3Vd42rN7g4loQlTRBfBMNb68lY2sMneyr73g63L3PC7DCh10Tdj5J5x8zQhS1MJtS7VFMsYCXaWDVfUFmQWL7CDQLlQWQePCueN6ab6e",
    initials: "RV",
  },
  {
    name: "Priya Desai",
    role: "Herbalist",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmDbT_ua_kTyhS5PZ7Atlg_NyLyHypVBnedTteJO42Uz1b8EA_hiboFoBSsYezODnLD11FvV5iPVxu4OHTLHcRBpRwDBbLmcmzaiH2M-TdBldHbZjfm6_gBR7SVGgHTIVDMIFMvIYgdD2uc0YcMNywqmKs5SpmNFxSQBC7LAs9DhGh4sGtvARaijiusbgWAAysMmNzsJy5-HOy-PZ_lmzbCsZoz1xgqRgYEs-h0P_dTZJSUmrbD44je0FXxPQI0GNhk5V7YN3TX2w7",
    initials: "PD",
  },
  {
    name: "Dr. Sameer Gupta",
    role: "Ethnobotanist",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuw8M27ABDo165wX_kCRzBeXscfGSIV6RD2virOqEuxUVa4pVU6y5YjLBaZuiH02pH3cbSQBfvFUqpWVtekd8WK9zEOpeEWxJWkVxZrn5sld5ZMzPt56-iWIqQFsZEW2wAyWqNY2QnJSmu_MSAWYLwoTCl4TidYklcj1rJLqgILn0uvb-NtV1d33m2VqRnjtfzFG1eP6BKIS3tc9X-zRiFsp4lpSNEnLKNhw07SJ4j2iJVjQ1mJEvAK5cskevHXJF-1sD__f8dSdy6",
    initials: "SG",
  },
];

const Experts = () => {
  return (
    <section className="w-full max-w-6xl px-4 py-20 sm:py-32 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-10 text-center"
      >
        <h2 className="text-foreground text-3xl md:text-4xl font-serif font-bold leading-tight tracking-[-0.015em]">
          Meet the Experts
        </h2>
        <p className="text-muted-foreground text-lg font-sans font-normal leading-normal max-w-3xl mx-auto">
          Our platform is powered by the invaluable knowledge and research of
          dedicated experts in botany and Ayurveda.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
          {expertsData.map((expert, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-6 border-0 shadow-md hover:shadow-xl bg-card rounded-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <Avatar className="h-32 w-32 shadow-lg border-4 border-primary/10">
                <AvatarImage src={expert.image} alt={expert.name} />
                <AvatarFallback>{expert.initials}</AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-xl font-serif font-bold text-foreground">
                {expert.name}
              </h3>
              <p className="text-sm text-primary font-bold font-sans uppercase tracking-wide mt-1">
                {expert.role}
              </p>
            </Card>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Experts;
