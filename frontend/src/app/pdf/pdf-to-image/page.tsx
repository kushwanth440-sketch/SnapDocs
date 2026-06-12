"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import {
  Image, Upload, Loader2, CheckCircle, Download, ArrowLeft, FileText,
} from "lucide-react";
import { div, main } from "framer-motion/client";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Format = "png" | "jpg";
type Status = "idle" | "converting" | "done" | "error";

interface ImageFile {
  name: string;
  data: string;
  mime: string;
  url?: string;
}

export default function PDFToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("png");
  const [status, setStatus] = useState<Status>("idle");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setStatus("idle");
    setImages([]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleConvert = async () => {
    if (!file) return;
    setStatus("converting");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", format);

      const response = await fetch(`${API_URL}/api/pdf/pdf-to-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Conversion failed");
      }

      const data = await response.json();
      const result: ImageFile[] = data.images.map((img: ImageFile) => {
        const bytes = Uint8Array.from(atob(img.data), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: img.mime });
        return { ...img, url: URL.createObjectURL(blob) };
      });

      setImages(result);
      setStatus("done");
    } catch (e: unknown) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setImages([]);
    setError(null);
  };

  const downloadAll = () => {
    images.forEach((img, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = img.url!;
        a.download = img.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, i * 500);
    });
  };

  return (
    <main style={{ minHeight: "100vh", background: "#09090b" }}>
      <Navbar />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "120px 24px 80px" }}>

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <div style={{
            width: "64px", height: "64px", borderRadius: "18px",
            background: "#EEEDFE", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 20px",
          }}>
            <Image style={{ width: "28px", height: "28px", color: "#534AB7" }} />
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
            color: "#fafafa", margin: "0 0 12px",
          }}>
            PDF to Image
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Convert each PDF page into a high quality image.
          </p>
        </motion.div>

        {/* Drop zone */}
        {!file && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? "#6366f1" : "#27272a"}`,
                borderRadius: "20px", padding: "56px 32px",
                textAlign: "center", cursor: "pointer",
                background: isDragActive ? "rgba(99,102,241,0.05)" : "#111113",
                transition: "all 0.2s", marginBottom: "32px",
              }}
            >
              <input {...getInputProps()} />
              <Upload style={{ width: "36px", height: "36px", color: isDragActive ? "#6366f1" : "#3f3f46", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: "16px", color: isDragActive ? "#6366f1" : "#71717a", margin: "0 0 8px" }}>
                {isDragActive ? "Drop your PDF here" : "Drag & drop a PDF, or click to browse"}
              </p>
              <p style={{ fontSize: "13px", color: "#3f3f46", margin: 0 }}>.pdf files only</p>
            </div>
          </motion.div>
        )}

        {/* File + options */}
        <AnimatePresence>
          {file && status !== "done" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* File row */}
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "#111113", border: "1px solid #27272a",
                borderRadius: "14px", padding: "14px 16px", marginBottom: "24px",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "#EEEDFE", display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}>
                  <FileText style={{ width: "18px", height: "18px", color: "#534AB7" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#fafafa", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>{formatSize(file.size)}</p>
                </div>
                <button onClick={handleReset} style={{ fontSize: "13px", color: "#71717a", background: "none", border: "none", cursor: "pointer" }}>
                  Remove
                </button>
              </div>

              {/* Format selector */}
              <p style={{ fontSize: "13px", color: "#71717a", marginBottom: "10px", fontWeight: 500 }}>
                OUTPUT FORMAT
              </p>
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                {(["png", "jpg"] as Format[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    style={{
                      flex: 1, padding: "12px",
                      borderRadius: "12px", border: `1px solid ${format === f ? "rgba(99,102,241,0.5)" : "#27272a"}`,
                      background: format === f ? "rgba(99,102,241,0.1)" : "#111113",
                      color: format === f ? "#818cf8" : "#71717a",
                      fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>

              {error && (
                <div style={{
                  padding: "12px 16px", background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px",
                  fontSize: "14px", color: "#f87171", marginBottom: "16px",
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleConvert}
                disabled={status === "converting"}
                style={{
                  width: "100%", padding: "16px",
                  background: status === "converting" ? "#27272a" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", fontSize: "16px", fontWeight: 600,
                  borderRadius: "14px", border: "none",
                  cursor: status === "converting" ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  boxShadow: status === "converting" ? "none" : "0 0 32px rgba(99,102,241,0.25)",
                  transition: "all 0.2s",
                }}
              >
                {status === "converting" ? (
                  <><Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} /> Converting...</>
                ) : (
                  <><Image style={{ width: "18px", height: "18px" }} /> Convert to {format.toUpperCase()}</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {status === "done" && images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <CheckCircle style={{ width: "40px", height: "40px", color: "#10b981", margin: "0 auto 12px", display: "block" }} />
                <p style={{ fontSize: "18px", fontWeight: 600, color: "#fafafa", margin: "0 0 4px" }}>
                  {images.length} page{images.length > 1 ? "s" : ""} converted!
                </p>
                <p style={{ fontSize: "14px", color: "#71717a", margin: 0 }}>
                  Preview and download each page below.
                </p>
              </div>

              {/* Download all button */}
              {images.length > 1 && (
                <button
                  onClick={downloadAll}
                  style={{
                    width: "100%", padding: "14px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff", fontSize: "15px", fontWeight: 600,
                    borderRadius: "14px", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    boxShadow: "0 0 24px rgba(99,102,241,0.25)",
                    marginBottom: "20px",
                  }}
                >
                  <Download style={{ width: "16px", height: "16px" }} />
                  Download All ({images.length} images)
                </button>
              )}

              {/* Image previews */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: "#111113", border: "1px solid #27272a",
                      borderRadius: "16px", overflow: "hidden",
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      style={{ width: "100%", display: "block" }}
                    />
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px",
                    }}>
                      <span style={{ fontSize: "13px", color: "#71717a" }}>{img.name}</span>
                      <a
                        href={img.url}
                        download={img.name}
                        style={{
                          display: "flex", alignItems: "center", gap: "6px",
                          padding: "8px 14px", borderRadius: "8px",
                          background: "rgba(99,102,241,0.1)",
                          border: "1px solid rgba(99,102,241,0.3)",
                          color: "#818cf8", fontSize: "13px", fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        <Download style={{ width: "12px", height: "12px" }} />
                        Download
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={handleReset}
                style={{
                  width: "100%", padding: "12px", background: "transparent",
                  color: "#a1a1aa", fontSize: "14px", fontWeight: 600,
                  borderRadius: "12px", border: "1px solid #27272a", cursor: "pointer",
                }}
              >
                Convert Another PDF
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
