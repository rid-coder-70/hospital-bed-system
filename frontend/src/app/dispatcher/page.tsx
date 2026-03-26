"use client"

import { useState, useEffect, useCallback } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { ServerCog, Activity, Clock, ShieldCheck, Map as MapIcon, Ambulance, AlertTriangle, Users } from "lucide-react"
import dynamic from "next/dynamic"
import { toast } from "react-hot-toast"
import { useSocket } from "@/components/SocketProvider"

const API = process.env.NEXT_PUBLIC_API_URL || "";


const DispatchMap = dynamic(() => import("@/components/MapComponent"), { ssr: false, loading: () => <div className="h-full w-full bg-slate-200 animate-pulse rounded-2xl flex items-center justify-center">Loading Geospatial Data...</div> })

export default function DispatcherDashboard() {
  const { connected } = useSocket()
  const [isAdminOrDispatcher, setIsAdminOrDispatcher] = useState(false)
  const [hospitals, setHospitals] = useState([])
  const [ambulances, setAmbulances] = useState([])
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken')
      const headers = { "Authorization": `Bearer ${token}` }

      const [hospRes, ambRes, reqRes] = await Promise.all([
        fetch(`${API}/api/hospitals?limit=100`),
        fetch(`${API}/api/ambulance/fleet`, { headers }),
        fetch(`${API}/api/ambulance/requests?limit=50`, { headers })
      ])

      const hData = await hospRes.json()
      const aData = await ambRes.json()
      const rData = await reqRes.json()

      setHospitals(hData.data || [])
      setAmbulances(aData.data || [])
      setRequests(rData.data || [])
    } catch (err) {
      toast.error("Failed to load dispatch data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role !== 'admin' && role !== 'dispatcher') {
      window.location.href = '/auth/login'
    } else {
      setIsAdminOrDispatcher(true)
      fetchData()
      

      const interval = setInterval(fetchData, 30000)
      return () => clearInterval(interval)
    }
  }, [fetchData])

  if (!isAdminOrDispatcher) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-gray-500">Checking authorization...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-32 pb-24 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
              <MapIcon className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />
              Emergency Dispatch Command
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base md:text-lg">Oversee active ambulances and critical medical routing.</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="h-[500px] w-full bg-gray-200 dark:bg-slate-800 animate-pulse rounded-3xl" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-xl border border-gray-100 dark:border-slate-800 h-[500px] lg:h-[700px] relative overflow-hidden"
            >
              <DispatchMap hospitals={hospitals} ambulances={ambulances} requests={requests} />
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col h-[500px] lg:h-[700px]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <Activity className="text-amber-500 w-5 h-5 md:w-6 md:h-6" /> Live Requests
                </h3>
                <span className="font-black bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm">
                  {requests.filter(r => r.status === 'pending' || r.status === 'dispatched').length} Active
                </span>
              </div>
              <div className="flex-1 overflow-auto space-y-4 pr-1">
                {requests.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <ShieldCheck className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">All clear. No active emergencies.</p>
                  </div>
                ) : requests.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-sm truncate flex items-center gap-2">
                         {req.priority === 'critical' ? <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /> : <Clock className="w-4 h-4 text-orange-500" />}
                         {req.patient_name || 'Unknown Patient'}
                       </h4>
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide
                         ${req.status === 'pending' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                           req.status === 'dispatched' ? 'bg-blue-100 text-blue-700' :
                           'bg-emerald-100 text-emerald-700'}
                       `}>
                         {req.status}
                       </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{req.required_icu ? '🚨 Requires ICU Unit' : 'General Transport'}</p>
                    <div className="flex justify-between text-xs mt-3 pt-3 border-t border-gray-200 dark:border-slate-700 font-semibold text-gray-600 dark:text-gray-300">
                      <span>Amb: {req.vehicle_number || 'None'}</span>
                      <span>Hosp: {req.hospital_name || 'Unassigned'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
