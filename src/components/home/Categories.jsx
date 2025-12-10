import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";

const Categories = () => {
  return (
    <section className="w-full max-w-6xl px-4 py-16 sm:py-20 lg:py-32 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-8 sm:gap-10"
      >
        <div className="text-center">
          <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-tight tracking-[-0.015em]">
            Explore by Wellness Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          <a
            href="#"
            className="group transition-transform hover:scale-105 duration-300"
          >
            <Card className="relative flex flex-col items-center justify-center aspect-square overflow-hidden text-center text-white font-bold border-0 rounded-2xl shadow-md hover:shadow-xl">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="A macro shot of vibrant green leaves with dew drops"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV7IuCLyzuuL4g3H5fI4weGEYPicHoWwUCi3kAXiR4IJBDgmGFHqCLojb-wRXdQBsXMLzDdcWHWo9AWKL9lLX9YXZbUy7ai6OyMmGwCxIPq0pDfXwD_YNHG59TjdO9BA9nUMrQdV3yPyq8EllVLIoWCL7CfzIiI3nrztjzokf0jnKp-PF5WOE4d74L4pL_vxXPJW56hAF8NdfoP8WaJelwMSRGuu5KI-Sx4WIhO6169JarpvreaBp2d4OHQ86XCJc4s_tD6SQvqmFj"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <span className="relative z-10 p-2 font-serif text-base sm:text-lg tracking-wide">
                Immunity Booster
              </span>
            </Card>
          </a>
          <a
            href="#"
            className="group transition-transform hover:scale-105 duration-300"
          >
            <Card className="relative flex flex-col items-center justify-center aspect-square overflow-hidden text-center text-white font-bold border-0 rounded-2xl shadow-md hover:shadow-xl">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Close up of eucalyptus leaves, known for respiratory benefits"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXC9j4TfXyNi0vvYKiIVrUGT-4IPbbg9S19DsGUS6hJyeUR2yur6jVDBUQxv3wSEa1XQzOXnn1mBkpuxEAcBFSPxT83Wb_7sxyP1fomim4S8PNQpnIo-kM1S4aoO0i8cJczZ2q7s01gVBLsNmXBrMTKuc_G33VcXv9elSly3WUPqR4eoefX8lnjzz4pdNo9Cl1bOIxaoMJjEM2espUWYTkK3DnE_79VO4E1bXyBToNl9QacpAkiXAz5kmBWdlW7-B2w674NbNd269O"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <span className="relative z-10 p-2 font-serif text-base sm:text-lg tracking-wide">
                Respiratory Care
              </span>
            </Card>
          </a>
          <a
            href="#"
            className="group transition-transform hover:scale-105 duration-300"
          >
            <Card className="relative flex flex-col items-center justify-center aspect-square overflow-hidden text-center text-white font-bold border-0 rounded-2xl shadow-md hover:shadow-xl">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Aloe vera plant with its thick, succulent leaves"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPjoApdzgaCvM2qIbAErUQSA6Fbv44_KTVjeMVYGIYFEy9dvekEtJLgigOcHKx0-STlL36_km58oe2oSqNg636Dv1puVxDNrMH3Xq4asBqDsyjwCzCHu-bpFWbxRt4di3iLCeu7iZuG_GUp2NU60Er05mV3oN2Q7XUE7DlFAfHm-K-IoIaBPokSgXxmk6ihf3YR2mHWk-xUhotJr9e42Q2HVXclNzSFBJ7Or5wc_YvyVLazP8obJD-6BsM9AzVxw8LGb1F579I7zLl"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <span className="relative z-10 p-2 font-serif text-base sm:text-lg tracking-wide">
                Skin Health
              </span>
            </Card>
          </a>
          <a
            href="#"
            className="group transition-transform hover:scale-105 duration-300"
          >
            <Card className="relative flex flex-col items-center justify-center aspect-square overflow-hidden text-center text-white font-bold border-0 rounded-2xl shadow-md hover:shadow-xl">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Ginger root and mint leaves on a wooden surface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXvLxagWjIMyIy9kyJD3qhYEGJQw7hqNDptjHX1YJowOcOTwI5_QwG0ovhXSJBMSnigjhaskAerx6hnePuWe5E_7K7YcTVYypaD6-Yijq1stU_d62cp5L08xAD7JNLLYl6mq5tNYVOnZVIK_utm-lser-EZNkNFfWwg7A_s4ewLJY2sDL4WZd6HQ7ZOM4bSpA8ze2FqrmI_8WXNG2VUWcC-Cx_C6VscnF6b3OtiyG1SCygFFzr9acYAGSJn3UqoyJLxmR9PPqB5Cz-"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <span className="relative z-10 p-2 font-serif text-base sm:text-lg tracking-wide">
                Digestive Support
              </span>
            </Card>
          </a>
          <a
            href="#"
            className="group transition-transform hover:scale-105 duration-300"
          >
            <Card className="relative flex flex-col items-center justify-center aspect-square overflow-hidden text-center text-white font-bold border-0 rounded-2xl shadow-md hover:shadow-xl">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="A calming image of chamomile flowers"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjwA6vqh52KGd6PEFzp2lmNNLt2QLWAoN0YcVA8CMzx9Py948EERpwWw9rc1el-Dt3gV7KIeVnD4WdtGzPBO0ybusy-T006gwplg1QBS0msz71TTAcWrXxhchZ8f_WeAbAC72nvTJepybfqiFa8g6YYgl28WsNT3enQ0cskt0DHO_2YKz8tRp12oDR328im019OzvIiEK8RJJCzIiULydg9pnGx99uMTdNT9aUGqYa2ikEVX7PFeJmf5AcrqhLrJGSIfxPFFrPMlE7"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <span className="relative z-10 p-2 font-serif text-base sm:text-lg tracking-wide">
                Stress Relief
              </span>
            </Card>
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Categories;
