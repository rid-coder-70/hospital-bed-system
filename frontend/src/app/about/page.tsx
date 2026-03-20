"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Zap, ShieldCheck, Globe2, HeartHandshake, Activity, Bed } from "lucide-react"

const STATS = [
  { value: "40+", label: "Hospitals Mapped" },
  { value: "8", label: "Divisions Covered" },
  { value: "<50ms", label: "WebSocket Latency" },
  { value: "99.9%", label: "Uptime Target" },
]

const VALUES = [
  { icon: <Zap className="w-6 h-6" />, title: "Speed Saves Lives", desc: "We obsess over milliseconds. Every latency reduction in bed availability data directly reduces ambulance response times.", color: "from-amber-500 to-orange-500" },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Zero Double-Booking", desc: "Pessimistic database locking (FOR UPDATE) guarantees that two dispatchers can never overbook the same last bed.", color: "from-indigo-500 to-blue-500" },
  { icon: <Globe2 className="w-6 h-6" />, title: "Nationwide Coverage", desc: "We map hospitals across all 8 divisions of Bangladesh, giving dispatchers a fully-georeferenced live command view.", color: "from-emerald-500 to-teal-500" },
  { icon: <HeartHandshake className="w-6 h-6" />, title: "Built for Care", desc: "Every feature — from ward tracking to salary-free admin approvals — is designed by medical operations experts.", color: "from-rose-500 to-pink-500" },
]

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 px-4 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Activity className="w-4 h-4" /> About HealthBed AI
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Saving Lives Through<br />
            <span className="text-blue-200 dark:text-indigo-300">Real-Time Intelligence</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-blue-100 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            HealthBed AI is Bangladesh's first autonomous hospital bed routing and emergency dispatch platform — built to eliminate the information blackout that costs lives during medical crises.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-1">{s.value}</p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Our Core Values</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Everything we build is guided by one principle: in a medical emergency, every second of wasted information is life-threatening.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm flex gap-5 hover:shadow-md transition-shadow">
                <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white shadow-lg`}>{v.icon}</div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 mb-2">{v.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">Built on a Modern Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Next.js 16","React 19","TypeScript","Tailwind CSS","PostgreSQL","Node.js","Express.js","Socket.io","Framer Motion","Recharts","Leaflet","JWT Auth","Zod Validation","Bcrypt"].map(t => (
              <span key={t} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-800">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}