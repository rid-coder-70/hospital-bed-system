"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { Users, Activity, Bed, Clock, AlertTriangle, TrendingUp, Filter, ServerCog, Plus, Minus, Save } from "lucide-react"
import CountUp from "react-countup"
import { toast } from "react-hot-toast"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBeds: 0,
    availableBeds: 0,
    totalIcuBeds: 0,
    availableIcuBeds: 0,
    hospitalsWithBeds: 0,
    totalHospitals: 0,
    lastUpdated: new Date().toISOString()
  })
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [hospitals, setHospitals] = useState<any[]>([])
  const [selectedHospital, setSelectedHospital] = useState<any>(null)
  const [inventory, setInventory] = useState({ general: 0, icu: 0 })
  const handleUpdateInventory = (type: 'general' | 'icu', operation: 'add' | 'subtract') => {
    setInventory(prev => ({
      ...prev,
      [type]: operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }))
  }
  const handleSaveInventory = async () => {
    if (!selectedHospital) return
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch("http://localhost:5000/api/beds/update", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          hospitalId: selectedHospital.id,
          availableBeds: inventory.general,
          availableIcuBeds: inventory.icu
        })
      })
      if (!res.ok) throw new Error("Update failed")
      toast.success("Inventory successfully pushed to live database!")
      window.location.reload()
    } catch (err) {
      toast.error("Error syncing inventory. Check your permissions.")
    }
  }
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/beds/availability")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setStats({
          totalBeds: parseInt(data.data.totalBeds) || 0,
          availableBeds: parseInt(data.data.availableBeds) || 0,
          totalIcuBeds: parseInt(data.data.totalIcuBeds) || 0,
          availableIcuBeds: parseInt(data.data.availableIcuBeds) || 0,
          hospitalsWithBeds: parseInt(data.data.hospitalsWithBeds) || 0,
          totalHospitals: parseInt(data.data.totalHospitals) || 0,
          lastUpdated: data.data.lastUpdated || new Date().toISOString()
        })
      } catch (err) {
        setStats({
          totalBeds: 5400,
          availableBeds: 540,
          totalIcuBeds: 460,
          availableIcuBeds: 45,
          hospitalsWithBeds: 8,
          totalHospitals: 8,
          lastUpdated: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }
    const fetchHospitals = async () => {
       try {
          const res = await fetch("http://localhost:5000/api/hospitals")
          const data = await res.json()
          setHospitals(data.data || [])
          if (data.data && data.data.length > 0) {
             const first = data.data[0]
             setSelectedHospital(first)
             setInventory({
                general: first.availableBeds,
                icu: first.availableIcuBeds
             })
          }
       } catch (e) {}
    }
    const checkRole = () => {
      const role = localStorage.getItem('userRole');
      if (role !== 'hospital_admin' && role !== 'admin') {
        window.location.href = '/auth/login';
      } else {
        setIsAdmin(true);
        fetchStats();
        fetchHospitals();
      }
    }
    checkRole();
  }, [])
  const handleHospitalChange = (id: string) => {
     const hosp = hospitals.find(h => h.id === id)
     if (hosp) {
        setSelectedHospital(hosp)
        setInventory({
           general: hosp.availableBeds,
           icu: hosp.availableIcuBeds
        })
     }
  }
  const container: any = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
  const card: any = { hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }
  const statCards = [
    {
      title: "General Ward Availability",
      value: stats.availableBeds,
      total: stats.totalBeds,
      icon: <Bed className="w-6 h-6 md:w-7 md:h-7 text-white" />,
      color: "from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "ICU Unit Availability",
      value: stats.availableIcuBeds,
      total: stats.totalIcuBeds,
      icon: <Activity className="w-6 h-6 md:w-7 md:h-7 text-white" />,
      color: "from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700",
      textColor: "text-rose-600 dark:text-rose-400"
    },
    {
      title: "Facilities Online",
      value: stats.hospitalsWithBeds,
      total: stats.totalHospitals,
      icon: <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />,
      color: "from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700",
      textColor: "text-emerald-600 dark:text-emerald-400"
    }
  ]
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="font-bold text-gray-500">Checking authorization...</p>
      </div>
    )
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
              <ServerCog className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 dark:text-indigo-400" /> 
              Facility Admin Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base md:text-lg">Live operations overview across your healthcare network.</p>
          </div>
          <div className="flex items-center gap-3 text-xs md:text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 px-4 md:px-5 py-2.5 md:py-3 rounded-full shadow-sm border border-gray-100 dark:border-slate-800 font-medium">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-indigo-500 dark:text-indigo-400" />
            <span>Last Sync: {new Date(stats.lastUpdated).toLocaleTimeString()}</span>
            <div className="relative flex h-2.5 w-2.5 md:h-3 md:w-3 ml-1 md:ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
            </div>
          </div>
        </motion.div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/5 to-transparent z-10"></div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/2 mb-4 animate-pulse"></div>
                <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded w-3/4 mb-8 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-full w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8 md:space-y-10">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {statCards.map((stat, idx) => {
                const percentageNumber = stat.total > 0 ? (stat.value / stat.total) * 100 : 0;
                const percentage = percentageNumber.toFixed(1);
                const isCritical = percentageNumber < 15;
                return (
                  <motion.div
                    key={idx}
                    variants={card}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-indigo-900/20 transition-all duration-300 relative overflow-hidden group focus-within:ring-2 ring-indigo-500"
                    tabIndex={0}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 dark:bg-slate-800/50 rounded-bl-full -z-10 opacity-50 dark:opacity-20"></div>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                      {isCritical && (
                        <span className="flex items-center gap-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full ring-1 ring-rose-200 dark:ring-rose-800 flex-shrink-0 animate-pulse" role="alert">
                          <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">CRITICAL</span>
                        </span>
                      )}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase text-xs md:text-sm mb-2 truncate" title={stat.title}>{stat.title}</h3>
                      <div className="flex items-end gap-2 md:gap-3 mb-1">
                        <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">
                          <CountUp end={stat.value} duration={1.5} start={0} />
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 font-medium mb-1 md:mb-1.5 text-base md:text-lg">/ {stat.total}</span>
                      </div>
                    </div>
                    <div className="mt-8">
                      <div className="flex justify-between text-xs md:text-sm mb-2 md:mb-3">
                        <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Current Load</span>
                        <span className={`font-black ${isCritical ? 'text-rose-600 dark:text-rose-400' : stat.textColor}`}>
                          <CountUp end={percentageNumber} duration={1.5} decimals={1} suffix="%" />
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 md:h-3 overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${isCritical ? 'from-rose-500 to-red-600 dark:from-rose-600 dark:to-red-700' : stat.color} relative`} 
                        >
                          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-800 h-auto md:h-[400px] flex flex-col relative overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <ServerCog className="text-indigo-500 dark:text-indigo-400 w-5 h-5 md:w-6 md:h-6" /> Inventory Control
                  </h3>
                  <select 
                     onChange={(e) => handleHospitalChange(e.target.value)}
                     className="text-xs md:text-sm font-semibold bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-slate-700 outline-none focus:ring-2 ring-indigo-500 transition-all"
                  >
                     {hospitals.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                     ))}
                  </select>
                </div>
                <div className="flex-1 space-y-6">
                  <div className="bg-gray-50 dark:bg-slate-800/50 p-4 lg:p-5 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><Bed className="w-4 h-4 text-blue-500"/> General Ward</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available unoccupied beds</p>
                     </div>
                     <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                        <button onClick={() => handleUpdateInventory('general', 'subtract')} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition flex items-center justify-center">
                           <Minus className="w-4 h-4"/>
                        </button>
                        <span className="font-black text-xl w-8 text-center text-gray-900 dark:text-gray-100">{inventory.general}</span>
                        <button onClick={() => handleUpdateInventory('general', 'add')} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center justify-center">
                           <Plus className="w-4 h-4"/>
                        </button>
                     </div>
                  </div>
                   <div className="bg-gray-50 dark:bg-slate-800/50 p-4 lg:p-5 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500"/> ICU Unit</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available Intensive Care Units</p>
                     </div>
                     <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                        <button onClick={() => handleUpdateInventory('icu', 'subtract')} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition flex items-center justify-center">
                           <Minus className="w-4 h-4"/>
                        </button>
                        <span className="font-black text-xl w-8 text-center text-gray-900 dark:text-gray-100">{inventory.icu}</span>
                        <button onClick={() => handleUpdateInventory('icu', 'add')} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center justify-center">
                           <Plus className="w-4 h-4"/>
                        </button>
                     </div>
                  </div>
                </div>
                <motion.button 
                   whileTap={{ scale: 0.95 }}
                   onClick={handleSaveInventory}
                   className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
                >
                   <Save className="w-5 h-5"/> Push Live Updates
                </motion.button>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col h-[400px]"
              >
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Activity className="text-indigo-500 dark:text-indigo-400 w-5 h-5 md:w-6 md:h-6" /> Live Feed
                  </h3>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="text-xs md:text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
                  >
                    Export Log
                  </motion.button>
                </div>
                <div className="flex-1 overflow-auto space-y-3 md:space-y-4 pr-2 custom-scrollbar">
                  {[1,2,3,4].map((i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-indigo-50/50 dark:hover:bg-slate-700 transition duration-300 cursor-pointer border border-gray-100 dark:border-slate-700 shadow-sm hover:border-indigo-100 dark:hover:border-indigo-800 group focus-visible:ring-2 ring-indigo-500"
                      tabIndex={0}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <Activity className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm md:text-base truncate">Inventory Status Altered</h4>
                          <span className="text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 md:py-1 rounded-md shrink-0">{i * 12}m ago</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          Dhaka Medical College updated general allocation from <span className="font-bold text-rose-500 dark:text-rose-400 mx-1">112</span> to <span className="font-bold text-emerald-500 dark:text-emerald-400 mx-1">120</span>.
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
