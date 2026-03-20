"use client"

import { useState, useEffect, useCallback } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useSocket } from "@/components/SocketProvider"
import { motion } from "framer-motion"
import { Building2, Bed, Activity, Save, Wifi, WifiOff, Clock, Download, Plus, Minus, AlertTriangle } from "lucide-react"
import { toast } from "react-hot-toast"
import CountUp from "react-countup"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Hospital {
  id: string
  name: string
  address: string
  totalBeds: number
  availableBeds: number
  icuBeds: number
  availableIcuBeds: number
  wardDetails?: any[]
  lastUpdated: string
  isActive: boolean
}

export default function HospitalAdminPage() {
  const { bedUpdates, connected, dispatchEvents } = useSocket()
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [inventory, setInventory] = useState({ general: 0, icu: 0 })
  const [wardDetails, setWardDetails] = useState<any[]>([])
  const [showAddWard, setShowAddWard] = useState(false)
  const [newWard, setNewWard] = useState({ name: "Maternity", available: 0, max: 10 })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [historyEvents, setHistoryEvents] = useState<any[]>([])
  const [dispatches, setDispatches] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState<any>(null)

  const fetchMyHospital = useCallback(async (hospitalId: string, token: string) => {
    try {
      const res = await fetch(`${API}/api/hospitals/${hospitalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Hospital not found")
      const data = await res.json()
      const h = data.data
      setHospital(h)
      setInventory({ general: h.availableBeds, icu: h.availableIcuBeds })
      setWardDetails(h.wardDetails || [])
      fetchHistory(hospitalId, token)
      fetchDispatches(hospitalId, token)
    } catch {
      toast.error("Could not load your hospital data")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchHistory = useCallback(async (hospitalId: string, token: string) => {
    try {
      const res = await fetch(`${API}/api/beds/history/${hospitalId}?limit=15`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setHistoryEvents(data.data || [])
    } catch {}
  }, [])

  const fetchDispatches = useCallback(async (hospitalId: string, token: string) => {
    try {
      const res = await fetch(`${API}/api/dispatches/${hospitalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setDispatches(data.data || [])
    } catch {}
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem("userData")
    const token  = localStorage.getItem("authToken")
    const role   = localStorage.getItem("userRole")

    if (!token || (role !== "hospital_admin" && role !== "admin")) {
      window.location.href = "/auth/login"
      return
    }
    if (!stored) { window.location.href = "/auth/login"; return }

    const user = JSON.parse(stored)
    setUserInfo(user)

    if (!user.hospital_id) {
      toast.error("Your account has no hospital assigned. Contact the system administrator.")
      setLoading(false)
      return
    }
    fetchMyHospital(user.hospital_id, token)
  }, [fetchMyHospital])


  useEffect(() => {
    if (bedUpdates.length === 0) return
    setHospital(prev => {
      if (!prev) return prev
      const relevant = bedUpdates.find(u => u.hospitalId === prev.id)
      if (!relevant) return prev
      if (relevant.wardDetails) {
        setWardDetails(relevant.wardDetails)
      }
      return {
        ...prev,
        availableBeds: relevant.availableBeds,
        availableIcuBeds: relevant.availableIcuBeds,
        lastUpdated: relevant.lastUpdated
      }
    })
  }, [bedUpdates])

  useEffect(() => {
    if (!hospital || dispatchEvents.length === 0) return;
    const myNewEvents = dispatchEvents.filter(d => d.hospital_id === hospital.id);
    if (myNewEvents.length === 0) return;

    // Collect new (never-seen) events for toasting — do this OUTSIDE setState
    const newIncoming: any[] = [];

    setDispatches(prev => {
      let copy = [...prev];
      let changed = false;
      myNewEvents.forEach(evt => {
        const idx = copy.findIndex(existing => existing.id === evt.id);
        if (idx > -1) {
           if (JSON.stringify(copy[idx]) !== JSON.stringify(evt)) { copy[idx] = evt; changed = true; }
        } else {
           copy = [evt, ...copy];
           changed = true;
           if (evt.status === 'incoming') newIncoming.push(evt);
        }
      });
      return changed ? copy : prev;
    });

    // Fire toasts OUTSIDE the setState updater
    newIncoming.forEach(evt => {
      toast.custom(
        <div className="bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 animate-pulse shrink-0" />
          <div>
            <h4 className="font-bold text-lg leading-tight">INCOMING DISPATCH</h4>
            <p className="text-sm opacity-90">{evt.patient_name} — ETA: {evt.eta_minutes}m</p>
          </div>
        </div>,
        { duration: 8000 }
      );
    });
  }, [dispatchEvents, hospital?.id])

  const handleAdjust = (type: "general" | "icu", op: "add" | "sub") => {
    setInventory(prev => ({
      ...prev,
      [type]: op === "add" ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }))
  }

  const handleAdjustWard = (index: number, op: "add" | "sub") => {
    setWardDetails(prev => {
      const copy = [...prev]
      if (op === "add") {
        copy[index].available = Math.min(copy[index].max, copy[index].available + 1)
      } else {
        copy[index].available = Math.max(0, copy[index].available - 1)
      }
      return copy;
    })
  }

  const handleAddCustomWard = () => {
    if (newWard.max <= 0) return toast.error("Max capacity must be at least 1");
    if (wardDetails.find(w => w.name === newWard.name)) return toast.error("Ward already exists");
    setWardDetails(prev => [...prev, newWard])
    setShowAddWard(false)
  }

  const handleSave = async () => {
    if (!hospital) return
    setSaving(true)
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`${API}/api/beds/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          hospitalId: hospital.id,
          availableBeds: inventory.general,
          availableIcuBeds: inventory.icu,
          wardDetails: wardDetails
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Update failed")
      }
      toast.success("✅ Bed inventory updated in real-time!")
      fetchHistory(hospital.id, localStorage.getItem("authToken")!)
    } catch (err: any) {
      toast.error(err.message || "Update failed")
    } finally {
      setSaving(false)
    }
  }

  const handleReserveBed = async (dispatchId: string) => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`${API}/api/dispatches/${dispatchId}/reserve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Reservation failed")
      }
      toast.success("✅ Bed Locked & Reserved!")
      // Fetch will happen via sockets, but let's manual update
      fetchDispatches(hospital?.id!, token!)
      fetchMyHospital(hospital?.id!, token!)
    } catch(err: any) {
      toast.error(err.message || "Failed to reserve bed")
    }
  }

  const handleDispatchStatus = async (dispatchId: string, status: string) => {
    try {
      const token = localStorage.getItem("authToken")
      await fetch(`${API}/api/dispatches/${dispatchId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      })
      toast.success(`Dispatch marked as ${status}`)
      fetchDispatches(hospital?.id!, token!)
    } catch(err) {
      toast.error("Action failed")
    }
  }

  const handleExport = () => {
    const rows = [
      ["Timestamp", "Prev General", "New General", "Prev ICU", "New ICU"],
      ...historyEvents.map(e => [
        new Date(e.timestamp).toISOString(),
        e.prev_available, e.new_available, e.prev_icu_available, e.new_icu_available
      ])
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href = url; a.download = `bed-history-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
    toast.success("Log exported!")
  }

  const occupancy = hospital ? Math.round(((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100) : 0
  const icuOccupancy = hospital ? Math.round(((hospital.icuBeds - hospital.availableIcuBeds) / hospital.icuBeds) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 pt-24 md:pt-32 pb-24 md:pb-16 px-4 max-w-7xl mx-auto w-full space-y-8">
           <div className="h-16 w-1/3 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             {[1,2,3,4].map(idx => (
               <div key={idx} className="h-32 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
                  <div className="w-1/2 h-4 bg-gray-200 dark:bg-slate-800 rounded mt-2"></div>
                  <div className="w-3/4 h-8 bg-gray-200 dark:bg-slate-800 rounded mt-2"></div>
               </div>
             ))}
           </div>
           <div className="h-96 w-full bg-white dark:bg-slate-900 rounded-3xl animate-pulse shadow-sm border border-gray-100 dark:border-slate-800"></div>
        </main>
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">No Hospital Assigned</h2>
            <p className="text-gray-500 dark:text-gray-400">Your account does not have a hospital linked. Please contact the System Administrator to assign your hospital.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const genLow  = inventory.general <= 5
  const icuLow  = inventory.icu <= 2

  const chartData = [...historyEvents].slice(0, 15).map(e => ({
     time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
     Gen: e.new_available,
     ICU: e.new_icu_available
  })).reverse()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-32 pb-24 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

        {}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-2">
              <Building2 className="w-4 h-4" />
              Hospital Admin Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">{hospital.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{hospital.address}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full border ${connected ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"}`}>
              {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {connected ? "Live Connected" : "Offline"}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium bg-white dark:bg-slate-900 px-4 py-2.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 text-indigo-400" />
              Updated {new Date(hospital.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </motion.div>

        {}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Beds", value: hospital.totalBeds, icon: <Bed className="w-5 h-5" />, color: "from-blue-500 to-indigo-500", text: "text-blue-600 dark:text-blue-400" },
            { label: "Available Beds", value: hospital.availableBeds, icon: <Bed className="w-5 h-5" />, color: "from-emerald-500 to-teal-500", text: "text-emerald-600 dark:text-emerald-400" },
            { label: "ICU Beds", value: hospital.icuBeds, icon: <Activity className="w-5 h-5" />, color: "from-purple-500 to-pink-500", text: "text-purple-600 dark:text-purple-400" },
            { label: "Available ICU", value: hospital.availableIcuBeds, icon: <Activity className="w-5 h-5" />, color: "from-rose-500 to-red-500", text: "text-rose-600 dark:text-rose-400" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800">
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3`}>{stat.icon}</div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.text}`}><CountUp end={stat.value} duration={1.2} /></p>
            </motion.div>
          ))}
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
             <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" /> Bed Utilization Trends
             </h3>
             <div className="w-full h-[250px] text-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorIcu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="Gen" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorGen)" />
                    <Area type="monotone" dataKey="ICU" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorIcu)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div className="col-span-1 space-y-4">
            {[
              { label: "General Ward Occupancy", pct: occupancy, color: occupancy > 85 ? "from-rose-500 to-red-500" : "from-blue-500 to-indigo-500" },
              { label: "ICU Occupancy", pct: icuOccupancy, color: icuOccupancy > 85 ? "from-rose-500 to-red-500" : "from-purple-500 to-pink-500" }
            ].map((bar, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{bar.label}</span>
                  <span className={`text-xl font-black ${bar.pct > 85 ? "text-rose-600" : "text-gray-900 dark:text-gray-100"}`}>{bar.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden shadow-inner">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${bar.pct}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${bar.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800">
             <div className="bg-indigo-600 dark:bg-indigo-900 px-6 py-4 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                   <AlertTriangle className="w-5 h-5 text-indigo-200" /> Active Emergency Dispatches
                </h3>
                <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
                  {dispatches.filter(d => d.status === 'incoming').length} INCOMING
                </span>
             </div>
             <div className="p-6">
                {dispatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No dispatches found. You're clear!</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {dispatches.filter(d => d.status !== 'completed').map((d, i) => (
                      <div key={d.id} className={`p-5 rounded-2xl border ${d.status === 'incoming' ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${d.status === 'incoming' ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-white'}`}>{d.status}</span>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg mt-1.5">{d.patient_name}</h4>
                          </div>
                          <div className="text-right">
                            <span className="block text-2xl font-black text-gray-900 dark:text-gray-100">{d.eta_minutes}m</span>
                            <span className="text-xs text-gray-500 opacity-80 uppercase font-bold tracking-widest">ETA</span>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-white/20 dark:border-slate-700/50">{d.condition_details}</p>
                        
                        {d.status === 'incoming' ? (
                          <button onClick={() => handleReserveBed(d.id)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition flex justify-center items-center gap-2">
                             <Save className="w-4 h-4" /> Reserve 1 Bed Instantly
                          </button>
                        ) : (
                           <div className="grid grid-cols-2 gap-2">
                             <button onClick={() => handleDispatchStatus(d.id, 'completed')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition">
                               Arrived & Admitted
                             </button>
                             <button onClick={() => handleDispatchStatus(d.id, 'canceled')} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-xl transition">
                               Cancelled
                             </button>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </motion.div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
              <Save className="text-indigo-500 w-5 h-5" /> Update Bed Inventory
            </h3>
            <div className="space-y-5">
              {[
                { type: "general" as const, label: "General Ward Beds", icon: <Bed className="w-4 h-4 text-blue-500" />, val: inventory.general, low: genLow, max: hospital.totalBeds },
                { type: "icu" as const, label: "ICU Beds", icon: <Activity className="w-4 h-4 text-rose-500" />, val: inventory.icu, low: icuLow, max: hospital.icuBeds },
              ].map(item => (
                <div key={item.type} className={`p-5 rounded-2xl border ${item.low ? "border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-900/10" : "border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50"} flex items-center justify-between`}>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      {item.icon} {item.label}
                      {item.low && <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> LOW</span>}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max capacity: {item.max}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                    <button onClick={() => handleAdjust(item.type, "sub")}
                      className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition flex items-center justify-center">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-black text-xl w-10 text-center text-gray-900 dark:text-gray-100">{item.val}</span>
                    <button onClick={() => handleAdjust(item.type, "add")}
                      disabled={item.val >= item.max}
                      className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {wardDetails.map((ward, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Bed className="w-4 h-4 text-indigo-500" /> {ward.name} Ward
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max capacity: {ward.max}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                    <button onClick={() => handleAdjustWard(idx, "sub")}
                      className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition flex items-center justify-center">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-black text-xl w-10 text-center text-gray-900 dark:text-gray-100">{ward.available}</span>
                    <button onClick={() => handleAdjustWard(idx, "add")} disabled={ward.available >= ward.max}
                      className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {!showAddWard ? (
                <button onClick={() => setShowAddWard(true)} className="w-full border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl py-4 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                  <Plus className="w-4 h-4" /> Add Specific Ward
                </button>
              ) : (
                <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm">Add New Ward Details</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="col-span-2">
                       <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Ward Type</label>
                       <select value={newWard.name} onChange={e => setNewWard(prev => ({...prev, name: e.target.value}))} className="w-full text-sm p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 outline-none">
                         <option value="Maternity">Maternity</option>
                         <option value="Burn Unit">Burn Unit</option>
                         <option value="CCU">CCU (Coronary Care)</option>
                         <option value="NICU">NICU (Neonatal)</option>
                         <option value="Pediatrics">Pediatrics</option>
                         <option value="Surgery">Surgery</option>
                         <option value="Trauma">Trauma</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Max Capacity</label>
                       <input type="number" min={1} value={newWard.max} onChange={e => setNewWard(prev => ({...prev, max: parseInt(e.target.value) || 0}))} className="w-full text-sm p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 outline-none" />
                    </div>
                    <div>
                       <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Available Beds</label>
                       <input type="number" min={0} value={newWard.available} onChange={e => setNewWard(prev => ({...prev, available: parseInt(e.target.value) || 0}))} className="w-full text-sm p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 outline-none" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddCustomWard} className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700 transition">Save Ward</button>
                    <button onClick={() => setShowAddWard(false)} className="px-3 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-700 transition">Cancel</button>
                  </div>
                </div>
              )}
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20">
              <Save className="w-5 h-5" />
              {saving ? "Pushing Live Update..." : "Push Live Update"}
            </motion.button>
          </motion.div>

          {}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col h-[520px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Activity className="text-indigo-500 w-5 h-5" /> Update History
                {connected && bedUpdates.length > 0 && (
                  <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">{bedUpdates.length} live</span>
                )}
              </h3>
              <button onClick={handleExport}
                className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 transition-colors uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
            <div className="flex-1 overflow-auto space-y-3 pr-1">
              {historyEvents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-center">
                  <Activity className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No update history yet. Push your first update!</p>
                </div>
              ) : historyEvents.map((e: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Inventory Updated</h4>
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md shrink-0">
                        {new Date(e.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      General: <span className="font-semibold text-gray-700 dark:text-gray-300">{e.prev_available} → {e.new_available}</span>
                      {" · "}ICU: <span className="font-semibold text-gray-700 dark:text-gray-300">{e.prev_icu_available} → {e.new_icu_available}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
