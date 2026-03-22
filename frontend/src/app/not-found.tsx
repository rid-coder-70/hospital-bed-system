'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, RotateCcw, AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 text-center px-6 transition-colors duration-300">

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="relative mb-8"
      >
        <div className="text-[10rem] md:text-[14rem] font-black leading-none select-none
                        text-gray-100 dark:text-slate-800 absolute inset-0 flex items-center justify-center blur-sm">
          404
        </div>
        <div className="text-8xl md:text-9xl font-black leading-none
                        bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 bg-clip-text text-transparent relative z-10">
          404
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center mb-6"
      >
        <AlertCircle className="w-8 h-8" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 tracking-tight"
      >
        Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-500 dark:text-gray-400 max-w-md text-sm leading-relaxed mb-10"
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Double-check the URL or navigate back to the dashboard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 flex-wrap justify-center"
      >
        <Link href="/"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all">
          <Home className="w-4 h-4" /> Go Home
        </Link>
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
          <RotateCcw className="w-4 h-4" /> Go Back
        </button>
      </motion.div>

    </div>
  )
}