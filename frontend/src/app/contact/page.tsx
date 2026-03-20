"use client"

import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useState } from "react"
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageSquare } from "lucide-react"

const CONTACT_INFO = [
  { icon: <Mail className="w-5 h-5" />, label: "Technical Support", value: "support@healthbed.ai", color: "from-blue-500 to-indigo-500" },
  { icon: <Phone className="w-5 h-5" />, label: "Emergency Hotline", value: "+880 (9) 999 1234", color: "from-rose-500 to-red-500" },
  { icon: <MapPin className="w-5 h-5" />, label: "Head Office", value: "Dhaka North Block, BD", color: "from-emerald-500 to-teal-500" },
  { icon: <Clock className="w-5 h-5" />, label: "Support Hours", value: "24 / 7 Operations", color: "from-amber-500 to-orange-500" },
]

export default function Contact() {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setForm({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setSuccess(false), 4000)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-14 md:pt-44 px-4 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.2),transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <MessageSquare className="w-4 h-4" /> Get In Touch
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-blue-100 dark:text-slate-400 text-lg">
            Our support command center operates 24/7. Submit your ticket and our team will respond within the hour.
          </motion.p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-10 px-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {CONTACT_INFO.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-3 shadow-sm`}>{c.icon}</div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">{c.label}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{c.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="flex-1 py-20 px-4 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 p-8 md:p-12">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Send a Message</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Fill out the form below and our operations team will get back to you promptly.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "john@hospital.com" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{f.label}</label>
                    <input type={f.type} required placeholder={f.placeholder}
                      value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-medium text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 text-sm" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                <input type="text" required placeholder="e.g. Hospital registration issue" value={form.subject} onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-medium text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Message</label>
                <textarea rows={5} required placeholder="Describe your issue or inquiry in detail..." value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-medium text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 text-sm resize-none" />
              </div>
              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-70 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Success Toast */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 right-8 z-50 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">Message Sent!</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Our team will respond shortly.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}