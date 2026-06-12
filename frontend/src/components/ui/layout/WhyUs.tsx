"use client";

import { motion } from "framer-motion";
import { Shield, Zap, UserX, Globe, Clock, Lock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your files are never stored permanently. Everything is processed and deleted immediately after you download the result. Zero retention, zero risk.",
    iconBg: "#EEEDFE",
    iconColor: "#534AB7",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized processing pipelines ensure your files are converted in seconds, not minutes. No waiting, no queues.",
    iconBg: "#FAEEDA",
    iconColor: "#854F0B",
  },
  {
    icon: UserX,
    title: "No Signup Required",
    description:
      "Jump straight in. No accounts, no emails, no passwords. Just upload your file and get the result instantly.",
    iconBg: "#E1F5EE",
    iconColor: "#0F6E56",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description:
      "Fully responsive and optimized for all devices — desktop, tablet, and mobile. Works on any modern browser.",
    iconBg: "#EEEDFE",
    iconColor: "#534AB7",
  },
  {
    icon: Clock,
    title: "Always Available",
    description:
      "99.9% uptime guaranteed. Process your files anytime, anywhere, without interruptions or downtime.",
    iconBg: "#FBEAF0",
    iconColor: "#993556",
  },
  {
    icon: Lock,
    title: "100% Secure",
    description:
      "All file transfers are encrypted end-to-end. Your data stays yours — always. We never share or analyze your files.",
    iconBg: "#E1F5EE",
    iconColor: "#0F6E56",
  },
];

const stats = [
  { value: "20+", label: "Tools Available" },
  { value: "100%", label: "Privacy Guaranteed" },
  { value: "0", label: "Files Stored" },
  { value: "< 2s", label: "Avg Processing" },
];

export default function WhyUs() {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">

      {/* Background */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "900px",
          height: "500px",
          background: "rgba(139,92,246,0.04)",
          borderRadius: "50%",
          filter: "blur(140px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
            style={{
              background: "rgba(139,92,246,0.1)",
              color: "#a78bfa",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            Why Choose Us
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Built Different,{" "}
            <span className="gradient-text">By Design</span>
          </h2>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#a1a1aa" }}
          >
            We obsess over privacy, speed, and simplicity so you never
            have to think about it.
          </p>
        </motion.div>

        {/* Features — 2 col icon-left layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -3 }}
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "20px",
                padding: "28px",
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
                transition: "border-color 0.3s",
              }}
              className="group"
            >
              {/* Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: feature.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <feature.icon
                  style={{
                    width: "22px",
                    height: "22px",
                    color: feature.iconColor,
                  }}
                />
              </div>

              {/* Text */}
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#fafafa",
                    marginBottom: "8px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#71717a",
                    lineHeight: "1.7",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats — full width strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "20px",
            padding: "32px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
          className="sm:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              style={{ textAlign: "center" }}
            >
              <p
                className="gradient-text"
                style={{
                  fontSize: "42px",
                  fontWeight: 700,
                  marginBottom: "6px",
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#a1a1aa",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
