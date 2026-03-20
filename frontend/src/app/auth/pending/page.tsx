"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import { Clock, Mail, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg w-full text-center"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-amber-100 dark:border-amber-900/30">
            <div className="relative mx-auto w-24 h-24 mb-8">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-amber-100 dark:bg-amber-900/30 rounded-full"
              />
              <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Clock className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
              Application Submitted!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8">
              Your <span className="font-bold text-amber-600 dark:text-amber-400">Hospital Admin</span> account application has been received. A system administrator will review your request and assign your hospital. You'll be able to log in once approved.
            </p>

            <div className="grid grid-cols-1 gap-4 mb-8 text-left">
              {[
                { icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />, title: "Secure Review", desc: "Your credentials are verified by our system administrators." },
                { icon: <Mail className="w-5 h-5 text-blue-500" />, title: "Hospital Assignment", desc: "An admin will assign your specific hospital to your account." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/auth/login"
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-gray-900 font-bold px-8 py-3.5 rounded-2xl transition-all shadow-md"
            >
              Back to Login
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
