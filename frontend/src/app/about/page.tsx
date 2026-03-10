"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Image from "next/image"

export default function About(){

  return(
    <>
      <Navbar/>

      <section className="pt-32 pb-20 bg-linear-to-r from-blue-500 to-indigo-600 text-white">

        <div className="max-w-6xl mx-auto px-6">

          <motion.h1
            initial={{opacity:0,y:40}}
            animate={{opacity:1,y:0}}
            className="text-4xl font-bold text-center mb-12"
          >
            About Our Platform
          </motion.h1>

          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{delay:0.3}}
            className="grid md:grid-cols-2 gap-12 items-center"
          >


            {/* <Image
              src="/about.png"
              alt="About-Photo"
              className="rounded-xl shadow-lg"
            /> */}

            <div>

              <h2 className="text-2xl font-bold mb-4">
                AI Powered Healthcare
              </h2>

              <p className="text-lg text-blue-100">
                Our platform helps patients connect with healthcare
                services using artificial intelligence. We provide
                tools for symptom checking, doctor discovery,
                and health insights.
              </p>

              <p className="mt-4 text-blue-100">
                Our mission is to make healthcare more accessible,
                faster, and smarter using modern technologies.
              </p>

            </div>

          </motion.div>

        </div>

      </section>

      <Footer/>
    </>
  )
}