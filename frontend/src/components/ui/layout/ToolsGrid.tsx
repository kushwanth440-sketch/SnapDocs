"use client";

import { motion } from "framer-motion";
import {
  FileText, Scissors, Minimize2, Image,
  FileOutput, Music, ScanText, FileInput,
} from "lucide-react";
import Link from "next/link";
const tools = [
  {
    icon: FileText,
    label: "Merge PDF",
    description: "Combine multiple PDFs into one seamless document",
    href: "/pdf/merge-pdf",
    iconBg: "#EEEDFE",
    iconColor: "#534AB7",
    tag: "PDF",
    tagBg: "#EEEDFE",
    tagColor: "#3C3489",
    accentColor: "rgba(99,102,241,0.08)",
    borderHover: "rgba(99,102,241,0.3)",
  },
  {
    icon: Scissors,
    label: "Split PDF",
    description: "Extract any pages from your PDF instantly",
    href: "/pdf/split-pdf",
    iconBg: "#E1F5EE",
    iconColor: "#0F6E56",
    tag: "PDF",
    tagBg: "#EEEDFE",
    tagColor: "#3C3489",
    accentColor: "rgba(16,185,129,0.08)",
    borderHover: "rgba(16,185,129,0.3)",
  },
  {
    icon: Minimize2,
    label: "Compress PDF",
    description: "Shrink PDF file size without losing quality",
    href: "/pdf/compress-pdf",
    iconBg: "#EEEDFE",
    iconColor: "#534AB7",
    tag: "PDF",
    tagBg: "#EEEDFE",
    tagColor: "#3C3489",
    accentColor: "rgba(99,102,241,0.08)",
    borderHover: "rgba(99,102,241,0.3)",
  },
  {
    icon: Image,
    label: "Compress Image",
    description: "Reduce image size while keeping it crisp",
    href: "/image/compress-image",
    iconBg: "#E1F5EE",
    iconColor: "#0F6E56",
    tag: "Image",
    tagBg: "#E1F5EE",
    tagColor: "#085041",
    accentColor: "rgba(16,185,129,0.08)",
    borderHover: "rgba(16,185,129,0.3)",
  },
  {
    icon: ScanText,
    label: "OCR",
    description: "Extract text from any image or scanned document",
    href: "/image/ocr",
    iconBg: "#FAEEDA",
    iconColor: "#854F0B",
    tag: "Image",
    tagBg: "#E1F5EE",
    tagColor: "#085041",
    accentColor: "rgba(245,158,11,0.08)",
    borderHover: "rgba(245,158,11,0.3)",
  },
  {
    icon: FileOutput,
    label: "DOCX to PDF",
    description: "Convert Word documents to PDF in seconds",
    href: "/document/docx-to-pdf",
    iconBg: "#EEEDFE",
    iconColor: "#534AB7",
    tag: "Document",
    tagBg: "#FAEEDA",
    tagColor: "#633806",
    accentColor: "rgba(99,102,241,0.08)",
    borderHover: "rgba(99,102,241,0.3)",
  },
  {
    icon: FileInput,
    label: "PDF to DOCX",
    description: "Turn any PDF back into an editable Word file",
    href: "/document/pdf-to-docx",
    iconBg: "#FBEAF0",
    iconColor: "#993556",
    tag: "Document",
    tagBg: "#FAEEDA",
    tagColor: "#633806",
    accentColor: "rgba(236,72,153,0.08)",
    borderHover: "rgba(236,72,153,0.3)",
  },
  {
    icon: Music,
    label: "MP4 to MP3",
    description: "Extract high quality audio from any video",
    href: "/audio/mp4-to-mp3",
    iconBg: "#FBEAF0",
    iconColor: "#993556",
    tag: "Audio",
    tagBg: "#FBEAF0",
    tagColor: "#72243E",
    accentColor: "rgba(236,72,153,0.08)",
    borderHover: "rgba(236,72,153,0.3)",
  },
];

export default function ToolsGrid() {
  return (
    <section id="tools" style={{ padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <span style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "rgba(99,102,241,0.1)",
            color: "#818cf8",
            border: "1px solid rgba(99,102,241,0.2)",
            marginBottom: "20px",
          }}>
            Popular Tools
          </span>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#fafafa",
            marginBottom: "16px",
            lineHeight: 1.15,
          }}>
            Everything You Need,{" "}
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              In One Place
            </span>
          </h2>
          <p style={{
            fontSize: "17px",
            color: "#71717a",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            All your file tools in one place — fast, private, and free.
          </p>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}>
          {tools.map((tool, index) => (
            <motion.a
              key={tool.label}
              href={tool.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "block",
                textDecoration: "none",
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "20px",
                padding: "28px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = tool.borderHover;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${tool.accentColor}`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#27272a";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Top row */}
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}>
                {/* Icon */}
                <div style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: tool.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <tool.icon style={{
                    width: "22px",
                    height: "22px",
                    color: tool.iconColor,
                  }} />
                </div>

                {/* Tag */}
                <span style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: "999px",
                  background: tool.tagBg,
                  color: tool.tagColor,
                }}>
                  {tool.tag}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: "17px",
                fontWeight: 600,
                color: "#fafafa",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}>
                {tool.label}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: "14px",
                color: "#71717a",
                lineHeight: 1.6,
                margin: 0,
              }}>
                {tool.description}
              </p>

              {/* Arrow */}
              <div style={{
                marginTop: "20px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#818cf8",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                Use tool →
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: 0.3 }}
  style={{ textAlign: "center", marginTop: "48px" }}
>
  <Link href="/tools" style={{ textDecoration: "none", display: "inline-block" }}>
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        padding: "14px 36px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "#fff",
        fontSize: "15px",
        fontWeight: 600,
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 0 32px rgba(99,102,241,0.25)",
      }}
    >
      View All 15+ Tools →
    </motion.button>
  </Link>
</motion.div>

      </div>
    </section>
  );
}