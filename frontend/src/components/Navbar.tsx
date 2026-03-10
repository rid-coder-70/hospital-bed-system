'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaHome,
  FaHospital,
  FaTachometerAlt,
  FaEnvelope,
  FaSignInAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const navItem =
    "flex items-center gap-3 text-gray-700 hover:text-blue-600 transition text-lg font-medium";

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <>
      <div className="fixed w-full z-50 flex justify-center top-4 px-4">

        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="
          backdrop-blur-lg bg-white/80
          border border-white/40
          shadow-lg
          rounded-full
          w-full max-w-7xl
          "
        >

          <div className="px-5 py-3 flex justify-between items-center">

            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-xl md:text-2xl font-bold text-blue-600 cursor-pointer"
            >
              HealthBed AI
            </motion.h1>
            <div className="hidden md:flex items-center gap-8">

              <Link href="/" className="flex items-center gap-2 hover:text-blue-600">
                <FaHome /> Home
              </Link>

              <Link href="/hospital" className="flex items-center gap-2 hover:text-blue-600">
                <FaHospital /> Hospital
              </Link>

              <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-600">
                <FaTachometerAlt /> Dashboard
              </Link>

              <Link href="/contact" className="flex items-center gap-2 hover:text-blue-600">
                <FaEnvelope /> Contact
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700"
              >
                <Link href="/auth/login" className="flex items-center gap-2 hover:text-white-600">
                  <FaSignInAlt /> Login
                </Link>
              </motion.button>

            </div>
            <button
              className="md:hidden text-2xl text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

          </div>
        </motion.nav>
      </div>
      <AnimatePresence>

        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35 }}
              className="
              fixed top-0 right-0
              h-full w-[80%] max-w-sm
              bg-white
              shadow-2xl
              z-50
              md:hidden
              flex flex-col
              pt-20 px-6 gap-6
              "
            >
              <button
                className="absolute top-5 right-5 text-2xl"
                onClick={closeMenu}
              >
                <FaTimes />
              </button>

              <Link onClick={closeMenu} href="/" className={navItem}>
                <FaHome /> Home
              </Link>

              <Link onClick={closeMenu} href="/hospital" className={navItem}>
                <FaHospital /> Hospital
              </Link>

              <Link onClick={closeMenu} href="/dashboard" className={navItem}>
                <FaTachometerAlt /> Dashboard
              </Link>

              <Link onClick={closeMenu} href="/contact" className={navItem}>
                <FaEnvelope /> Contact
              </Link>

              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-full mt-4 hover:bg-blue-700">
                <FaSignInAlt /> Login
              </button>

            </motion.div>

          </>
        )}

      </AnimatePresence>
    </>
  );
};

export default Navbar;