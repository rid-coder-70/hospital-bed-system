'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Globe, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white">
              HealthBed AI
            </h3>

            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-sm">
              AI-powered hospital bed availability system helping patients
              find healthcare support faster and improving emergency response.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>

            <ul className="mt-5 space-y-3 text-sm">

              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/hospital" className="hover:text-white transition">
                  Hospital
                </Link>
              </li>

              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>

            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white">Resources</h4>

            <ul className="mt-5 space-y-3 text-sm">

              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link href="/help" className="hover:text-white transition">
                  Help Center
                </Link>
              </li>

            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white">Contact</h4>

            <div className="flex items-center gap-2 mt-5 text-gray-400 text-sm">
              <Mail size={18} />
              <span>support@healthbed.com</span>
            </div>

            <p className="text-gray-400 mt-3 text-sm">
              Bangladesh Healthcare Platform
            </p>
            <div className="flex gap-4 mt-6">

              <a
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-blue-600 transition"
              >
                <Globe size={18} />
              </a>

              <a
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-blue-600 transition"
              >
                <Twitter size={18} />
              </a>

              <a
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-blue-600 transition"
              >
                <Facebook size={18} />
              </a>

            </div>

          </motion.div>

        </div>
        <div className="border-t border-gray-700 mt-14 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} HealthBed AI. All rights reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;