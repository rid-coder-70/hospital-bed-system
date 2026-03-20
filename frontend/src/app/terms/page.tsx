"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { FileText, AlertTriangle, Users, Ban, Scale } from "lucide-react"

const SECTIONS = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "1. Acceptance of Terms",
    content: "By registering for or using HealthBed AI, you agree to be bound by these Terms & Conditions. If you do not agree, you must not use the platform. System administrators, Hospital Admins, and public users are all subject to these terms.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "2. User Accounts & Roles",
    content: "All Hospital Admin registrations are subject to review and approval by the System Administrator before access is granted. You are responsible for maintaining the confidentiality of your credentials. Sharing your account or access tokens with unauthorized persons is strictly prohibited and may result in immediate account termination.",
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "3. Accuracy of Medical Data",
    content: "Hospital Admins are solely responsible for the accuracy of all bed availability data they submit. HealthBed AI provides the infrastructure for data transmission but does not independently verify bed counts. Submitting false capacity data that could result in incorrect emergency routing is a violation of these terms and may have legal consequences.",
  },
  {
    icon: <Ban className="w-5 h-5" />,
    title: "4. Prohibited Conduct",
    content: "You may not attempt to reverse-engineer, exploit, or disrupt the API or WebSocket server infrastructure. Automated scraping of real-time bed data without authorization is prohibited. Any dispatch request submitted with false patient information for testing or malicious purposes is a breach of these terms and may be reported to law enforcement.",
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: "5. Limitation of Liability",
    content: "HealthBed AI provides real-time data as a routing aid and does not guarantee 100% accuracy at all times. We are not liable for any medical outcomes resulting from reliance on the platform's data. The platform is provided 'as is' and we disclaim all warranties to the maximum extent permitted by applicable law in Bangladesh.",
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <section className="pt-32 pb-14 md:pt-44 px-4 bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-950 dark:to-indigo-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Scale className="w-4 h-4" /> Legal
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Terms & Conditions</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm">Last updated: March 20, 2026</motion.p>
        </div>
      </section>
      <main className="flex-1 py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800">
            These Terms & Conditions govern your use of the HealthBed AI platform. Please read them carefully before accessing any part of our service. By using the platform you agree to be legally bound by these terms.
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
