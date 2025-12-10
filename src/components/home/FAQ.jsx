import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <section className="w-full max-w-6xl px-4 py-16 sm:py-20 lg:py-32 mx-auto">
      <div className="flex flex-col gap-8 sm:gap-10">
        <div className="text-center">
          <h2 className="text-foreground text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em]">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base font-normal leading-normal max-w-3xl mx-auto mt-2">
            Find answers to common questions about our platform and the world of
            herbal medicine.
          </p>
        </div>
        <div className="max-w-3xl mx-auto w-full">
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-3 sm:space-y-4"
          >
            <AccordionItem
              value="item-1"
              className="border border-border rounded-xl px-4 sm:px-6 bg-card shadow-sm"
            >
              <AccordionTrigger className="text-base sm:text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors py-4 sm:py-6">
                What is HarbLoom?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base pb-4 sm:pb-6">
                HarbLoom is an educational platform dedicated to cataloging and
                providing information about medicinal plants recognized by AYUSH
                (Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homoeopathy).
                Our goal is to preserve and share traditional knowledge in an
                accessible digital format.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-2"
              className="border border-border rounded-xl px-4 sm:px-6 bg-card shadow-sm"
            >
              <AccordionTrigger className="text-base sm:text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors py-4 sm:py-6">
                Is the information on this platform medically reliable?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base pb-4 sm:pb-6">
                All information provided is based on recognized traditional
                texts, AYUSH guidelines, and scientific research. However, this
                platform is for informational purposes only and should not be
                used as a substitute for professional medical advice. Always
                consult a qualified healthcare provider for any health concerns.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-3"
              className="border border-border rounded-xl px-4 sm:px-6 bg-card shadow-sm"
            >
              <AccordionTrigger className="text-base sm:text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors py-4 sm:py-6">
                How can I find a specific plant?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base pb-4 sm:pb-6">
                You can use the search bar on our 'Explore Plants' page or
                browse through our wellness categories to find plants related to
                specific health benefits. Each plant has a detailed profile with
                its botanical name, uses, and high-quality images.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-4"
              className="border border-border rounded-xl px-4 sm:px-6 bg-card shadow-sm"
            >
              <AccordionTrigger className="text-base sm:text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors py-4 sm:py-6">
                Can I contribute to the platform?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base pb-4 sm:pb-6">
                We are always open to collaboration with experts in the fields
                of botany, Ayurveda, and herbal medicine. If you are interested
                in contributing, please contact us through the information
                provided on our 'About' page. We value community involvement in
                our mission to spread knowledge.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
