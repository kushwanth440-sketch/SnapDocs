"use client";

import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import { ArrowLeft, ScanText, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function OCRPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Back */}
                <div style={{ marginBottom: "32px" }}>
                  <Link href="/tools" style={{ textDecoration: "none" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      padding: "9px 16px", borderRadius: "10px",
                      border: "1px solid rgba(99,102,241,0.4)",
                      background: "rgba(99,102,241,0.1)",
                      fontSize: "13px", fontWeight: 600, color: "#818cf8",
                      cursor: "pointer", transition: "all 0.2s",
                      boxShadow: "0 0 12px rgba(99,102,241,0.15)",
                    }}>
                      <ArrowLeft style={{ width: "14px", height: "14px" }} />
                      All Tools
                    </span>
                  </Link>
                </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginTop: "80px" }}
        >
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "linear-gradient(135deg, #f59e0b22, #d97706,22)",
            border: "1px solid rgba(245,158,11,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <ScanText style={{ width: "32px", height: "32px", color: "#f59e0b" }} />
          </div>

          <h1 style={{ fontSize: "36px", fontWeight: 700, margin: "0 0 12px", color: "#fafafa" }}>
            OCR — Coming Soon
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: "0 0 32px" }}>
            Extract text from images. We're working on it!
          </p>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", borderRadius: "12px",
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            color: "#f59e0b", fontSize: "14px",
          }}>
            <Clock style={{ width: "16px", height: "16px" }} />
            Under Development
          </div>
        </motion.div>

      </div>
    </main>
  );
}