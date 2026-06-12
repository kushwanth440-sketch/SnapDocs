"use client";

import { motion } from "framer-motion";
import { Shield, Zap, UserX, Lock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Files deleted immediately after processing. Zero retention.",
    iconBg: "#EEEDFE",
    iconColor: "#534AB7",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized pipelines process your files in under 2 seconds.",
    iconBg: "#FAEEDA",
    iconColor: "#854F0B",
  },
  {
    icon: UserX,
    title: "No Signup Required",
    description: "No accounts, no emails. Just upload and convert instantly.",
    iconBg: "#E1F5EE",
    iconColor: "#0F6E56",
  },
  {
    icon: Lock,
    title: "100% Secure",
    description: "End-to-end encrypted transfers. Your data stays yours.",
    iconBg: "#FBEAF0",
    iconColor: "#993556",
  },
];

export default function FeaturesStrip() {
  return (
    <section style={{ padding: "0 24px 100px" }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "16px",
                padding: "28px 24px",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              {/* Icon */}
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: feature.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <feature.icon style={{
                  width: "20px",
                  height: "20px",
                  color: feature.iconColor,
                }} />
              </div>

              {/* Text */}
              <div>
                <h3 style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#fafafa",
                  marginBottom: "6px",
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: "13px",
                  color: "#71717a",
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
