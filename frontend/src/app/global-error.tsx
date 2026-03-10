'use client'

import { motion } from "framer-motion"

export default function GlobalError({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 text-center px-6">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg"
      >
        <h1 className="text-6xl font-bold text-red-600">500</h1>

        <p className="text-gray-700 mt-4">
          Something went wrong in the system.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700"
        >
          Try Again
        </button>
      </motion.div>

    </div>
  )
}