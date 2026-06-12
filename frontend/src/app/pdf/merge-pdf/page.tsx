"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import {
  FileText, X, ArrowUp, ArrowDown,
  Upload, Loader2, CheckCircle, Download, ArrowLeft,
} from "lucide-react";
interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Status = "idle" | "merging" | "done" | "error";

export default function MergePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatSize(file.size),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...files];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFiles(updated);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const updated = [...files];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setFiles(updated);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files to merge.");
      return;
    }
    setStatus("merging");
    setError(null);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f.file));
      const response = await fetch(`${API_URL}/api/pdf/merge`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Merge failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#09090b" }}>
      <Navbar />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "120px 24px 80px" }}>

        {/* Back to All Tools */}
        <div style={{ marginBottom: "32px" }}>
          <Link href="/tools" style={{ textDecoration: "none" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "9px 16px", borderRadius: "10px",
              border: "1px solid rgba(99,102,241,0.4)",
              background: "rgba(99,102,241,0.1)",
              fontSize: "13px", fontWeight: 600, color: "#818cf8", cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 0 12px rgba(99,102,241,0.15)",
            }}>
              <ArrowLeft style={{ width: "14px", height: "14px" }} />
              All Tools
            </span>
          </Link>
        </div>

        {/* Header */}
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
            <FileText style={{ width: "28px", height: "28px", color: "#534AB7" }} />
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
            color: "#fafafa", marginBottom: "12px", letterSpacing: "-0.02em",
          }}>
            Merge PDF
          </h1>
          <p style={{
            fontSize: "16px", color: "#71717a",
            maxWidth: "420px", margin: "0 auto", lineHeight: 1.7,
          }}>
            Combine multiple PDF files into one. Drag to reorder before merging.
          </p>

          {/* Steps */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", marginTop: "24px", flexWrap: "wrap",
          }}>
            {["Upload PDFs", "Reorder", "Download"].map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 14px", borderRadius: "999px",
                  background: i === 0 ? "rgba(99,102,241,0.15)" : "#18181b",
                  border: `1px solid ${i === 0 ? "rgba(99,102,241,0.3)" : "#27272a"}`,
                }}>
                  <span style={{
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: i === 0 ? "#6366f1" : "#27272a",
                    color: "#fff", fontSize: "11px", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: "13px", color: i === 0 ? "#818cf8" : "#71717a" }}>
                    {step}
                  </span>
                </div>
                {i < 2 && <span style={{ color: "#27272a", fontSize: "16px" }}>→</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: "24px" }}
        >
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? "#6366f1" : "#27272a"}`,
              borderRadius: "20px", padding: "48px 24px", textAlign: "center",
              cursor: "pointer",
              background: isDragActive ? "rgba(99,102,241,0.05)" : "#18181b",
              transition: "all 0.2s",
            }}
          >
            <input {...getInputProps()} />
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <Upload style={{ width: "22px", height: "22px", color: "#6366f1" }} />
            </div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#fafafa", marginBottom: "6px" }}>
              {isDragActive ? "Drop your PDFs here..." : "Drag & drop PDF files here"}
            </p>
            <p style={{ fontSize: "13px", color: "#71717a", marginBottom: "16px" }}>
              or click to browse your files
            </p>
            <span style={{
              padding: "6px 16px", background: "#09090b",
              border: "1px solid #27272a", borderRadius: "999px",
              fontSize: "12px", color: "#71717a",
            }}>
              PDF files only · Max 50MB each
            </span>
          </div>
        </motion.div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: "24px" }}
            >
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: "12px",
              }}>
                <p style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 500 }}>
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </p>
                <button onClick={handleReset} style={{
                  fontSize: "13px", color: "#71717a", background: "none",
                  border: "none", cursor: "pointer", textDecoration: "underline",
                }}>
                  Clear all
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "14px 16px", background: "#18181b",
                      border: "1px solid #27272a", borderRadius: "12px",
                    }}
                  >
                    <span style={{
                      width: "24px", height: "24px", borderRadius: "6px",
                      background: "rgba(99,102,241,0.15)", color: "#818cf8",
                      fontSize: "12px", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {index + 1}
                    </span>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      background: "#EEEDFE", display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <FileText style={{ width: "16px", height: "16px", color: "#534AB7" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: "14px", fontWeight: 500, color: "#fafafa",
                        margin: 0, overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {file.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
                        {file.size}
                      </p>
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
                      <button onClick={() => moveDown(index)} disabled={index === files.length - 1} style={{
                        width: "28px", height: "28px", borderRadius: "6px",
                        background: "transparent", border: "1px solid #27272a",
                        cursor: index === files.length - 1 ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: index === files.length - 1 ? 0.3 : 1,
                      }}>
                        <ArrowDown style={{ width: "12px", height: "12px", color: "#a1a1aa" }} />
                      </button>
                      <button onClick={() => removeFile(file.id)} style={{
                        width: "28px", height: "28px", borderRadius: "6px",
                        background: "transparent", border: "1px solid #27272a",
                        cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <X style={{ width: "12px", height: "12px", color: "#a1a1aa" }} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "14px 18px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "12px", fontSize: "14px",
                color: "#f87171", marginBottom: "16px",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Merge Button */}
        <AnimatePresence>
          {files.length > 0 && status !== "done" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={handleMerge}
                disabled={status === "merging"}
                style={{
                  width: "100%", padding: "16px",
                  background: status === "merging"
                    ? "#27272a"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", fontSize: "16px", fontWeight: 600,
                  borderRadius: "14px", border: "none",
                  cursor: status === "merging" ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                  boxShadow: status === "merging" ? "none" : "0 0 32px rgba(99,102,241,0.25)",
                  transition: "all 0.2s",
                }}
              >
                {status === "merging" ? (
                  <>
                    <Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} />
                    Merging PDFs...
                  </>
                ) : (
                  <>
                    <FileText style={{ width: "18px", height: "18px" }} />
                    Merge {files.length} PDF{files.length > 1 ? "s" : ""}
                  </>
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
              <CheckCircle style={{
                width: "40px", height: "40px",
                color: "#10b981", margin: "0 auto 12px", display: "block",
              }} />
              <p style={{ fontSize: "18px", fontWeight: 600, color: "#fafafa", marginBottom: "6px" }}>
                PDFs Merged Successfully!
              </p>
              <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "24px" }}>
                Your merged PDF is ready to download.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={downloadUrl}
                  download="merged.pdf"
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
                  Download merged.pdf
                </a>
                <button
                  onClick={handleReset}
                  style={{
                    padding: "12px 24px", background: "transparent",
                    color: "#a1a1aa", fontSize: "15px", fontWeight: 600,
                    borderRadius: "12px", border: "1px solid #27272a", cursor: "pointer",
                  }}
                >
                  Merge More Files
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
