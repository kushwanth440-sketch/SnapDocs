"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import {
  ImageUp, Upload, Loader2, CheckCircle, Download, ArrowLeft, X, ArrowUp, ArrowDown,
} from "lucide-react";
import { main } from "framer-motion/client";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Status = "idle" | "converting" | "done" | "error";

interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: string;
  preview: string;
}

export default function ImageToPDFPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatSize(file.size),
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: true,
  });

  const removeImage = (id: string) => setImages((prev) => prev.filter((i) => i.id !== id));

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setImages(updated);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setImages(updated);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setStatus("converting");
    setError(null);

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("files", img.file));

      const response = await fetch("http://localhost:8000/api/pdf/image-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Conversion failed");
      }

      const data = await response.json();
      const bytes = Uint8Array.from(atob(data.file), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e: unknown) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  const handleReset = () => {
    setImages([]);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);
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
            <ImageUp style={{ width: "28px", height: "28px", color: "#534AB7" }} />
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
            color: "#fafafa", margin: "0 0 12px",
          }}>
            Image to PDF
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Combine multiple images into a single PDF. Drag to reorder.
          </p>
        </motion.div>

        {/* Drop zone — always visible */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? "#6366f1" : "#27272a"}`,
              borderRadius: "20px", padding: "40px 32px",
              textAlign: "center", cursor: "pointer",
              background: isDragActive ? "rgba(99,102,241,0.05)" : "#111113",
              transition: "all 0.2s", marginBottom: "24px",
            }}
          >
            <input {...getInputProps()} />
            <Upload style={{ width: "32px", height: "32px", color: isDragActive ? "#6366f1" : "#3f3f46", margin: "0 auto 12px", display: "block" }} />
            <p style={{ fontSize: "15px", color: isDragActive ? "#6366f1" : "#71717a", margin: "0 0 6px" }}>
              {isDragActive ? "Drop images here" : "Drag & drop images, or click to browse"}
            </p>
            <p style={{ fontSize: "13px", color: "#3f3f46", margin: 0 }}>JPG, PNG, WEBP supported</p>
          </div>
        </motion.div>

        {/* Image list */}
        <AnimatePresence>
          {images.length > 0 && status !== "done" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "12px",
              }}>
                <p style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 500, margin: 0 }}>
                  {images.length} image{images.length > 1 ? "s" : ""} selected
                </p>
                <button onClick={handleReset} style={{
                  fontSize: "13px", color: "#71717a", background: "none",
                  border: "none", cursor: "pointer", textDecoration: "underline",
                }}>
                  Clear all
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {images.map((img, index) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      background: "#111113", border: "1px solid #27272a",
                      borderRadius: "12px", padding: "10px 14px",
                    }}
                  >
                    {/* Thumbnail */}
                    <img
                      src={img.preview}
                      alt={img.name}
                      style={{
                        width: "48px", height: "48px", borderRadius: "8px",
                        objectFit: "cover", flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: "14px", fontWeight: 500, color: "#fafafa",
                        margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>{img.name}</p>
                      <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>{img.size}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <button onClick={() => moveUp(index)} disabled={index === 0} style={{
                        width: "28px", height: "28px", borderRadius: "6px",
                        background: "transparent", border: "1px solid #27272a",
                        cursor: index === 0 ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: index === 0 ? 0.3 : 1,
                      }}>
                        <ArrowUp style={{ width: "12px", height: "12px", color: "#a1a1aa" }} />
                      </button>
                      <button onClick={() => moveDown(index)} disabled={index === images.length - 1} style={{
                        width: "28px", height: "28px", borderRadius: "6px",
                        background: "transparent", border: "1px solid #27272a",
                        cursor: index === images.length - 1 ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: index === images.length - 1 ? 0.3 : 1,
                      }}>
                        <ArrowDown style={{ width: "12px", height: "12px", color: "#a1a1aa" }} />
                      </button>
                      <button onClick={() => removeImage(img.id)} style={{
                        width: "28px", height: "28px", borderRadius: "6px",
                        background: "transparent", border: "1px solid #27272a",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <X style={{ width: "12px", height: "12px", color: "#a1a1aa" }} />
                      </button>
                    </div>
                  </motion.div>
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
                  <><ImageUp style={{ width: "18px", height: "18px" }} /> Convert {images.length} Image{images.length > 1 ? "s" : ""} to PDF</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download */}
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
                borderRadius: "16px", padding: "32px", textAlign: "center",
              }}
            >
              <CheckCircle style={{ width: "40px", height: "40px", color: "#10b981", margin: "0 auto 12px", display: "block" }} />
              <p style={{ fontSize: "18px", fontWeight: 600, color: "#fafafa", marginBottom: "6px" }}>
                PDF Created Successfully!
              </p>
              <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "24px" }}>
                Your PDF with {images.length} page{images.length > 1 ? "s" : ""} is ready.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={downloadUrl}
                  download="images.pdf"
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff", fontSize: "15px", fontWeight: 600,
                    borderRadius: "12px", textDecoration: "none",
                    boxShadow: "0 0 24px rgba(99,102,241,0.3)",
                  }}
                >
                  <Download style={{ width: "16px", height: "16px" }} />
                  Download PDF
                </a>
                <button
                  onClick={handleReset}
                  style={{
                    padding: "12px 24px", background: "transparent",
                    color: "#a1a1aa", fontSize: "15px", fontWeight: 600,
                    borderRadius: "12px", border: "1px solid #27272a", cursor: "pointer",
                  }}
                >
                  Convert More
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}