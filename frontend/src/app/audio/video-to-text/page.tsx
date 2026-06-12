"use client";

import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import { ArrowLeft, FileAudio, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Mp4ToMp3Page() {
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
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <FileAudio style={{ width: "32px", height: "32px", color: "#10b981" }} />
          </div>

          <h1 style={{ fontSize: "36px", fontWeight: 700, margin: "0 0 12px", color: "#fafafa" }}>
            Video to Text — Coming Soon
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: "0 0 32px" }}>
            Extract text from any video file. We're working on it!
          </p>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", borderRadius: "12px",
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
            color: "#10b981", fontSize: "14px",
          }}>
            <Clock style={{ width: "16px", height: "16px" }} />
            Under Development
          </div>

          {/* <div style={{ marginTop: "48px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 24px", borderRadius: "12px",
              background: "#18181b", border: "1px solid #27272a",
              color: "#a1a1aa", fontSize: "14px", textDecoration: "none",
            }}>
              <ArrowLeft style={{ width: "16px", height: "16px" }} /> All Tools
            </Link>
            <Link href="/audio/transcribe" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 24px", borderRadius: "12px",
              background: "#18181b", border: "1px solid #27272a",
              color: "#a1a1aa", fontSize: "14px", textDecoration: "none",
            }}>
              Video to Text
            </Link>
          </div> */}
        </motion.div>

      </div>
    </main>
  );
}