"use client"

import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useState, useEffect } from "react"
import Lottie from "lottie-react"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"

export default function Contact() {
  const [success, setSuccess] = useState(false)
  const [animation, setAnimation] = useState(null)
  useEffect(() => {
    fetch("/animations/Doctor.json")
      .then(res => res.json())
      .then(data => setAnimation(data))
      .catch(() => console.log('Animation asset not available'))
  }, [])
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }
  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <section className="flex-1 pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-900 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.h1
            initial={{ opacity:0,y:20 }}
            animate={{ opacity:1,y:0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-16 tracking-tight drop-shadow-sm"
          >
            Dispatch & Support Operations
          </motion.h1>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{opacity:0,x:-40}}
              animate={{opacity:1,x:0}}
              className="flex justify-center"
            >
              <div className="bg-white/10 dark:bg-indigo-500/10 backdrop-blur-md rounded-full shadow-2xl p-10 ring-1 ring-white/20 dark:ring-indigo-400/20 shadow-black/20 dark:shadow-indigo-900/40 w-full max-w-[400px] aspect-square flex items-center justify-center">
                {animation ? (
                  <Lottie animationData={animation} loop className="w-full scale-125 saturate-150 filter drop-shadow-2xl" />
                ) : (
                  <span className="opacity-50 font-bold uppercase tracking-widest text-center italic">Waiting for connection...</span>
                )}
              </div>
            </motion.div>
            <motion.form
              onSubmit={handleSubmit}
              initial={{opacity:0,y:40}}
              animate={{opacity:1,y:0}}
              className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 text-gray-900 dark:text-gray-100 p-10 sm:p-12 rounded-3xl shadow-2xl shadow-black/20 grid gap-6 ring-1 ring-white/50 dark:ring-slate-700/50"
            >
              <div className="mb-2">
                 <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-400 dark:to-blue-400">
                   Contact Command Center
                 </h2>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Submit tickets directly to our telemetery team for manual review.</p>
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                 <input
                  placeholder="John Doe"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:ring-indigo-500/40 transition-all font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400"
                  required
                 />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  placeholder="john@hospital.com"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:ring-indigo-500/40 transition-all font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400"
                  required
                />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 block">Secure Message</label>
                <textarea
                  rows={4}
                  placeholder="How can we assist you today?"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:ring-indigo-500/40 transition-all font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400"
                  required
                />
              </div>
              <motion.button
                whileHover={{scale:1.02}}
                whileTap={{scale:0.95}}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-600 dark:to-blue-600 text-white py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 dark:shadow-indigo-500/20 mt-2 hover:shadow-xl transition-all"
              >
                Send Encrypted Payload
                <Send size={18} className="mt-0.5 ml-1" />
              </motion.button>
            </motion.form>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <motion.div
              whileHover={{y:-8}}
              className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl text-center border border-white/20 dark:border-slate-700 shadow-xl"
            >
              <div className="w-14 h-14 mx-auto bg-blue-50 dark:bg-indigo-500/20 text-blue-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Technical Support</h3>
              <p className="text-blue-100 dark:text-gray-400">help@healthbed.ai</p>
            </motion.div>
            <motion.div
              whileHover={{y:-8}}
              className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl text-center border border-white/20 dark:border-slate-700 shadow-xl"
            >
              <div className="w-14 h-14 mx-auto bg-blue-50 dark:bg-indigo-500/20 text-blue-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6">
                 <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Emergency Hotline</h3>
              <p className="text-blue-100 dark:text-gray-400">+880 (9) 999 1234</p>
            </motion.div>
            <motion.div
              whileHover={{y:-8}}
              className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl text-center border border-white/20 dark:border-slate-700 shadow-xl"
            >
               <div className="w-14 h-14 mx-auto bg-blue-50 dark:bg-indigo-500/20 text-blue-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Command Node</h3>
              <p className="text-blue-100 dark:text-gray-400">Dhaka North Block, BD</p>
            </motion.div>
          </div>
        </div>
      </section>
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{opacity:0, scale:0.95}}
            animate={{opacity:1, scale:1}}
            exit={{opacity:0}}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 px-4"
          >
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white px-8 md:px-10 py-8 rounded-3xl shadow-2xl flex items-center gap-6 max-w-md w-full">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center shrink-0">
                 <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold tracking-tight text-xl mb-1">Payload Sent!</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  We have successfully logged your secure message.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer/>
    </div>
  )
}