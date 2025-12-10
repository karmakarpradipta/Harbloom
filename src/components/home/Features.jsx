import React from "react";

const featuresData = [
  {
    icon: "menu_book",
    title: "Interactive Plant Library",
    description:
      "Dive into a comprehensive database of plants with detailed information, botanical classifications, and traditional knowledge.",
  },
  {
    icon: "health_and_safety",
    title: "Medicinal Uses & Benefits",
    description:
      "Learn about the traditional and modern uses of each plant for health, wellness, and natural healing therapies.",
  },
  {
    icon: "potted_plant",
    title: "High-Quality Imagery",
    description:
      "View stunning, high-resolution images of every plant's leaves, roots, and stems for easy and accurate identification.",
  },
];

const Features = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold font-serif tracking-tight text-foreground sm:text-4xl">
          Features for your journey
        </h2>

        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Discover our powerful and easy-to-use tools designed to guide you
          through the fascinating world of medicinal flora.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className="rounded-lg border border-border p-8 transition-colors hover:bg-muted/30"
          >
            <div className="inline-flex rounded-lg bg-primary/10 p-3 text-primary">
              <span className="material-symbols-outlined text-3xl">
                {feature.icon}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-foreground">
              {feature.title}
            </h3>

            <p className="mt-2 text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
