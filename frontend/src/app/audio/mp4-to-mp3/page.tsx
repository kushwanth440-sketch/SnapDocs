"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import { FileAudio, Upload, Loader2, CheckCircle, ArrowLeft, Download } from "lucide-react";
import { API_URL } from "@/lib/api";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Status = "idle" | "converting" | "done" | "error";

export default function Mp4ToMp3Page() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{ file: string; filename: string; mime: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/mp4": [".mp4"] },
    multiple: false,
  });

  const handleConvert = async () => {
    if (!file) return;
    setStatus("converting");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/audio/mp4-to-mp3`, {
        
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Conversion failed");
      }

      const data = await response.json();
      setResult(data);
      setStatus("done");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const bytes = atob(result.file);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: result.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setResult(null);
    setError(null);
  };

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

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "18px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", boxShadow: "0 0 32px rgba(16,185,129,0.3)",
          }}>
            <FileAudio style={{ width: "28px", height: "28px", color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fafafa", margin: "0 0 12px" }}>
            MP4 to MP3
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Extract audio from any MP4 video file.
          </p>
        </motion.div>

        {!file && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div {...getRootProps()} style={{
              border: `2px dashed ${isDragActive ? "#10b981" : "#27272a"}`,
              borderRadius: "20px", padding: "56px 32px",
              textAlign: "center", cursor: "pointer",
              background: isDragActive ? "rgba(16,185,129,0.05)" : "#111113",
              transition: "all 0.2s", marginBottom: "32px",
            }}>
              <input {...getInputProps()} />
              <Upload style={{ width: "36px", height: "36px", color: isDragActive ? "#10b981" : "#3f3f46", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: "16px", color: isDragActive ? "#10b981" : "#71717a", margin: "0 0 8px" }}>
                {isDragActive ? "Drop your MP4 here" : "Drag & drop an MP4 file, or click to browse"}
              </p>
              <p style={{ fontSize: "13px", color: "#3f3f46", margin: 0 }}>MP4 files only</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {file && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px", background: "#111113",
                border: "1px solid #27272a", borderRadius: "14px", marginBottom: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FileAudio style={{ width: "18px", height: "18px", color: "#10b981" }} />
                  <span style={{ fontSize: "14px", color: "#e4e4e7" }}>{file.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#71717a" }}>{formatSize(file.size)}</span>
                  <button onClick={handleReset} style={{ fontSize: "13px", color: "#71717a", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                </div>
              </div>

              {status !== "done" && (
                <>
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
                      background: status === "converting" ? "#27272a" : "linear-gradient(135deg, #10b981, #059669)",
                      color: "#fff", fontSize: "16px", fontWeight: 600,
                      borderRadius: "14px", border: "none",
                      cursor: status === "converting" ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      boxShadow: status === "converting" ? "none" : "0 0 32px rgba(16,185,129,0.25)",
                      transition: "all 0.2s",
                    }}
                  >
                    {status === "converting" ? (
                      <><Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} /> Converting...</>
                    ) : (
                      <><FileAudio style={{ width: "18px", height: "18px" }} /> Convert to MP3</>
                    )}
                  </button>
                </>
              )}

              <AnimatePresence>
                {status === "done" && result && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: "24px" }}>
                    <div style={{
                      background: "rgba(16,185,129,0.06)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      borderRadius: "16px", padding: "24px", textAlign: "center",
                    }}>
                      <CheckCircle style={{ width: "40px", height: "40px", color: "#10b981", margin: "0 auto 16px", display: "block" }} />
                      <p style={{ fontSize: "16px", fontWeight: 600, color: "#fafafa", margin: "0 0 8px" }}>Conversion Complete!</p>
                      <p style={{ fontSize: "13px", color: "#71717a", margin: "0 0 24px" }}>{result.filename}</p>
                      <button onClick={handleDownload} style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        padding: "12px 28px",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "#fff", fontSize: "15px", fontWeight: 600,
                        borderRadius: "12px", border: "none", cursor: "pointer",
                        boxShadow: "0 0 24px rgba(16,185,129,0.25)",
                      }}>
                        <Download style={{ width: "18px", height: "18px" }} /> Download MP3
                      </button>
                      <br />
                      <button onClick={handleReset} style={{
                        marginTop: "16px", padding: "10px 20px",
                        background: "transparent", color: "#71717a",
                        border: "1px solid #27272a", borderRadius: "10px",
                        fontSize: "14px", cursor: "pointer",
                      }}>
                        Convert Another
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
