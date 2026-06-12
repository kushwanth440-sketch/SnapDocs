"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import {
  ImageDown, Upload, Loader2, CheckCircle, Download, ArrowLeft,
} from "lucide-react";
import { main } from "framer-motion/client";
import { API_URL } from "@/lib/api";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Status = "idle" | "compressing" | "done" | "error";

export default function CompressImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [status, setStatus] = useState<Status>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: false,
  });

  const handleCompress = async () => {
    if (!file) return;
    setStatus("compressing");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", String(quality));

      const response = await fetch(`${API_URL}/api/image/compress`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Compression failed");
      }

      const data = await response.json();
      const bytes = Uint8Array.from(atob(data.file), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: data.mime });
      const url = URL.createObjectURL(blob);

      const name = file.name.replace(/\.[^.]+$/, `_compressed.${data.ext}`);
      setDownloadUrl(url);
      setDownloadName(name);
      setOriginalSize(data.original_size);
      setCompressedSize(data.compressed_size);
      setStatus("done");
    } catch (e: unknown) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);
    setQuality(80);
  };

  const savedPercent = originalSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  const qualityLabel = quality >= 80 ? "High Quality" : quality >= 50 ? "Balanced" : "Small Size";
  const qualityColor = quality >= 80 ? "#10b981" : quality >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <main style={{ minHeight: "100vh", background: "#09090b" }}>
      <Navbar />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "120px 24px 80px" }}>

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
            background: "#E1F5EE", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 20px",
          }}>
            <ImageDown style={{ width: "28px", height: "28px", color: "#0F6E56" }} />
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
            color: "#fafafa", margin: "0 0 12px",
          }}>
            Compress Image
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Reduce image size without losing visible quality.
          </p>
        </motion.div>

        {/* Drop zone */}
        {!file && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? "#10b981" : "#27272a"}`,
                borderRadius: "20px", padding: "56px 32px",
                textAlign: "center", cursor: "pointer",
                background: isDragActive ? "rgba(16,185,129,0.05)" : "#111113",
                transition: "all 0.2s", marginBottom: "32px",
              }}
            >
              <input {...getInputProps()} />
              <Upload style={{ width: "36px", height: "36px", color: isDragActive ? "#10b981" : "#3f3f46", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: "16px", color: isDragActive ? "#10b981" : "#71717a", margin: "0 0 8px" }}>
                {isDragActive ? "Drop your image here" : "Drag & drop an image, or click to browse"}
              </p>
              <p style={{ fontSize: "13px", color: "#3f3f46", margin: 0 }}>JPG, PNG, WEBP supported</p>
            </div>
          </motion.div>
        )}

        {/* File + options */}
        <AnimatePresence>
          {file && status !== "done" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Preview */}
              {preview && (
                <div style={{
                  borderRadius: "16px", overflow: "hidden",
                  border: "1px solid #27272a", marginBottom: "20px",
                  background: "#111113",
                }}>
                  <img src={preview} alt="preview" style={{ width: "100%", maxHeight: "300px", objectFit: "contain", display: "block" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
                    <span style={{ fontSize: "13px", color: "#71717a" }}>{file.name}</span>
                    <span style={{ fontSize: "13px", color: "#71717a" }}>{formatSize(file.size)}</span>
                    <button onClick={handleReset} style={{ fontSize: "13px", color: "#71717a", background: "none", border: "none", cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Quality slider */}
              <div style={{
                background: "#111113", border: "1px solid #27272a",
                borderRadius: "14px", padding: "20px", marginBottom: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <p style={{ fontSize: "13px", color: "#71717a", fontWeight: 500, margin: 0 }}>QUALITY</p>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: qualityColor }}>
                    {quality}% — {qualityLabel}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#52525b" }}>Smallest</span>
                  <span style={{ fontSize: "11px", color: "#52525b" }}>Best Quality</span>
                </div>
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
                onClick={handleCompress}
                disabled={status === "compressing"}
                style={{
                  width: "100%", padding: "16px",
                  background: status === "compressing" ? "#27272a" : "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff", fontSize: "16px", fontWeight: 600,
                  borderRadius: "14px", border: "none",
                  cursor: status === "compressing" ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  boxShadow: status === "compressing" ? "none" : "0 0 32px rgba(16,185,129,0.25)",
                  transition: "all 0.2s",
                }}
              >
                {status === "compressing" ? (
                  <><Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} /> Compressing...</>
                ) : (
                  <><ImageDown style={{ width: "18px", height: "18px" }} /> Compress Image</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {status === "done" && downloadUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: "16px", padding: "32px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <CheckCircle style={{ width: "40px", height: "40px", color: "#10b981", margin: "0 auto 12px", display: "block" }} />
                <p style={{ fontSize: "18px", fontWeight: 600, color: "#fafafa", margin: "0 0 4px" }}>
                  Compression Complete!
                </p>
                <p style={{ fontSize: "14px", color: "#71717a", margin: 0 }}>
                  Saved {savedPercent}% of file size
                </p>
              </div>

              {/* Size stats */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px", marginBottom: "24px",
              }}>
                {[
                  { label: "Original", value: formatSize(originalSize), color: "#71717a" },
                  { label: "Compressed", value: formatSize(compressedSize), color: "#10b981" },
                  { label: "Saved", value: `${savedPercent}%`, color: "#818cf8" },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    background: "#111113", border: "1px solid #27272a",
                    borderRadius: "12px", padding: "16px", textAlign: "center",
                  }}>
                    <p style={{ fontSize: "18px", fontWeight: 700, color: stat.color, margin: "0 0 4px" }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: "12px", color: "#52525b", margin: 0 }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Compressed preview */}
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #27272a", marginBottom: "20px" }}>
                <img src={downloadUrl} alt="compressed" style={{ width: "100%", maxHeight: "300px", objectFit: "contain", display: "block" }} />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={downloadUrl}
                  download={downloadName}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#fff", fontSize: "15px", fontWeight: 600,
                    borderRadius: "12px", textDecoration: "none",
                    boxShadow: "0 0 24px rgba(16,185,129,0.3)",
                  }}
                >
                  <Download style={{ width: "16px", height: "16px" }} />
                  Download {downloadName}
                </a>
                <button
                  onClick={handleReset}
                  style={{
                    padding: "12px 24px", background: "transparent",
                    color: "#a1a1aa", fontSize: "15px", fontWeight: 600,
                    borderRadius: "12px", border: "1px solid #27272a", cursor: "pointer",
                  }}
                >
                  Compress Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
