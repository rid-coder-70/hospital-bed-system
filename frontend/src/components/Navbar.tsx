"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  FaHome,
  FaHospital,
  FaTachometerAlt,
  FaSignInAlt,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setUserRole(localStorage.getItem('userRole'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
    window.location.href = '/auth/login';
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const getNavClass = (path: string) => {
    const base = "flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 text-sm md:text-base font-medium transition-all duration-300 w-full md:w-auto py-2 md:py-0 rounded-xl md:rounded-none ";
    const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
    return isActive
      ? base + "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 md:bg-transparent"
      : base + "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent";
  };

  return (
    <>
      <div className="fixed w-full z-50 flex justify-center top-0 md:top-4 px-0 md:px-4">
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b md:border border-gray-200/50 dark:border-slate-700/50 md:shadow-lg md:rounded-full w-full max-w-7xl px-4 sm:px-6 py-3 flex justify-between items-center"
        >
          {/* Logo */}
          <Link href="/">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 cursor-pointer"
            >
              HealthBed AI
            </motion.h1>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={getNavClass("/")}>
              <FaHome className="w-4 h-4" /> <span>Home</span>
            </Link>
            <Link href="/hospital" className={getNavClass("/hospital")}>
              <FaHospital className="w-4 h-4" /> <span>Directory</span>
            </Link>
            {(userRole === "hospital_admin" || userRole === "admin") && (
              <Link href="/dashboard" className={getNavClass("/dashboard")}>
                <FaTachometerAlt className="w-4 h-4" /> <span>Dashboard</span>
              </Link>
            )}

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

            {mounted && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-amber-400 bg-gray-100 dark:bg-slate-800 transition"
                aria-label="Toggle Dark Mode"
              >
                {theme === "dark" ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
              </motion.button>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {userRole ? (
                <button onClick={handleLogout} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-md shadow-red-500/20 hover:shadow-lg transition">
                  Logout
                </button>
              ) : (
                <Link href="/auth/login" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg transition">
                  <FaSignInAlt /> Login
                </Link>
              )}
            </motion.div>
          </div>

          <div className="flex md:hidden items-center gap-4">
            {mounted && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800"
              >
                {theme === "dark" ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
              </motion.button>
            )}
            
            <button
              className="text-2xl text-gray-700 dark:text-gray-200 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              <FaBars />
            </button>
          </div>
        </motion.nav>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 rounded-2xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-2 pointer-events-auto flex justify-around items-center"
        >
          <Link href="/" className={getNavClass("/")} onClick={closeMenu}>
            <FaHome className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href="/hospital" className={getNavClass("/hospital")} onClick={closeMenu}>
            <FaHospital className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Dict.</span>
          </Link>
          {(userRole === "hospital_admin" || userRole === "admin") && (
            <Link href="/dashboard" className={getNavClass("/dashboard")} onClick={closeMenu}>
              <FaTachometerAlt className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">Dash</span>
            </Link>
          )}
        </motion.div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="
                fixed top-0 right-0
                h-full w-4/5 max-w-sm
                bg-white dark:bg-slate-900
                shadow-2xl z-50
                md:hidden
                flex flex-col
                pt-20 px-6 gap-6
              "
            >
              <button
                className="absolute top-6 right-6 text-2xl text-gray-500 dark:text-gray-400 focus:outline-none"
                onClick={closeMenu}
              >
                <FaTimes />
              </button>

              <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Account</h2>
              {userRole ? (
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 rounded-2xl font-bold shadow-md hover:shadow-lg transition active:scale-95">
                  Logout
                </button>
              ) : (
                <Link onClick={closeMenu} href="/auth/login">
                  <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold shadow-md hover:shadow-lg transition active:scale-95">
                    <FaSignInAlt /> Log In / Sign Up
                  </button>
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;