'use client';

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Home, Wifi } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 px-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg w-full"
      >
        {/* Error number */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-6"
        >
          <div className="text-[10rem] font-black leading-none select-none
                          text-gray-100 dark:text-slate-800 absolute inset-0 flex items-center justify-center blur-sm">
            500
          </div>
          <div className="text-8xl font-black leading-none
                          bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 bg-clip-text text-transparent relative z-10">
            500
          </div>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center mx-auto mb-6"
        >
          <Wifi className="w-8 h-8" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 tracking-tight"
        >
          Something Went Wrong
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 dark:text-gray-400 mb-4 text-sm leading-relaxed"
        >
          An unexpected server error occurred. This may be a temporary issue — try again in a moment.
        </motion.p>

        {error?.digest && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="text-xs font-mono text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2 mb-8 inline-block">
            Error ID: {error.digest}
          </motion.p>
        )}

        <motion.div
          className="flex justify-center gap-3 mt-8 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button onClick={() => reset()}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-500/20 transition-all">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <a href="/"
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
            <Home className="w-4 h-4" /> Go Home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}