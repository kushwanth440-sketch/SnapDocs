"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import { FileText, Upload, Loader2, CheckCircle, Download, ArrowLeft } from "lucide-react";
import { main } from "framer-motion/client";
import { API_URL } from "@/lib/api";
function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Status = "idle" | "converting" | "done" | "error";

export default function TxtToPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("converted.pdf");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);

    // Show text preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsText(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"] },
    multiple: false,
  });

  const handleConvert = async () => {
    if (!file) return;
    setStatus("converting");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/document/txt-to-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Conversion failed");
      }

      const data = await response.json();
      const byteCharacters = atob(data.file);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setDownloadName(data.filename);
      setStatus("done");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "18px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", boxShadow: "0 0 32px rgba(99,102,241,0.3)",
          }}>
            <FileText style={{ width: "28px", height: "28px", color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fafafa", margin: "0 0 12px" }}>
            TXT to PDF
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Convert plain text files into clean, formatted PDFs.
          </p>
        </motion.div>

        {/* Dropzone */}
        {!file && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
                {isDragActive ? "Drop your .txt file here" : "Drag & drop a .txt file, or click to browse"}
              </p>
              <p style={{ fontSize: "13px", color: "#3f3f46", margin: 0 }}>Only .txt files supported</p>
            </div>
          </motion.div>
        )}

        {/* File loaded */}
        <AnimatePresence>
          {file && status !== "done" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* File info */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#111113", border: "1px solid #27272a",
                borderRadius: "14px", padding: "16px 20px", marginBottom: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FileText style={{ width: "20px", height: "20px", color: "#6366f1" }} />
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#fafafa", margin: 0 }}>{file.name}</p>
                    <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>{formatSize(file.size)}</p>
                  </div>
                </div>
                <button onClick={handleReset} style={{ fontSize: "13px", color: "#71717a", background: "none", border: "none", cursor: "pointer" }}>
                  Remove
                </button>
              </div>

              {/* Text preview */}
              {preview && (
                <div style={{
                  background: "#111113", border: "1px solid #27272a",
                  borderRadius: "14px", padding: "16px 20px", marginBottom: "20px",
                  maxHeight: "220px", overflowY: "auto",
                }}>
                  <p style={{ fontSize: "11px", color: "#52525b", fontWeight: 600, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Preview</p>
                  <pre style={{ fontSize: "13px", color: "#a1a1aa", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "monospace" }}>
                    {preview.slice(0, 1000)}{preview.length > 1000 ? "\n\n… (truncated)" : ""}
                  </pre>
                </div>
              )}

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
                  <><FileText style={{ width: "18px", height: "18px" }} /> Convert to PDF</>
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
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.25)",
                borderRadius: "16px", padding: "32px", textAlign: "center",
              }}
            >
              <CheckCircle style={{ width: "44px", height: "44px", color: "#6366f1", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: "20px", fontWeight: 700, color: "#fafafa", margin: "0 0 8px" }}>PDF Ready!</p>
              <p style={{ fontSize: "14px", color: "#71717a", margin: "0 0 28px" }}>Your text has been converted successfully.</p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href={downloadUrl} download={downloadName} target="_blank" rel="noreferrer" style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "12px 28px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff", fontSize: "15px", fontWeight: 600,
                    borderRadius: "12px", textDecoration: "none",
                    boxShadow: "0 0 24px rgba(99,102,241,0.3)",
                  }}>
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
                  Convert Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
