"use client"

import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useState } from "react"
import { CheckCircle } from "lucide-react"

export default function Contact(){

  const [success,setSuccess] = useState(false)

  const handleSubmit=(e: { preventDefault: () => void })=>{
    e.preventDefault()

    setSuccess(true)

    setTimeout(()=>{
      setSuccess(false)
    },3000)
  }

  return(
    <>
      <Navbar/>

      <section className="pt-32 pb-20 bg-linear-to-r from-blue-500 to-indigo-600 text-white">

        <div className="max-w-6xl mx-auto px-6">

          <h1 className="text-4xl font-bold text-center mb-12">
            Contact Us
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white text-black p-10 rounded-xl shadow-lg grid gap-6"
          >

            <input
              className="border p-3 rounded"
              placeholder="Your Name"
              required
            />

            <input
              className="border p-3 rounded"
              placeholder="Email"
              required
            />

            <textarea
              className="border p-3 rounded"
              rows='5'
              placeholder="Message"
              required
            />

            <button className="bg-blue-600 text-white py-3 rounded">
              Send Message
            </button>

          </form>

        </div>

      </section>

      <AnimatePresence>

      {success &&(

        <motion.div
          initial={{opacity:0,scale:0.7}}
          animate={{opacity:1,scale:1}}
          exit={{opacity:0}}
          className="fixed top-10 right-10 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
        >

          <CheckCircle/>

          Message Sent Successfully!

        </motion.div>

      )}

      </AnimatePresence>

      <Footer/>
    </>
  )
}