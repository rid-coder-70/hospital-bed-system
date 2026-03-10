'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import Lottie from "lottie-react"
import { useEffect, useState } from "react"

export default function NotFound() {

  const [animationData, setAnimationData] = useState(null)

  useEffect(() => {
    fetch("/animations/robot404.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white text-center px-6">
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-56 md:w-72 mb-6"
      >
        {animationData && (
          <Lottie animationData={animationData} loop />
        )}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-7xl font-bold text-blue-600"
      >
        404
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-gray-800 mt-4"
      >
        Page Not Found
      </motion.h2>

      <p className="text-gray-600 mt-3 max-w-md">
        Our AI robot couldn&apos;t find the page you&apos;re looking for.
      </p>

      <div className="flex gap-4 mt-8 flex-wrap justify-center">

        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition cursor-pointer"
        >
          Go Home
        </Link>

        <button
          onClick={() => window.location.reload()}
          className="border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          Reload
        </button>

      </div>

    </div>
  )
}