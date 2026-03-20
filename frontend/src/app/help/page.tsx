"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, ChevronDown, Search, Building2, ShieldCheck, Bed, AlertTriangle, Map } from "lucide-react"

const FAQS = [
  {
    category: "Getting Started",
    icon: <ShieldCheck className="w-4 h-4" />,
    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30",
    items: [
      { q: "How do I register as a Hospital Admin?", a: "Click on 'Sign Up' and select the 'Hospital Admin' role. Your application will be submitted to the System Administrator for review. You'll receive access once they approve your account and assign your hospital." },
      { q: "How long does account approval take?", a: "The System Administrator typically reviews applications within 24 hours. You can check back on the login page once you have submitted your registration." },
      { q: "Can I register as both a Patient and Hospital Admin?", a: "No. Each account is tied to a single role. If you need to switch roles, please contact support@healthbed.ai." },
    ]
  },
  {
    category: "Bed Management",
    icon: <Bed className="w-4 h-4" />,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30",
    items: [
      { q: "How do I update my hospital's bed counts?", a: "Log into your Hospital Admin dashboard. Scroll down to the 'Update Bed Inventory' panel, adjust the General or ICU bed counters using the +/- buttons, then click 'Push Live Update' to broadcast the change instantly via WebSocket to all public users." },
      { q: "How do I add a custom ward like a Burn Unit or Maternity Ward?", a: "In the 'Update Bed Inventory' panel, click '+ Add Specific Ward'. Select the ward type from the dropdown, enter the max capacity and currently available beds, then click 'Save Ward'. Include this when you Push Live Update." },
      { q: "Are my bed update changes saved permanently?", a: "Yes. Every time you click 'Push Live Update', the data is written to the PostgreSQL database and also logged in the update history for analytics." },
    ]
  },
  {
    category: "Emergency Dispatch",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30",
    items: [
      { q: "How does the emergency dispatch system work?", a: "From the public hospital directory, users click 'Emergency Dispatch' on a hospital card, fill in the patient name, condition, and ETA. This instantly fires a WebSocket alert directly to that hospital's admin dashboard." },
      { q: "What happens when I click 'Reserve 1 Bed Instantly'?", a: "The system uses PostgreSQL pessimistic locking to atomically decrement the available bed count by 1. This guarantees no two dispatchers can claim the same last bed simultaneously." },
      { q: "Will I get a notification even if I'm on another browser tab?", a: "Yes. The platform requests native OS browser notification permission. When an incoming ambulance alert fires, you'll receive a system-level push notification even if the tab is in the background." },
    ]
  },
  {
    category: "Public Map",
    icon: <Map className="w-4 h-4" />,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30",
    items: [
      { q: "What do the map pin colors mean?", a: "Green pins indicate hospitals with available beds. Red pins indicate hospitals that are currently at full capacity. Click any pin to see a pop-up with live bed counts and a link to the hospital page." },
      { q: "Is the map data live?", a: "Yes. Hospital pins update in real-time via WebSocket. If an admin pushes a bed count change, the map reflects it within milliseconds without needing a page reload." },
    ]
  },
]

export default function HelpCenter() {
  const [openIdx, setOpenIdx] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = FAQS.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <section className="pt-32 pb-14 md:pt-44 px-4 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <HelpCircle className="w-4 h-4" /> Help Center
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">How can we help?</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-white/50 shadow-lg font-medium placeholder-gray-400" />
          </motion.div>
        </div>
      </section>

      <main className="flex-1 py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No results for "{search}"</p>
              <p className="text-sm mt-1">Try a different keyword or contact support.</p>
            </div>
          ) : filtered.map((cat) => (
            <div key={cat.category}>
              <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-4 ${cat.color}`}>
                {cat.icon} {cat.category}
              </div>
              <div className="space-y-3">
                {cat.items.map((item, j) => {
                  const key = `${cat.category}-${j}`
                  const open = openIdx === key
                  return (
                    <div key={j} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                      <button onClick={() => setOpenIdx(open ? null : key)}
                        className="w-full flex justify-between items-center p-5 text-left gap-4">
                        <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.q}</span>
                        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {open && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }} className="overflow-hidden">
                            <p className="px-5 pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-slate-800 pt-4">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-3xl p-8 text-center mt-12">
            <Building2 className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
            <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-lg mb-2">Still need help?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Our support team is available 24/7 for urgent operational issues.</p>
            <a href="/contact" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition">
              Contact Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
