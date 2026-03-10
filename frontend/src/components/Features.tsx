"use client";

import { motion } from "framer-motion";
import { Hospital, Bot, Ambulance } from "lucide-react";

const features = [
  {
    icon: Hospital,
    title: "Real-Time Bed Availability",
    desc: "Instantly check available hospital beds across multiple network hospitals via live telemetry.",
  },
  {
    icon: Bot,
    title: "AI Emergency Routing",
    desc: "Autonomous algorithm computes distance and capacities to suggest nearest hospitals in seconds.",
  },
  {
    icon: Ambulance,
    title: "Ambulance Dispatching",
    desc: "Emergency services can rapidly receive ideal destination suggestions without calling dispatchers.",
  },
];
const container: any = { hidden: {}, show: { transition: { staggerChildren: 0.2, }, }, };
const card: any = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" }, }, };
const iconAnimation: any = { float: { y: [0, -6, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut", }, }, };

const Features = () => {
  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4">
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Smart Healthcare Features
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 sm:mt-5 md:text-lg max-w-xl mx-auto">
            Our autonomous routing system helps patients and command centers manage medical
            situations efficiently.
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 sm:mt-20"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={card}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 p-8 md:p-10 rounded-3xl shadow-md shadow-gray-200/50 dark:shadow-none hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500 transition duration-300 cursor-pointer relative overflow-hidden"
                tabIndex={0}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 dark:from-indigo-900/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <motion.div
                  variants={iconAnimation}
                  animate="float"
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-indigo-900/40 text-blue-600 dark:text-indigo-400 mb-6 shadow-inner group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:text-white transition-colors duration-300"
                >
                  <Icon className="w-7 h-7" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
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
