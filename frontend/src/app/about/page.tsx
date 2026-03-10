"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Image from "next/image"

export default function About() {

  return (
    <>
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <motion.h1
            initial={{ opacity:0, y:40 }}
            animate={{ opacity:1, y:0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16"
          >
            About Our AI Healthcare Platform
          </motion.h1>

          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center"
          >

            <motion.div
              initial={{ x:-40, opacity:0 }}
              animate={{ x:0, opacity:1 }}
              className="flex justify-center"
            >
              <Image
                src="/about.jpg"
                alt="AI Healthcare"
                width={500}
                height={400}
                className="rounded-2xl shadow-xl w-full max-w-md md:max-w-lg"
              />
            </motion.div>
            <div className="text-center md:text-left">

              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                AI Powered Healthcare
              </h2>

              <p className="text-base sm:text-lg text-blue-100">
                Our platform connects patients with healthcare services
                using artificial intelligence. We provide smart tools
                that help people understand symptoms, find doctors,
                and receive personalized health insights.
              </p>

              <p className="mt-4 text-blue-100 text-base sm:text-lg">
                Our mission is to make healthcare faster, smarter,
                and accessible for everyone through modern AI technology.
              </p>

            </div>

          </motion.div>

        </div>

      </section>

      <Footer />
    </>
  )
}