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
  }, [])

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  return (
    <>
      <Navbar />

      <section className="pt-32 pb-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">

        <div className="max-w-7xl mx-auto px-6">

          <motion.h1
            initial={{ opacity:0,y:20 }}
            animate={{ opacity:1,y:0 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Contact Our Team
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-12 items-center">

            <motion.div
              initial={{opacity:0,x:-40}}
              animate={{opacity:1,x:0}}
              className="flex justify-center"
            >
              {animation && (
                <Lottie
                  animationData={animation}
                  loop
                  className="w-87.5"
                />
              )}
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{opacity:0,y:40}}
              animate={{opacity:1,y:0}}
              className="backdrop-blur-lg bg-white/90 text-black p-10 rounded-2xl shadow-2xl grid gap-6"
            >

              <input
                placeholder="Your Name"
                className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <textarea
                rows={5}
                placeholder="Message"
                className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <motion.button
                whileHover={{scale:1.05}}
                whileTap={{scale:0.95}}
                className="bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                <Send size={18}/>
                Send Message
              </motion.button>

            </motion.form>

          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-20">

            <motion.div
              whileHover={{y:-5}}
              className="bg-white/20 backdrop-blur-lg p-6 rounded-xl text-center"
            >
              <Mail className="mx-auto mb-3"/>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm">support@aihealth.com</p>
            </motion.div>

            <motion.div
              whileHover={{y:-5}}
              className="bg-white/20 backdrop-blur-lg p-6 rounded-xl text-center"
            >
              <Phone className="mx-auto mb-3"/>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-sm">+880 123 456 789</p>
            </motion.div>

            <motion.div
              whileHover={{y:-5}}
              className="bg-white/20 backdrop-blur-lg p-6 rounded-xl text-center"
            >
              <MapPin className="mx-auto mb-3"/>
              <h3 className="font-semibold">Location</h3>
              <p className="text-sm">Dhaka, Bangladesh</p>
            </motion.div>

          </div>

        </div>

      </section>

      <AnimatePresence>

        {success && (

          <motion.div
            initial={{opacity:0,scale:0.6}}
            animate={{opacity:1,scale:1}}
            exit={{opacity:0}}
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          >

            <div className="bg-white text-black px-8 py-6 rounded-2xl shadow-xl flex items-center gap-4">

              <CheckCircle className="text-green-500"/>

              <div>
                <h3 className="font-bold">Message Sent!</h3>
                <p className="text-sm text-gray-600">
                  Our team will contact you soon.
                </p>
              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

      <Footer/>
    </>
  )
}