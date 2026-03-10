"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Bed, Activity, Phone, ShieldPlus, ChevronRight, CheckCircle2, XCircle, Navigation, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "react-hot-toast"

export default function HospitalPage() {
  const [hospitals, setHospitals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/hospitals")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setHospitals(data.data || [])
      } catch (err) {
        setHospitals([
          {
            id: "1",
            name: "Dhaka Medical College Hospital",
            address: "Dhaka Medical College Rd, Dhaka 1000",
            totalBeds: 2400,
            availableBeds: 120,
            icuBeds: 120,
            availableIcuBeds: 8,
            contact: { phone: "+880-2-55165088" },
            specialties: ["General", "ICU", "Cardiology"]
          },
          {
            id: "2",
            name: "Square Hospital",
            address: "18/F Bir Uttam Sarak, Dhaka",
            totalBeds: 400,
            availableBeds: 45,
            icuBeds: 40,
            availableIcuBeds: 0,
            contact: { phone: "+880-2-8159457" },
            specialties: ["Cardiology", "Oncology"]
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchHospitals()
  }, [])
  const handleNearMe = () => {
    setIsLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location: ", error)
          toast.error("Couldn't retrieve your location. Please check your permissions.")
          setIsLocating(false)
        }
      )
    } else {
      toast.error("Geolocation is not supported by your browser.")
      setIsLocating(false)
    }
  }
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  const sortedHospitals = [...hospitals].sort((a, b) => {
    if (userLocation && a.location?.lat && b.location?.lat) {
      const distA = getDistance(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng)
      const distB = getDistance(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng)
      return distA - distB
    }
    return 0
  })
  const filteredHospitals = sortedHospitals.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.specialties?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  const container: any = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
  const card: any = { hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-32 pb-24 md:pb-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-[88px] md:top-0 z-40 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md pt-4 pb-4 border-b border-transparent dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 tracking-tight">
              Patient Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base md:text-lg">Locate and connect with nearby care facilities.</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search facilities or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-32 py-3.5 md:py-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:shadow-md outline-none transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNearMe}
                disabled={isLocating}
                className={`flex items-center gap-1.5 px-3 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm
                  ${userLocation 
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' 
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
              >
                {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                <span className="hidden sm:inline">{userLocation ? 'Sorted by Near' : 'Near Me'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden relative">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/5 to-transparent z-10"></div>
                <div className="flex items-start justify-between mb-4">
                  <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4 mb-2 animate-pulse"></div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-800 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-full mb-6 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="h-28 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                  <div className="h-28 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-1/2 mt-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence>
              {filteredHospitals.map((hospital) => {
                const hasGenBeds = hospital.availableBeds > 0;
                const hasIcuBeds = hospital.availableIcuBeds > 0;
                return (
                  <motion.div
                    key={hospital.id}
                    variants={card}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-7 shadow-sm border border-gray-100/80 dark:border-slate-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 flex flex-col group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50/80 dark:from-blue-900/10 to-transparent rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-start justify-between mb-3 text-left">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate pr-4 leading-tight">
                        {hospital.name}
                      </h3>
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <ShieldPlus className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-gray-500 dark:text-gray-400 mb-6 text-sm bg-gray-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800 text-left">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                      <span className="line-clamp-2 leading-relaxed">{hospital.address || "Location unavailable"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 text-left">
                      <div className={`rounded-2xl p-3.5 md:p-4 border relative overflow-hidden group/stat transition-colors ${
                        hasGenBeds 
                          ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/5 dark:border-blue-800/30' 
                          : 'bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700'
                      }`}>
                        <div className="absolute -right-2 -bottom-2 opacity-5 scale-150 transform transition-transform group-hover/stat:scale-110">
                          <Bed className={`w-20 h-20 ${hasGenBeds ? 'text-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-gray-300'}`} />
                        </div>
                        <div className={`flex items-center justify-between mb-2 relative z-10 ${hasGenBeds ? 'text-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          <div className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4" />
                            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-90 truncate">Gen Ward</span>
                          </div>
                          {hasGenBeds ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className="flex items-baseline gap-1 relative z-10">
                          <span className={`text-2xl md:text-3xl font-black ${hasGenBeds ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{hospital.availableBeds}</span>
                          <span className={`text-xs md:text-sm font-semibold ${hasGenBeds ? 'text-blue-500/80 dark:text-blue-500' : 'text-gray-400'}`}>/ {hospital.totalBeds}</span>
                        </div>
                      </div>
                      <div className={`rounded-2xl p-3.5 md:p-4 border relative overflow-hidden group/stat transition-colors ${
                        hasIcuBeds 
                          ? 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100/50 dark:from-rose-900/10 dark:to-rose-900/5 dark:border-rose-800/30' 
                          : 'bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700'
                      }`}>
                        <div className="absolute -right-2 -bottom-2 opacity-5 scale-150 transform transition-transform group-hover/stat:scale-110">
                          <Activity className={`w-20 h-20 ${hasIcuBeds ? 'text-rose-900 dark:text-rose-300' : 'text-gray-900 dark:text-gray-300'}`} />
                        </div>
                        <div className={`flex items-center justify-between mb-2 relative z-10 ${hasIcuBeds ? 'text-rose-900 dark:text-rose-400' : 'text-gray-600 dark:text-gray-400'}`}>
                           <div className="flex items-center gap-1.5">
                            <Activity className="w-4 h-4" />
                            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-90 truncate">ICU Unit</span>
                          </div>
                          {hasIcuBeds ? <CheckCircle2 className="w-4 h-4 text-rose-500" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className="flex items-baseline gap-1 relative z-10">
                          <span className={`text-2xl md:text-3xl font-black ${hasIcuBeds ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400 dark:text-gray-500'}`}>{hospital.availableIcuBeds}</span>
                          <span className={`text-xs md:text-sm font-semibold ${hasIcuBeds ? 'text-rose-500/80 dark:text-rose-500' : 'text-gray-400'}`}>/ {hospital.icuBeds}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4 md:pt-5 border-t border-gray-100 dark:border-slate-800 text-left">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-700">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="font-medium">{hospital.contact?.phone || "N/A"}</span>
                      </div>
                      <Link href={`/hospital/${hospital.id}`}>
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-sm font-bold hover:text-blue-800 dark:hover:text-blue-300 transition-colors group/btn p-2"
                          aria-label={`View Details for ${hospital.name}`}
                        >
                          Learn More
                          <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {filteredHospitals.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-16 md:py-24 text-gray-500 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-300 dark:border-slate-700 text-center px-4"
              >
                <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">No facilities found</h3>
                <p className="text-gray-500 dark:text-gray-400">We couldn't find any hospitals matching "{searchTerm}"</p>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm("")}
                  className="mt-6 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-slate-700 px-6 py-2.5 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Clear search filters
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  )
}
