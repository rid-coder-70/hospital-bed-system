"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const container: any = { hidden: {}, show: { transition: { staggerChildren: 0.2 } } };
const item: any = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const videoAnimation: any = { hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };
const videoFloat: any = { animate: { y: [0, -12, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } } };

const Hero = () => {
  return (
    <section className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-900 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center md:text-left"
        >
          <motion.span
            variants={item}
            className="inline-block bg-white/20 dark:bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs sm:text-sm mb-5 font-semibold tracking-wide border border-white/10"
          >
            AI Powered Healthcare
          </motion.span>
          <motion.h1
            variants={item}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
          >
            Find <span className="text-yellow-300 dark:text-indigo-400 drop-shadow-sm">Hospital Beds</span> Instantly
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 text-base sm:text-lg text-blue-50 dark:text-gray-300 max-w-xl mx-auto md:mx-0 leading-relaxed"
          >
            HealthBed AI helps patients locate hospitals with available beds
            in real-time and enables emergency services to route patients
            to the best healthcare facility faster through autonomous dispatch.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4"
          >
            <Link href="/hospital">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white dark:bg-indigo-500 text-blue-600 dark:text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all"
              >
                Find Hospitals
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto border-2 border-white/70 dark:border-indigo-400/50 px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-100 transition-all"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          variants={videoAnimation}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex justify-center relative mt-10 md:mt-0"
        >
          <div className="absolute -z-10 w-52 sm:w-64 md:w-72 h-52 sm:h-64 md:h-72 bg-blue-400/30 dark:bg-indigo-500/20 blur-3xl rounded-full"></div>
          <motion.video
            src="/hospital-bed.mp4"
            autoPlay
            loop
            muted
            playsInline
            variants={videoFloat}
            animate="animate"
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl shadow-2xl shadow-black/20 dark:shadow-indigo-900/40 w-[280px] sm:w-[350px] md:w-[420px] lg:w-[450px] border border-white/10"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;