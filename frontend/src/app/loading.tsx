'use client'

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full"
      />
      <motion.p
        className="mt-6 text-gray-600 text-lg"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Loading AI Data...
      </motion.p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-6">

        {[1, 2, 3].map((card) => (
          <motion.div
            key={card}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-40 rounded-xl bg-gray-200"
          />
        ))}

      </div>

    </div>
  )
}