"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Image from "next/image"

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <section className="flex-1 pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-900 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.h1
            initial={{ opacity:0, y:40 }}
            animate={{ opacity:1, y:0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-16 tracking-tight drop-shadow-sm"
          >
            About Our Medical Routing Core
          </motion.h1>
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            <motion.div
              initial={{ x:-40, opacity:0 }}
              animate={{ x:0, opacity:1 }}
              className="flex justify-center relative group"
            >
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <Image
                src="/about.jpg"
                alt="AI Healthcare Operations"
                width={600}
                height={500}
                className="rounded-3xl shadow-2xl shadow-black/30 md:max-w-xl w-full object-cover relative ring-1 ring-white/10 dark:ring-indigo-900/50"
              />
            </motion.div>
            <div className="text-center md:text-left">
              <span className="inline-block bg-white/20 dark:bg-indigo-500/20 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide border border-white/10 dark:border-indigo-400/20 mb-6">
                Our Mission
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 tracking-tight">
                AI Driven Emergency Logistics
              </h2>
              <p className="text-lg text-blue-50 dark:text-gray-300 leading-relaxed max-w-lg mb-6">
                Our platform connects patients and emergency services directly with accurate hospital capacities
                using an autonomous web of data. We provide command centers with the live telemetery needed to 
                understand exactly which facilities have available beds and which are overrun in real-time.
              </p>
              <p className="text-lg text-blue-50 dark:text-gray-300 leading-relaxed max-w-lg mb-10">
                It is our goal to reduce ambulance response time drastically. We believe that matching critical patients with available ICU beds quickly using Haversine algorithmic distance and capacity models will save lives.
              </p>
              <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="bg-white dark:bg-indigo-500 text-blue-600 dark:text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 dark:shadow-indigo-900/40 hover:shadow-xl transition-all"
              >
                  Review Our API Documentation
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  )
}