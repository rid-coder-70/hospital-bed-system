"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { LogIn } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Lottie from "lottie-react"

export default function Page() {

  const [loading, setLoading] = useState(false)
  const [animation, setAnimation] = useState(null)

  useEffect(() => {
    fetch("/animations/hospital.json")
      .then(res => res.json())
      .then(data => setAnimation(data))
  }, [])

  const handleLogin = () => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      alert("Login Successful!")
    }, 1500)
  }

  return (
    <>
      <Navbar />

      <section className="min-h-screen grid md:grid-cols-2">
        <div className="flex items-center justify-center bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {animation && (
              <Lottie
                animationData={animation}
                loop
                className="w-87.5"
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
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8 }}
              >
                <LogIn size={40} className="text-blue-600" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6">
              Welcome Back
            </h2>

            <div className="space-y-5">

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

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="text-center text-gray-500 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign Up
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