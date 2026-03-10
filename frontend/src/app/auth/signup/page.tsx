"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Lottie from "lottie-react"

export default function Page() {

  const [animation, setAnimation] = useState(null)

  useEffect(() => {
    fetch("/animations/hospital.json")
      .then(res => res.json())
      .then(data => setAnimation(data))
  }, [])

  return (
    <>
      <Navbar />

      <section className="min-h-screen grid md:grid-cols-2">
        <div className="flex items-center justify-center bg-linear-to-r from-indigo-500 via-purple-500 to-blue-600">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {animation && (
              <Lottie
                animationData={animation}
                loop
                className="w-[350px]"
              />
            )}
          </motion.div>

        </div>
        <div className="flex items-center justify-center bg-gray-50">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-lg bg-white/70 border border-gray-200 shadow-xl p-10 rounded-2xl w-[380px]"
          >

            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <UserPlus size={40} className="text-blue-600" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6">
              Create Account
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Name"
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                Sign Up
              </button>

              <p className="text-center text-gray-500 text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>

            </div>

          </motion.div>

        </div>

      </section>

      <Footer />
    </>
  )
}