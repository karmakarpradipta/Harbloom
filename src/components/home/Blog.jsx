import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "The Healing Power of Tulsi",
    description:
      "Boost immunity and reduce stress with Holy Basil's powerful adaptogenic properties.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAS0lPOODndeTKm93C0Kw4Ph6cofs1F11fktEgepr4e2mWxqhKBxnvxHo4VRare5WgvXhdARP-fhKPSaU_Q1tlv215QA-ajCy3qDTZsGhupKlHBieluOVfsiHTCDTXrXqptAk0SgB66hW1AbwRuOXTKmqAdZUfIxEtRy46SaGWPUG9vRRyCzT5dlHu1uMGJSh9TuUXTQXNX99o0Gp_E6ip56WszwmfezgvTfzb0CFM6woqKPU41p02JzOhk-3HkMD51CTRre_vfblQS",
    alt: "Tulsi (Holy Basil) plant with vibrant green leaves",
  },
  {
    id: 2,
    title: "Ayurvedic Herbs for Digestion",
    description:
      "Discover how Ginger and Mint naturally support digestive health and wellness.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXvLxagWjIMyIy9kyJD3qhYEGJQw7hqNDptjHX1YJowOcOTwI5_QwG0ovhXSJBMSnigjhaskAerx6hnePuWe5E_7K7YcTVYypaD6-Yijq1stU_d62cp5L08xAD7JNLLYl6mq5tNYVOnZVIK_utm-lser-EZNkNFfWwg7A_s4ewLJY2sDL4WZd6HQ7ZOM4bSpA8ze2FqrmI_8WXNG2VUWcC-Cx_C6VscnF6b3OtiyG1SCygFFzr9acYAGSJn3UqoyJLxmR9PPqB5Cz-",
    alt: "Fresh ginger root and mint leaves for digestive health",
  },
  {
    id: 3,
    title: "Ashwagandha: The Adaptogen King",
    description:
      "Combat stress and enhance vitality with this ancient adaptogenic powerhouse.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvWqIkXN-lx2wGm4fz6TMpqQG2N1eAOGKa3ttA0TsSBD95W7UYJpULh8BYiaAbS6yYuufiUs--nMWHdkQnypOrsvX6aDWDQequeEivytgBkS9eQBQQjMnnVpSTf0c9h9yR4y7kM7nCslJlyOTqpixeo8POsruvptTDN28C4u9jxR_NE55A3Aj-lcTy1EA0QzVG0zGwpkgCExKOaobpa29Ta1MbhrITjIUXvlBx2uK9XiEu5qFz4Mo8ZuxkTDwLEFXyK91LaLE98BWv",
    alt: "Ashwagandha roots and leaves showcasing adaptogenic properties",
  },
];

const Blog = () => {
  return (
    <section
      className="w-full max-w-6xl px-4 py-20 sm:py-32 mx-auto"
      aria-labelledby="blog-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-12"
      >
        {/* Section Header */}
        <header className="text-center space-y-3">
          <h2
            id="blog-heading"
            className="text-foreground text-3xl md:text-4xl font-serif font-bold leading-tight tracking-[-0.015em]"
          >
            From Our Blog
          </h2>
          <p className="text-muted-foreground text-lg font-sans max-w-2xl mx-auto">
            Insights from the world of medicinal plants and Ayurveda.
          </p>
        </header>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <CardContainer className="w-full h-full">
                <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/10 border-border w-full h-full rounded-xl p-6 border flex flex-col transition-all duration-300">
                  <CardItem
                    translateZ="50"
                    className="text-xl font-serif font-bold text-card-foreground leading-tight truncate w-full"
                  >
                    {post.title}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-muted-foreground text-sm mt-2 max-w-sm font-sans leading-relaxed grow"
                  >
                    {post.description}
                  </CardItem>
                  <CardItem translateZ="100" className="w-full mt-4">
                    <img
                      src={post.image}
                      height="1000"
                      width="1000"
                      className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt={post.alt}
                      loading="lazy"
                    />
                  </CardItem>
                  <div className="flex justify-between items-center mt-6">
                    <CardItem
                      translateZ={20}
                      as="a"
                      href="#"
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 hover:gap-2 transition-all font-sans"
                    >
                      Read More
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Blog;
