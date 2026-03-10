"use client";

import { motion } from "framer-motion";
import { Hospital, Bot, Ambulance } from "lucide-react";

const features = [
  {
    icon: Hospital,
    title: "Real-Time Bed Availability",
    desc: "Instantly check available hospital beds across multiple hospitals.",
  },
  {
    icon: Bot,
    title: "AI Emergency Routing",
    desc: "AI suggests the nearest hospital with available ICU beds for faster emergency care.",
  },
  {
    icon: Ambulance,
    title: "Ambulance Dispatch",
    desc: "Quickly request an ambulance and route it to the best hospital with available beds.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const iconAnimation = {
  float: {
    y: [0, -6, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Features = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Smart Healthcare Features
          </h2>

          <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base">
            Our AI-powered system helps patients and hospitals manage emergency
            situations efficiently.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-6 
          sm:gap-8 
          mt-12 sm:mt-14
          "
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                variants={card}
                whileHover={{ y: -6, scale: 1.03 }}
                className="
                group
                backdrop-blur-xl
                bg-white/60
                border border-white/30
                p-6 sm:p-7 lg:p-8
                rounded-2xl
                shadow-md
                hover:shadow-xl
                transition
                duration-300 cursor-pointer
                "
              >
                <motion.div
                  variants={iconAnimation}
                  animate="float"
                  className="
                  w-12 h-12 
                  sm:w-14 sm:h-14 
                  flex items-center justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                  mb-5 
                  "
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
