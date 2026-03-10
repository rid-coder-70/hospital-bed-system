"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { LogIn, Building2, UserCircle2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Lottie from "lottie-react"
import { toast } from "react-hot-toast"

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [animation, setAnimation] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginRole, setLoginRole] = useState("user")

  useEffect(() => {
    fetch("/animations/Hospital.json")
      .then(res => res.json())
      .then(data => setAnimation(data))
      .catch(() => setAnimation(null))
  }, [])

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || "Login failed")
      }
      setLoading(false)
      const userData = result.data.user
      const token = result.data.token
      localStorage.setItem('userRole', userData.role)
      localStorage.setItem('authToken', token)
      localStorage.setItem('userData', JSON.stringify(userData))
      toast.success(`Welcome back, ${userData.name}!`)
      window.location.href = (userData.role === 'hospital_admin' || userData.role === 'admin') ? '/dashboard' : '/hospital'
    } catch (err: any) {
      setLoading(false)
      toast.error(err.message || "An error occurred during login")
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <section className="flex-1 grid md:grid-cols-2 bg-white dark:bg-slate-950 pt-16 md:pt-0">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900 dark:from-indigo-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden p-10 min-h-[40vh] md:min-h-screen">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-10 dark:opacity-5 mix-blend-overlay"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="z-10 text-center text-white mb-6 md:mb-10 max-w-md pt-8 md:pt-0"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight drop-shadow-sm">Access Your Portal</h1>
            <p className="text-blue-100 dark:text-gray-300 text-base md:text-lg">Manage your health or hospital operations efficiently and securely.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="z-10 w-full max-w-sm md:max-w-md"
          >
            {animation && <Lottie animationData={animation} loop className="w-full drop-shadow-2xl filter brightness-110 dark:brightness-100" />}
          </motion.div>
        </div>
        <div className="flex items-center justify-center bg-gray-50/50 dark:bg-slate-950 relative py-16 px-4 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-2xl shadow-blue-900/5 dark:shadow-none p-8 sm:p-12 rounded-3xl w-full max-w-md relative z-10"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-16 h-16 bg-blue-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-blue-100 dark:ring-indigo-500/20"
              >
                <LogIn size={32} className="text-blue-600 dark:text-indigo-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2 text-gray-900 dark:text-gray-100 tracking-tight">Welcome Back</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 font-medium text-sm md:text-base">Please enter your credentials.</p>
            <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setLoginRole("user")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${loginRole === "user" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                <UserCircle2 className="w-4 h-4" /> Patient
              </button>
              <button
                type="button"
                onClick={() => setLoginRole("hospital_admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${loginRole === "hospital_admin" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                <Building2 className="w-4 h-4" /> Facility Admin
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={loginRole === "hospital_admin" ? "admin@healthbed.com" : "john@example.com"}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 transition-all font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 transition-all font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div className="flex items-center justify-between pt-2 pb-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 dark:bg-slate-800 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-indigo-500 cursor-pointer" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm font-bold text-blue-600 dark:text-indigo-400 hover:text-blue-800 dark:hover:text-indigo-300 transition-colors">Forgot Password?</a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-600 dark:to-blue-600 text-white py-4 rounded-xl font-bold tracking-wide hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-blue-600/20 dark:shadow-indigo-900/40 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : `Sign In as ${loginRole === 'hospital_admin' ? 'Admin' : 'Patient'}`}
              </button>
              <p className="text-center text-gray-500 dark:text-gray-400 font-medium mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 dark:text-indigo-400 font-bold hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">Create one now</Link>
              </p>
            </form>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  )
}