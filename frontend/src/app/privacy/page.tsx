"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { Shield, Lock, Eye, Server, Mail } from "lucide-react"

const SECTIONS = [
  {
    icon: <Eye className="w-5 h-5" />,
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you create an account (name, email address, role), when hospital administrators update bed inventory data, and when dispatchers submit emergency dispatch requests. We also collect usage data such as log timestamps, IP addresses, and browser identifiers to maintain system security and reliability.`,
  },
  {
    icon: <Server className="w-5 h-5" />,
    title: "2. How We Use Your Data",
    content: `Your data is used exclusively to operate the HealthBed AI platform. This includes authenticating your account sessions using JSON Web Tokens (JWT), routing emergency ambulance dispatches to the correct hospital admin, and displaying anonymized bed availability statistics on the public hospital directory. We do not sell, lease, or share your data with third parties for marketing purposes.`,
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "3. Data Security",
    content: `All sensitive data (passwords, tokens) is protected using bcrypt hashing and AES encryption. All data in transit is secured via HTTPS/WSS (TLS 1.3). Database access is controlled by role-based policies and all bed reservation transactions use pessimistic locking (PostgreSQL FOR UPDATE) to prevent data races. We follow OWASP security best practices in all API endpoint validation using Zod schema enforcement.`,
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "4. Role-Based Data Access",
    content: `Access to data is strictly role-gated. Patients (public users) can only read anonymized hospital bed counts. Hospital Admins can only read and write data for their specifically assigned hospital. System Administrators have full read access and approval authority. All requests are validated at the backend API middleware layer using JWT role claims.`,
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "5. Your Rights & Contact",
    content: `You may request access to, correction of, or deletion of your personal data at any time by contacting support@healthbed.ai. We will respond within 72 hours. Hospital Admin accounts may be deactivated by the System Administrator at any time. All associated patient-linked data is anonymised upon account deletion.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <section className="pt-32 pb-14 md:pt-44 px-4 bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-950 dark:to-indigo-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" /> Legal
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Privacy Policy</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm">Last updated: March 20, 2026</motion.p>
        </div>
      </section>

      <main className="flex-1 py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800">
            HealthBed AI ("we", "our", or "us") is committed to protecting the privacy of all users of the platform. This Privacy Policy explains how we collect, use, and safeguard your information when you use our hospital bed management and emergency dispatch services. By using our platform, you agree to the terms outlined here.
          </p>
          {SECTIONS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">{s.icon}</div>
                <h2 className="font-extrabold text-gray-900 dark:text-gray-100">{s.title}</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.content}</p>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
