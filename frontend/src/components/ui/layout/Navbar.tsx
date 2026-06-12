"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  {
    label: "PDF Tools",
    href: "/pdf",
    submenu: ["Merge PDF", "Split PDF", "Compress PDF", "PDF to Image"],
  },
  {
    label: "Document",
    href: "/document",
    submenu: ["DOCX to PDF", "PDF to DOCX", "TXT to PDF"],
  },
  {
    label: "Image",
    href: "/image",
    submenu: ["Compress Image", "Resize Image", "OCR"],
  },
  {
    label: "Audio",
    href: "/audio",
    submenu: ["Audio to Text", "MP4 to MP3", "Video to Text"],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#09090b]/90 backdrop-blur-xl border-b border-[#27272a]"
          : "bg-transparent"
      }`}
    >
      <nav style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto", paddingLeft: "1rem", paddingRight: "1rem" }}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center glow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Snap<span className="gradient-text">Docs</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveMenu(link.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className="px-4 py-2 text-sm text-[#a1a1aa] hover:text-white rounded-lg hover:bg-[#18181b] transition-all duration-200">
                  {link.label}
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {activeMenu === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-[#18181b] border border-[#27272a] rounded-xl shadow-xl overflow-hidden"
                    >
                      {link.submenu.map((item) => (
                        <Link
                          key={item}
                          href={`${link.href}/${item
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                          className="block px-4 py-2.5 text-sm text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-all duration-150"
                        >
                          {item}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg glow-sm hover:opacity-90 transition-opacity"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#a1a1aa] hover:text-white rounded-lg hover:bg-[#18181b] transition-all"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#09090b]/95 backdrop-blur-xl border-b border-[#27272a] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold text-[#6366f1] uppercase tracking-wider">
                    {link.label}
                  </p>
                  {link.submenu.map((item) => (
                    <Link
                      key={item}
                      href={`${link.href}/${item
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded-lg transition-all"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="pt-3 border-t border-[#27272a]">
                <button className="w-full px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
