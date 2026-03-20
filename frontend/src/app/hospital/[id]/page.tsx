"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Phone, Mail, Bed, Activity, History, Clock, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Navigation, X } from "lucide-react"
import Link from "next/link"
import { toast } from "react-hot-toast"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function HospitalDetailsPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const [hospital, setHospital] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dispatchLoading, setDispatchLoading] = useState(false)
  const [dispatchResult, setDispatchResult] = useState<any[] | null>(null)
  const [showDispatch, setShowDispatch] = useState(false)

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await fetch(`${API}/api/hospitals/${id}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setHospital(data.data)
      } catch (err) {
        console.error("Error fetching hospital", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchHospital()
  }, [id])

  const handleSimulateDispatch = async () => {
    if (!hospital?.location?.lat) {
      toast.error("Hospital location not available for routing")
      return
    }
    setDispatchLoading(true)
    setShowDispatch(true)
    try {
      const res = await fetch(`${API}/api/beds/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientLocation: hospital.location,
          requiredIcu: hospital.availableIcuBeds === 0,
          priority: "high"
        })
      })
      if (!res.ok) throw new Error("Routing failed")
      const data = await res.json()
      setDispatchResult(data.data?.top_recommendations || [])
      toast.success("AI routing complete!")
    } catch (err: any) {
      toast.error(err.message || "AI routing service unavailable")
      setShowDispatch(false)
    } finally {
      setDispatchLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
        <Navbar />
        <main className="flex-1 pt-32 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    )
  }
  if (!hospital) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
        <Navbar />
        <main className="flex-1 pt-32 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col items-center justify-center text-center">
          <XCircle className="w-20 h-20 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Hospital Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">The facility you are looking for does not exist or has been removed.</p>
          <Link href="/hospital" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Back to Directory
          </Link>
        </main>
        <Footer />
      </div>
    )
  }
  const hasGenBeds = hospital.availableBeds > 0
  const hasIcuBeds = hospital.availableIcuBeds > 0
  const genLoad = Math.max(0, 100 - (hospital.availableBeds / Math.max(1, hospital.totalBeds)) * 100).toFixed(1)
  const icuLoad = Math.max(0, 100 - (hospital.availableIcuBeds / Math.max(1, hospital.icuBeds)) * 100).toFixed(1)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-32 pb-24 md:pb-16 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <Link href="/hospital">
          <motion.div 
            whileHover={{ x: -4 }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-8 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </motion.div>
        </Link>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden mb-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-transparent rounded-bl-full -z-10 opacity-70"></div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                  Verified Facility
                </span>
                {!hospital.isActive && (
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Inactive
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                {hospital.name}
              </h1>
              <div className="flex flex-col gap-3 text-gray-600 dark:text-gray-400">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-gray-400 dark:text-gray-500" />
                    <span className="text-base md:text-lg">{hospital.address || "Address unavailable"}</span>
                  </div>
                  {hospital.location?.lat && (
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm font-bold rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Navigate
                    </a>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <span className="font-medium">{hospital.contact?.phone || "N/A"}</span>
                  </div>
                  {hospital.contact?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <span className="font-medium">{hospital.contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:max-w-xs shrink-0 pt-2">
              {hospital.specialties?.length > 0 ? (
                 hospital.specialties.map((spec: string, i: number) => (
                  <span key={i} className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {spec}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400 italic">No specialties listed</span>
              )}
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border ${hasGenBeds ? 'border-blue-100 dark:border-blue-900/30 shadow-lg shadow-blue-500/5' : 'border-gray-200 dark:border-slate-800 opacity-80'} relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 w-2 h-full ${hasGenBeds ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3 text-blue-900 dark:text-blue-400">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Bed className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">General Ward Capacity</h3>
              </div>
              {hasGenBeds ? (
                 <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                   <CheckCircle2 className="w-4 h-4" /> Available
                 </span>
              ) : (
                 <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                   <XCircle className="w-4 h-4" /> Full
                 </span>
              )}
            </div>
            <div className="flex items-end gap-3 mb-6">
              <span className={`text-6xl font-black ${hasGenBeds ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}`}>
                {hospital.availableBeds}
              </span>
              <span className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-1">
                / {hospital.totalBeds} empty
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner mb-2">
               <div 
                  className={`h-full rounded-full transition-all duration-1000 ${hasGenBeds ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-red-500'}`}
                  style={{ width: `${genLoad}%` }}
               ></div>
            </div>
            <p className="text-xs text-right font-medium text-gray-500 dark:text-gray-400">
              {genLoad}% Full
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border ${hasIcuBeds ? 'border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-500/5' : 'border-gray-200 dark:border-slate-800 opacity-80'} relative overflow-hidden`}
          >
             <div className={`absolute top-0 right-0 w-2 h-full ${hasIcuBeds ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3 text-rose-900 dark:text-rose-400">
                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Intensive Care (ICU)</h3>
              </div>
              {hasIcuBeds ? (
                 <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                   <CheckCircle2 className="w-4 h-4" /> Available
                 </span>
              ) : (
                 <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                   <AlertTriangle className="w-4 h-4" /> Full
                 </span>
              )}
            </div>
            <div className="flex items-end gap-3 mb-6">
              <span className={`text-6xl font-black ${hasIcuBeds ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}`}>
                {hospital.availableIcuBeds}
              </span>
              <span className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-1">
                / {hospital.icuBeds} empty
              </span>
            </div>
             <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner mb-2">
               <div 
                  className={`h-full rounded-full transition-all duration-1000 ${hasIcuBeds ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-red-500'}`}
                  style={{ width: `${icuLoad}%` }}
               ></div>
            </div>
            <p className="text-xs text-right font-medium text-gray-500 dark:text-gray-400">
              {icuLoad}% Full
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <History className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Live Capacity Audit Log</h3>
            </div>
            <div className="space-y-4">
              {hospital.recentEvents?.length > 0 ? (
                hospital.recentEvents.map((event: any, idx: number) => {
                  const genChanged = event.new_available !== event.prev_available
                  const icuChanged = event.new_icu_available !== event.prev_icu_available
                  return (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                      <div className="mt-1">
                        <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          Capacity updated.
                          {genChanged && (
                             <span className="block mt-1">
                               General Ward: <span className="font-bold line-through text-gray-400 mx-1">{event.prev_available}</span> 
                               → <span className={`font-bold mx-1 ${event.new_available > event.prev_available ? 'text-emerald-500' : 'text-rose-500'}`}>{event.new_available}</span>
                             </span>
                          )}
                          {icuChanged && (
                             <span className="block mt-1">
                               ICU Unit: <span className="font-bold line-through text-gray-400 mx-1">{event.prev_icu_available}</span> 
                               → <span className={`font-bold mx-1 ${event.new_icu_available > event.prev_icu_available ? 'text-emerald-500' : 'text-rose-500'}`}>{event.new_icu_available}</span>
                             </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                  <p>No recent capacity modifications found.</p>
                </div>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-indigo-600 dark:bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-600/20"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay"></div>
            <ShieldCheck className="w-12 h-12 mb-6 text-indigo-300" />
            <h3 className="text-2xl font-bold mb-4">Emergency Processing</h3>
            <p className="text-indigo-100 mb-8 leading-relaxed">
              This facility is connected to the HealthBed AI autonomous routing protocol. Simulate an emergency dispatch to see AI-ranked hospital recommendations based on distance and bed availability.
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSimulateDispatch}
              disabled={dispatchLoading}
              className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-4 rounded-xl shadow-lg transition-colors active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {dispatchLoading ? (
                <><span className="animate-spin border-2 border-indigo-400 border-t-indigo-700 rounded-full w-5 h-5"></span> Running AI Routing...</>
              ) : (
                <><Navigation className="w-5 h-5" /> Simulate Dispatch Request</>
              )}
            </motion.button>
          </motion.div>
        </div>
      </main>
      <Footer />

      {}
      <AnimatePresence>
        {showDispatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !dispatchLoading && setShowDispatch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-slate-700 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-indigo-500" /> AI Routing Results
                </h3>
                <button onClick={() => setShowDispatch(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {dispatchLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-medium">Computing optimal routes...</p>
                </div>
              ) : dispatchResult && dispatchResult.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Top {dispatchResult.length} hospitals ranked by AI score (distance + bed availability):</p>
                  {dispatchResult.map((h: any, i: number) => (
                    <div key={h.id} className={`p-4 rounded-2xl border ${i === 0 ? 'border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}>#{i + 1}</span>
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{h.name}</h4>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded-lg">Score: {(h.score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400 mt-2">
                        <div className="text-center bg-white dark:bg-slate-900 rounded-xl p-2 border border-gray-200 dark:border-slate-700">
                          <p className="font-black text-lg text-blue-600 dark:text-blue-400">{h.available_beds}</p>
                          <p>Gen Beds</p>
                        </div>
                        <div className="text-center bg-white dark:bg-slate-900 rounded-xl p-2 border border-gray-200 dark:border-slate-700">
                          <p className="font-black text-lg text-rose-600 dark:text-rose-400">{h.available_icu_beds}</p>
                          <p>ICU Beds</p>
                        </div>
                        <div className="text-center bg-white dark:bg-slate-900 rounded-xl p-2 border border-gray-200 dark:border-slate-700">
                          <p className="font-black text-lg text-emerald-600 dark:text-emerald-400">{h.eta_minutes}m</p>
                          <p>ETA</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <XCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No available hospitals found for routing.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
