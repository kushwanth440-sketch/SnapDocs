"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      style={{
        minHeight: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "160px 24px 80px",
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: "absolute",
        top: "-100px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "800px",
        height: "600px",
        background: "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Grid pattern */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        maxWidth: "860px",
        width: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "28px",
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "999px",
          }}
        >
          <div style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 8px #10b981",
          }} />
          <span style={{ fontSize: "13px", color: "#a1a1aa", letterSpacing: "0.02em" }}>
            Privacy-first · No signup · Files deleted instantly
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 style={{
            fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "#fafafa",
            margin: 0,
          }}>
            Convert Files{" "}
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              In Seconds
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "clamp(16px, 2.5vw, 20px)",
            color: "#71717a",
            lineHeight: 1.7,
            maxWidth: "560px",
            margin: 0,
          }}
        >
          Privacy-first tools for PDFs, images, audio, and documents.
          No signup required. Your files never leave your control.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 600,
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 32px rgba(99,102,241,0.35)",
            }}
          >
            Get Started Free →
          </motion.button>

          <Link
  href="/tools"
  style={{
    padding: "14px 28px",
    background: "transparent",
    color: "#fafafa",
    fontSize: "15px",
    fontWeight: 600,
    borderRadius: "12px",
    border: "1px solid #3f3f46",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
  }}
>
  View All Tools
</Link>
        </motion.div>

        {/* Trust pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { icon: Shield, label: "No Data Stored" },
            { icon: Zap, label: "Lightning Fast" },
            { icon: Lock, label: "100% Private" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#71717a",
              }}
            >
              <Icon style={{ width: "14px", height: "14px", color: "#6366f1" }} />
              {label}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
