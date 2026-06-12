"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import {
  FileOutput, Upload, Loader2, CheckCircle, Download, ArrowLeft, FileText,
} from "lucide-react";
import { i, main } from "framer-motion/m";
import { API_URL } from "@/lib/api";
function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Status = "idle" | "converting" | "done" | "error";

export default function DocxToPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
    multiple: false,
  });

  const handleConvert = async () => {
    if (!file) return;
    setStatus("converting");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/document/docx-to-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Conversion failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const name = file.name.replace(".docx", ".pdf");
      setDownloadUrl(url);
      setDownloadName(name);
      setStatus("done");
    } catch (e: unknown) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);
  };

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
            background: "#FAEEDA", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 20px",
          }}>
            <FileOutput style={{ width: "28px", height: "28px", color: "#854F0B" }} />
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
            color: "#fafafa", margin: "0 0 12px",
          }}>
            DOCX to PDF
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Convert Word documents to PDF with formatting preserved.
          </p>
        </motion.div>

        {/* Drop zone */}
        {!file && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? "#f59e0b" : "#27272a"}`,
                borderRadius: "20px", padding: "56px 32px",
                textAlign: "center", cursor: "pointer",
                background: isDragActive ? "rgba(245,158,11,0.05)" : "#111113",
                transition: "all 0.2s", marginBottom: "32px",
              }}
            >
              <input {...getInputProps()} />
              <Upload style={{ width: "36px", height: "36px", color: isDragActive ? "#f59e0b" : "#3f3f46", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: "16px", color: isDragActive ? "#f59e0b" : "#71717a", margin: "0 0 8px" }}>
                {isDragActive ? "Drop your DOCX here" : "Drag & drop a DOCX file, or click to browse"}
              </p>
              <p style={{ fontSize: "13px", color: "#3f3f46", margin: 0 }}>.docx files only</p>
            </div>
          </motion.div>
        )}

        {/* File card */}
        <AnimatePresence>
          {file && status !== "done" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ marginBottom: "20px" }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "#111113", border: "1px solid #27272a",
                borderRadius: "14px", padding: "14px 16px", marginBottom: "20px",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "#FAEEDA", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <FileText style={{ width: "18px", height: "18px", color: "#854F0B" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: "14px", fontWeight: 500, color: "#fafafa",
                    margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{file.name}</p>
                  <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>{formatSize(file.size)}</p>
                </div>
                <button onClick={handleReset} style={{
                  fontSize: "13px", color: "#71717a", background: "none",
                  border: "none", cursor: "pointer",
                }}>
                  Remove
                </button>
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
                  background: status === "converting"
                    ? "#27272a"
                    : "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#fff", fontSize: "16px", fontWeight: 600,
                  borderRadius: "14px", border: "none",
                  cursor: status === "converting" ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                  boxShadow: status === "converting" ? "none" : "0 0 32px rgba(245,158,11,0.25)",
                  transition: "all 0.2s",
                }}
              >
                {status === "converting" ? (
                  <>
                    <Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} />
                    Converting...
                  </>
                ) : (
                  <>
                    <FileOutput style={{ width: "18px", height: "18px" }} />
                    Convert to PDF
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
                Conversion Successful!
              </p>
              <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "24px" }}>
                Your PDF is ready to download.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={downloadUrl}
                  download={downloadName}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "#fff", fontSize: "15px", fontWeight: 600,
                    borderRadius: "12px", textDecoration: "none",
                    boxShadow: "0 0 24px rgba(245,158,11,0.3)",
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
