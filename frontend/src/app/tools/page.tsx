"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/ui/layout/Navbar";
import Footer from "@/components/ui/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  FileText, Scissors, Minimize2, Image,
  FileOutput, FileInput, Music, ScanText,
  FileAudio, Video, Type, QrCode,
  AlignLeft, ImageDown, ImageUp,
} from "lucide-react";

const toolCategories = [
  {
    category: "PDF Tools",
    description: "Everything you need to work with PDF files",
    color: "#6366f1",
    bgColor: "rgba(99,102,241,0.08)",
    borderColor: "rgba(99,102,241,0.2)",
    tools: [
      { icon: FileText, label: "Merge PDF", description: "Combine multiple PDFs into one", href: "/pdf/merge-pdf", iconBg: "#EEEDFE", iconColor: "#534AB7" },
      { icon: Scissors, label: "Split PDF", description: "Extract pages from any PDF", href: "/pdf/split-pdf", iconBg: "#EEEDFE", iconColor: "#534AB7" },
      { icon: Minimize2, label: "Compress PDF", description: "Reduce PDF size instantly", href: "/pdf/compress-pdf", iconBg: "#EEEDFE", iconColor: "#534AB7" },
      { icon: Image, label: "PDF to Image", description: "Convert PDF pages to PNG or JPG", href: "/pdf/pdf-to-image", iconBg: "#EEEDFE", iconColor: "#534AB7" },
      { icon: ImageUp, label: "Image to PDF", description: "Convert images into a PDF", href: "/pdf/image-to-pdf", iconBg: "#EEEDFE", iconColor: "#534AB7" },
    ],
  },
  {
    category: "Document Tools",
    description: "Convert and transform your documents",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.08)",
    borderColor: "rgba(245,158,11,0.2)",
    tools: [
      { icon: FileOutput, label: "DOCX to PDF", description: "Convert Word docs to PDF", href: "/document/docx-to-pdf", iconBg: "#FAEEDA", iconColor: "#854F0B" },
      { icon: FileInput, label: "PDF to DOCX", description: "Convert PDF back to Word", href: "/document/pdf-to-docx", iconBg: "#FAEEDA", iconColor: "#854F0B" },
      { icon: Type, label: "TXT to PDF", description: "Convert plain text to PDF", href: "/document/txt-to-pdf", iconBg: "#FAEEDA", iconColor: "#854F0B" },
    ],
  },
  {
    category: "Image Tools",
    description: "Compress, resize, convert and extract from images",
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.08)",
    borderColor: "rgba(16,185,129,0.2)",
    tools: [
      { icon: ImageDown, label: "Compress Image", description: "Reduce image size without quality loss", href: "/image/compress-image", iconBg: "#E1F5EE", iconColor: "#0F6E56" },
      { icon: Image, label: "Resize Image", description: "Resize for any platform", href: "/image/resize-image", iconBg: "#E1F5EE", iconColor: "#0F6E56" },
      { icon: Image, label: "Image Converter", description: "Convert between JPG, PNG, WEBP", href: "/image/convert-image", iconBg: "#E1F5EE", iconColor: "#0F6E56" },
      { icon: ScanText, label: "OCR", description: "Extract text from any image", href: "/image/ocr", iconBg: "#E1F5EE", iconColor: "#0F6E56" },
    ],
  },
  {
    category: "Audio & Video Tools",
    description: "Transcribe, convert and extract audio",
    color: "#ec4899",
    bgColor: "rgba(236,72,153,0.08)",
    borderColor: "rgba(236,72,153,0.2)",
    tools: [
      { icon: FileAudio, label: "Audio to Text", description: "Transcribe any audio file", href: "/audio/transcribe", iconBg: "#FBEAF0", iconColor: "#993556" },
      { icon: Music, label: "MP4 to MP3", description: "Extract audio from video", href: "/audio/mp4-to-mp3", iconBg: "#FBEAF0", iconColor: "#993556" },
      { icon: Video, label: "Video to Text", description: "Transcribe video automatically", href: "/audio/video-to-text", iconBg: "#FBEAF0", iconColor: "#993556" },
    ],
  },
  {
    category: "Utility Tools",
    description: "Handy tools for everyday tasks",
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.08)",
    borderColor: "rgba(139,92,246,0.2)",
    tools: [
      { icon: AlignLeft, label: "Word Counter", description: "Count words, characters and reading time", href: "/utility-tools/word-counter", iconBg: "#EEEDFE", iconColor: "#534AB7" },
      { icon: QrCode, label: "QR Generator", description: "Generate QR codes instantly", href: "/utility-tools/qr", iconBg: "#EEEDFE", iconColor: "#534AB7" },
      { icon: ScanText, label: "QR Scanner", description: "Decode QR codes from images", href: "/utility-tools/qr-scanner", iconBg: "#EEEDFE", iconColor: "#534AB7" },
    ],
  },
];

export default function ToolsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#09090b" }}>
      <Navbar />

      <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>

            {/* Back */}
        <div style={{ marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
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
              Home
            </span>
          </Link>
        </div>


          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: "64px" }}
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
              15+ Free Tools
            </span>
            <h1 style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#fafafa",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}>
              15+ Free Tools,{" "}
              <span style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                One Platform
              </span>
            </h1>
            <p style={{
              fontSize: "18px",
              color: "#71717a",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}>
              All your file conversion tools — private, fast, and free.
            </p>
          </motion.div>

          {/* Categories */}
          <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
            {toolCategories.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              >
                {/* Category Header */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                  paddingBottom: "16px",
                  borderBottom: `1px solid #27272a`,
                }}>
                  <div style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: category.color,
                    boxShadow: `0 0 10px ${category.color}`,
                  }} />
                  <h2 style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#fafafa",
                    margin: 0,
                  }}>
                    {category.category}
                  </h2>
                  <span style={{
                    fontSize: "13px",
                    color: "#71717a",
                    marginLeft: "4px",
                  }}>
                    — {category.description}
                  </span>
                </div>

                {/* Tools Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "16px",
                }}>
                  {category.tools.map((tool, toolIndex) => (
                    <motion.div
                      key={tool.label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: toolIndex * 0.06 }}
                    >
                      <Link
                        href={tool.href}
                        style={{ textDecoration: "none", display: "block" }}
                      >
                        <div
                          style={{
                            background: "#18181b",
                            border: "1px solid #27272a",
                            borderRadius: "16px",
                            padding: "24px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "16px",
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = category.color;
                            (e.currentTarget as HTMLElement).style.background = category.bgColor;
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = "#27272a";
                            (e.currentTarget as HTMLElement).style.background = "#18181b";
                          }}
                        >
                          {/* Icon */}
                          <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: tool.iconBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            <tool.icon style={{
                              width: "20px",
                              height: "20px",
                              color: tool.iconColor,
                            }} />
                          </div>

                          {/* Text */}
                          <div>
                            <h3 style={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#fafafa",
                              marginBottom: "4px",
                            }}>
                              {tool.label}
                            </h3>
                            <p style={{
                              fontSize: "13px",
                              color: "#71717a",
                              lineHeight: 1.5,
                              margin: 0,
                            }}>
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}