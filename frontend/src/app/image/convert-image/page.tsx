"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import { RefreshCw, Upload, Loader2, CheckCircle, Download, ArrowLeft } from "lucide-react";
import { API_URL } from "@/lib/api";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Status = "idle" | "converting" | "done" | "error";

export default function ConvertImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("webp");
  const [status, setStatus] = useState<Status>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("converted");
  const [error, setError] = useState<string | null>(null);

  const getInputFormat = () => file?.name.split(".").pop()?.toLowerCase() || "";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);
    setPreview(URL.createObjectURL(f));

    // Auto-select a different format than the input
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "jpeg") setOutputFormat("webp");
    else if (ext === "png") setOutputFormat("jpeg");
    else if (ext === "webp") setOutputFormat("png");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: false,
  });

  const handleConvert = async () => {
    if (!file) return;
    setStatus("converting");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("output_format", outputFormat);

      const response = await fetch(`${API_URL}/api/image/convert-image`, {
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
      const blob = new Blob([byteArray], { type: data.media_type });
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

  const formats = ["jpeg", "png", "webp"];

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
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", boxShadow: "0 0 32px rgba(59,130,246,0.3)",
          }}>
            <RefreshCw style={{ width: "28px", height: "28px", color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fafafa", margin: "0 0 12px" }}>
            Convert Image
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Convert between JPEG, PNG, and WEBP formats.
          </p>
        </motion.div>

        {/* Dropzone */}
        {!file && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? "#3b82f6" : "#27272a"}`,
                borderRadius: "20px", padding: "56px 32px",
                textAlign: "center", cursor: "pointer",
                background: isDragActive ? "rgba(59,130,246,0.05)" : "#111113",
                transition: "all 0.2s", marginBottom: "32px",
              }}
            >
              <input {...getInputProps()} />
              <Upload style={{ width: "36px", height: "36px", color: isDragActive ? "#3b82f6" : "#3f3f46", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: "16px", color: isDragActive ? "#3b82f6" : "#71717a", margin: "0 0 8px" }}>
                {isDragActive ? "Drop your image here" : "Drag & drop an image, or click to browse"}
              </p>
              <p style={{ fontSize: "13px", color: "#3f3f46", margin: 0 }}>JPG, PNG, WEBP supported</p>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <AnimatePresence>
          {file && status !== "done" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Preview */}
              {preview && (
                <div style={{
                  borderRadius: "16px", overflow: "hidden",
                  border: "1px solid #27272a", marginBottom: "20px", background: "#111113",
                }}>
                  <img src={preview} alt="preview" style={{ width: "100%", maxHeight: "260px", objectFit: "contain", display: "block" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
                    <span style={{ fontSize: "13px", color: "#71717a" }}>{file.name}</span>
                    <span style={{ fontSize: "13px", color: "#71717a" }}>{formatSize(file.size)}</span>
                    <button onClick={handleReset} style={{ fontSize: "13px", color: "#71717a", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                  </div>
                </div>
              )}

              {/* Format selector */}
              <div style={{
                background: "#111113", border: "1px solid #27272a",
                borderRadius: "14px", padding: "20px", marginBottom: "20px",
              }}>
                <p style={{ fontSize: "12px", color: "#71717a", fontWeight: 600, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Convert To</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {formats.map((fmt) => {
                    const isCurrentFormat = getInputFormat() === fmt || (getInputFormat() === "jpg" && fmt === "jpeg");
                    return (
                      <button
                        key={fmt}
                        onClick={() => !isCurrentFormat && setOutputFormat(fmt)}
                        disabled={isCurrentFormat}
                        style={{
                          flex: 1, padding: "14px",
                          background: outputFormat === fmt ? "#3b82f6" : "#18181b",
                          color: isCurrentFormat ? "#3f3f46" : outputFormat === fmt ? "#fff" : "#a1a1aa",
                          border: "1px solid",
                          borderColor: outputFormat === fmt ? "#3b82f6" : "#27272a",
                          borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                          cursor: isCurrentFormat ? "not-allowed" : "pointer",
                          transition: "all 0.15s", textTransform: "uppercase",
                          position: "relative",
                        }}
                      >
                        {fmt}
                        {isCurrentFormat && (
                          <span style={{ display: "block", fontSize: "10px", fontWeight: 400, color: "#3f3f46", marginTop: "2px" }}>current</span>
                        )}
                      </button>
                    );
                  })}
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
                onClick={handleConvert}
                disabled={status === "converting"}
                style={{
                  width: "100%", padding: "16px",
                  background: status === "converting" ? "#27272a" : "linear-gradient(135deg, #3b82f6, #6366f1)",
                  color: "#fff", fontSize: "16px", fontWeight: 600,
                  borderRadius: "14px", border: "none",
                  cursor: status === "converting" ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  boxShadow: status === "converting" ? "none" : "0 0 32px rgba(59,130,246,0.25)",
                  transition: "all 0.2s",
                }}
              >
                {status === "converting" ? (
                  <><Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} /> Converting...</>
                ) : (
                  <><RefreshCw style={{ width: "18px", height: "18px" }} /> Convert to {outputFormat.toUpperCase()}</>
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
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.25)",
                borderRadius: "16px", padding: "32px", textAlign: "center",
              }}
            >
              <CheckCircle style={{ width: "44px", height: "44px", color: "#3b82f6", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: "20px", fontWeight: 700, color: "#fafafa", margin: "0 0 8px" }}>Conversion Complete!</p>
              <p style={{ fontSize: "14px", color: "#71717a", margin: "0 0 24px" }}>Your image has been converted successfully.</p>

              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #27272a", marginBottom: "24px" }}>
                <img src={downloadUrl} alt="converted" style={{ width: "100%", maxHeight: "300px", objectFit: "contain", display: "block" }} />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={downloadUrl}
                  download={downloadName}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "12px 28px",
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    color: "#fff", fontSize: "15px", fontWeight: 600,
                    borderRadius: "12px", textDecoration: "none",
                    boxShadow: "0 0 24px rgba(59,130,246,0.3)",
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
