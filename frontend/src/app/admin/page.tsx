"use client"

import { useState, useEffect, useCallback } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck, Users, Building2, Bed, Activity, Trash2,
  UserPlus, Edit3, Check, X, ChevronDown, ToggleLeft, ToggleRight
} from "lucide-react"
import { toast } from "react-hot-toast"
import CountUp from "react-countup"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type Tab = "overview" | "users" | "hospitals"

const ROLE_COLORS: Record<string, string> = {
  admin:          "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
  hospital_admin: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
  user:           "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
}

const ROLE_LABELS: Record<string, string> = {
  admin: "System Admin", hospital_admin: "Hospital Admin", user: "Patient"
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview")
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [hospitals, setHospitals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [hospitalsList, setHospitalsList] = useState<any[]>([]) // for dropdown


  const [showCreate, setShowCreate] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user", hospitalId: "" })

  const getToken = () => localStorage.getItem("authToken") || ""

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${getToken()}` } })
      const data = await res.json()
      setStats(data.data)
    } catch {}
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/users?limit=100`, { headers: { Authorization: `Bearer ${getToken()}` } })
      const data = await res.json()
      setUsers(data.data || [])
    } catch {}
  }, [])

  const fetchHospitals = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/hospitals`, { headers: { Authorization: `Bearer ${getToken()}` } })
      const data = await res.json()
      setHospitals(data.data || [])
    } catch {}
  }, [])

  const fetchHospitalsDropdown = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/hospitals?limit=100`)
      const data = await res.json()
      setHospitalsList(data.data || [])
    } catch {}
  }, [])

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const token = localStorage.getItem("authToken")
    if (!token || role !== "admin") {
      window.location.href = "/auth/login"
      return
    }
    setAuthorized(true)
    Promise.all([fetchStats(), fetchUsers(), fetchHospitals(), fetchHospitalsDropdown()]).finally(() => setLoading(false))
  }, [fetchStats, fetchUsers, fetchHospitals, fetchHospitalsDropdown])

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      await fetch(`${API}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      setUsers(prev => prev.filter(u => u.id !== userId))
      toast.success(`User "${name}" deleted`)
    } catch {
      toast.error("Failed to delete user")
    }
  }

  const handleRoleChange = async (userId: string, newRole: string, hospitalId?: string) => {
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ role: newRole, hospitalId: hospitalId || null })
      })
      if (!res.ok) throw new Error()
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, hospital_id: hospitalId || null } : u))
      toast.success("User role updated")
    } catch {
      toast.error("Failed to update role")
    }
  }

  const handleToggleHospital = async (hospitalId: string, name: string) => {
    try {
      const res = await fetch(`${API}/api/admin/hospitals/${hospitalId}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setHospitals(prev => prev.map(h => h.id === hospitalId ? { ...h, is_active: data.data.is_active } : h))
      toast.success(`${name} is now ${data.data.is_active ? "active" : "inactive"}`)
    } catch {
      toast.error("Toggle failed")
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(newUser)
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      const data = await res.json()
      setUsers(prev => [data.data, ...prev])
      setShowCreate(false)
      setNewUser({ name: "", email: "", password: "", role: "user", hospitalId: "" })
      toast.success("User created!")
    } catch (err: any) {
      toast.error(err.message || "Failed to create user")
    }
  }

  if (!authorized || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-semibold text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: Activity },
    { key: "users", label: `Users (${users.length})`, icon: Users },
    { key: "hospitals", label: `Hospitals (${hospitals.length})`, icon: Building2 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-32 pb-24 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

        {}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-sm mb-2">
            <ShieldCheck className="w-4 h-4" /> System Administrator
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Admin Control Panel</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage users, hospitals, and system-wide settings.</p>
        </motion.div>

        {}
        <div className="flex gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 mb-8 w-fit">
          {TABS.map(t => {
            const Icon = t.icon
            const isActive = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${isActive ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                <Icon className="w-4 h-4" />{t.label}
              </button>
            )
          })}
        </div>

        {}
        {tab === "overview" && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Users", value: stats.users.total, icon: <Users className="w-5 h-5" />, color: "from-blue-500 to-indigo-500" },
                { label: "Active Hospitals", value: stats.hospitals.active, icon: <Building2 className="w-5 h-5" />, color: "from-emerald-500 to-teal-500" },
                { label: "Available Beds", value: parseInt(stats.beds.available_beds) || 0, icon: <Bed className="w-5 h-5" />, color: "from-amber-500 to-orange-500" },
                { label: "Available ICU", value: parseInt(stats.beds.available_icu) || 0, icon: <Activity className="w-5 h-5" />, color: "from-rose-500 to-red-500" },
              ].map((card, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800">
                  <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${card.color} text-white mb-3`}>{card.icon}</div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{card.label}</p>
                  <p className="text-3xl font-black text-gray-900 dark:text-gray-100"><CountUp end={card.value} duration={1.2} /></p>
                </motion.div>
              ))}
            </div>
            {}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> User Breakdown by Role</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(stats.users.byRole).map(([role, count]: any) => (
                  <div key={role} className={`rounded-xl p-4 text-center ${ROLE_COLORS[role] || "bg-gray-100 text-gray-700"}`}>
                    <p className="text-2xl font-black">{count}</p>
                    <p className="text-xs font-bold mt-1">{ROLE_LABELS[role] || role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {}
        {tab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm">
                <UserPlus className="w-4 h-4" /> Add User
              </button>
            </div>

            {}
            <AnimatePresence>
              {showCreate && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5 text-indigo-500" /> Create New User</h3>
                  <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
                      { label: "Email", key: "email", type: "email", placeholder: "john@example.com" },
                      { label: "Password", key: "password", type: "password", placeholder: "Min 6 characters" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
                        <input type={f.type} required placeholder={f.placeholder}
                          value={(newUser as any)[f.key]} onChange={e => setNewUser(prev => ({ ...prev, [f.key]: e.target.value }))}
                          className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 p-3 rounded-xl text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                      <div className="relative">
                        <select value={newUser.role} onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full appearance-none bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 p-3 pr-8 rounded-xl text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all">
                          <option value="user">Patient</option>
                          <option value="hospital_admin">Hospital Admin</option>
                          <option value="admin">System Admin</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    {newUser.role === "hospital_admin" && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Linked Hospital</label>
                        <div className="relative">
                          <select value={newUser.hospitalId} onChange={e => setNewUser(prev => ({ ...prev, hospitalId: e.target.value }))}
                            className="w-full appearance-none bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 p-3 pr-8 rounded-xl text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all">
                            <option value="">— No hospital —</option>
                            {hospitalsList.map(h => (
                              <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    )}
                    <div className="md:col-span-2 flex gap-3 justify-end mt-2">
                      <button type="button" onClick={() => setShowCreate(false)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button type="submit"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                        <Check className="w-4 h-4" /> Create User
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                      {["Name", "Email", "Role", "Hospital", "Actions"].map(th => (
                        <th key={th} className="text-left px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{th}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 font-semibold text-gray-900 dark:text-gray-100">{user.name}</td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-600"}`}>
                            {ROLE_LABELS[user.role] || user.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-sm">{user.hospital_name || "—"}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <select value={user.role}
                              onChange={e => handleRoleChange(user.id, e.target.value, user.hospital_id)}
                              className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-indigo-500/30 transition-all font-semibold">
                              <option value="user">Patient</option>
                              <option value="hospital_admin">Hospital Admin</option>
                              <option value="admin">System Admin</option>
                            </select>
                            <button onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {}
        {tab === "hospitals" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                    {["Hospital", "Location", "Beds", "ICU", "Admins", "Status", "Actions"].map(th => (
                      <th key={th} className="text-left px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {hospitals.map(h => (
                    <tr key={h.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-semibold text-gray-900 dark:text-gray-100 max-w-[200px]">
                        <p className="truncate">{h.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate font-normal mt-0.5">{h.address}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{h.lat?.toFixed(3)}, {h.lng?.toFixed(3)}</td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-gray-900 dark:text-gray-100">{h.available_beds}</span>
                        <span className="text-gray-400"> / {h.total_beds}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-gray-900 dark:text-gray-100">{h.available_icu_beds}</span>
                        <span className="text-gray-400"> / {h.icu_beds}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{parseInt(h.admin_count) || 0}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${h.is_active ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-gray-100 dark:bg-slate-800 text-gray-500"}`}>
                          {h.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => handleToggleHospital(h.id, h.name)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${h.is_active ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40" : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"}`}>
                          {h.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          {h.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
