'use client';

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const videoAnimation = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const videoFloat = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Hero = () => {
  return (
    <section className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center md:text-left"
        >

          <motion.span
            variants={item}
            className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-xs sm:text-sm mb-5"
          >
            AI Powered Healthcare
          </motion.span>

          <motion.h1
            variants={item}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          >
            Find <span className="text-yellow-300">Hospital Beds</span> Instantly
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 text-base sm:text-lg text-blue-100 max-w-xl mx-auto md:mx-0"
          >
            HealthBed AI helps patients locate hospitals with available beds
            in real-time and enables emergency services to route patients
            to the best healthcare facility faster.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4"
          >

            <motion.button
              whileHover={{ scale: 1.02}}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg cursor-pointer"
            >
              Find Hospitals
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 cursor-pointer"
            >
              Learn More
            </motion.button>

          </motion.div>

        </motion.div>

        <motion.div
          variants={videoAnimation}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex justify-center relative mt-10 md:mt-0"
        >

          <div className="absolute -z-10 w-52 sm:w-64 md:w-72 h-52 sm:h-64 md:h-72 bg-blue-400/30 blur-3xl rounded-full"></div>

          <motion.video
            src="/hospital-bed.mp4"
            autoPlay
            loop
            muted
            playsInline
            variants={videoFloat}
            animate="animate"
            whileHover={{ scale: 1.05 }}
            className="rounded-xl shadow-2xl w-[280px] sm:w-[350px] md:w-[420px] lg:w-[450px]"
          />

        </motion.div>

      </div>

    </section>
  );
};

export default Hero;