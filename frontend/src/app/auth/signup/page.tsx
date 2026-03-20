"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Building2, UserCircle2, ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Lottie from "lottie-react"
import { toast } from "react-hot-toast"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type SignupRole = "user" | "hospital_admin"

export default function SignupPage() {
  const [animation, setAnimation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [signupRole, setSignupRole] = useState<SignupRole>("user")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [hospitals, setHospitals] = useState<any[]>([])
  const [selectedHospital, setSelectedHospital] = useState("")

  useEffect(() => {
    fetch("/animations/Hospital.json")
      .then(res => res.json())
      .then(data => setAnimation(data))
      .catch(() => setAnimation(null))
    

    fetch(`${API}/api/hospitals?limit=100`)
      .then(res => res.json())
      .then(data => setHospitals(data.data || []))
      .catch(() => {})
  }, [])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) { toast.error("Passwords do not match!"); return }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: signupRole,
          hospitalId: signupRole === "hospital_admin" ? (selectedHospital || undefined) : undefined
        })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Signup failed")
      // Hospital admin accounts are pending approval
      if (result.data?.pending) {
        toast.success("Application submitted! Awaiting admin approval.", { duration: 5000 })
        window.location.href = "/auth/pending"
        return
      }
      toast.success("Account created! Please log in.")
      window.location.href = "/auth/login"
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <section className="flex-1 grid md:grid-cols-2 bg-white dark:bg-slate-950 pt-16 md:pt-0">
        {}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 dark:from-indigo-900 dark:via-purple-900 dark:to-slate-900 relative overflow-hidden p-10 min-h-[40vh] md:min-h-screen">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-15 dark:opacity-5 mix-blend-overlay" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="z-10 text-center text-white mb-6 md:mb-10 max-w-md pt-8 md:pt-0"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight drop-shadow-sm">Join HealthBed AI</h1>
            <p className="text-indigo-100 dark:text-gray-300 text-base md:text-lg">Register as a Patient to find nearby hospital beds, or as a Hospital Admin to manage your facility&apos;s real-time inventory.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="z-10 w-full max-w-sm md:max-w-md"
          >
            {animation && <Lottie animationData={animation} loop className="w-full drop-shadow-2xl filter brightness-110 hue-rotate-15 dark:brightness-100" />}
          </motion.div>
        </div>

        {}
        <div className="flex items-center justify-center bg-gray-50/50 dark:bg-slate-950 relative py-16 px-4 md:py-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-2xl shadow-indigo-900/5 dark:shadow-none p-8 sm:p-12 rounded-3xl w-full max-w-[440px] relative z-10"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center shadow-inner border border-blue-100 dark:border-indigo-500/20"
              >
                <UserPlus size={32} className="text-indigo-600 dark:text-blue-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2 text-gray-900 dark:text-gray-100 tracking-tight">Create Account</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 font-medium text-sm">Choose your role and complete the form below.</p>

            {}
            <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl">
              <button type="button" onClick={() => setSignupRole("user")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${signupRole === "user" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-100 dark:ring-blue-500/20" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                <UserCircle2 className="w-4 h-4" /> Patient
              </button>
              <button type="button" onClick={() => setSignupRole("hospital_admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${signupRole === "hospital_admin" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-500/20" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                <Building2 className="w-4 h-4" /> Hospital Admin
              </button>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {}
              <AnimatePresence mode="popLayout">
                {signupRole === "hospital_admin" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Your Hospital <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <select
                        required={signupRole === "hospital_admin"}
                        value={selectedHospital}
                        onChange={(e) => setSelectedHospital(e.target.value)}
                        className="w-full appearance-none bg-indigo-50/50 dark:bg-slate-950 border border-indigo-100 dark:border-slate-800 p-4 pr-10 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-800 dark:text-gray-100"
                      >
                        <option value="">— Choose your hospital —</option>
                        {hospitals.map((h) => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1 font-medium">You will only be able to manage this hospital&apos;s bed inventory.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 transition-all font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 transition-all font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 transition-all font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password"
                  className={`w-full bg-gray-50 dark:bg-slate-950 border p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 transition-all font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 ${confirmPassword && password !== confirmPassword ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-slate-800"}`} />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 font-medium">Passwords do not match</p>
                )}
              </div>
              <div className="pt-2">
                <button type="submit" disabled={loading}
                  className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold tracking-wide hover:from-indigo-700 hover:to-blue-700 focus:ring-4 focus:ring-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? "Registering..." : `Create ${signupRole === "hospital_admin" ? "Hospital Admin" : "Patient"} Account`}
                  {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
              <p className="text-center text-gray-500 dark:text-gray-400 font-medium mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-indigo-600 dark:text-blue-400 font-bold hover:text-blue-600 transition-colors">Log In Here</Link>
              </p>
            </form>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  )
}