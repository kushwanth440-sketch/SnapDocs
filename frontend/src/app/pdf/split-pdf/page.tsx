"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import {
  Scissors, X, Upload, Loader2, CheckCircle, Download, FileText, ArrowLeft,
} from "lucide-react";
import Link from "next/link";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type SplitMode = "all" | "range" | "every";
type Status = "idle" | "splitting" | "done" | "error";

interface DownloadFile {
  url: string;
  name: string;
}

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<SplitMode>("all");
  const [rangeInput, setRangeInput] = useState("");
  const [everyN, setEveryN] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [downloads, setDownloads] = useState<DownloadFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setStatus("idle");
    setDownloads([]);
    setError(null);
    setPageCount(null);
    // Try to read page count client-side via basic byte scan (optional UX)
    // We'll get it from backend on split
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleSplit = async () => {
    if (!file) return;
    setStatus("splitting");
    setError(null);
    setDownloads([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", mode);
      if (mode === "range") formData.append("ranges", rangeInput);
      if (mode === "every") formData.append("every_n", String(everyN));

      const response = await fetch("http://localhost:8000/api/pdf/split", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Split failed");
      }

      const data = await response.json();
      // data.files = [{ name, data (base64) }]
      const files: DownloadFile[] = data.files.map((f: { name: string; data: string }) => {
        const bytes = Uint8Array.from(atob(f.data), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "application/pdf" });
        return { url: URL.createObjectURL(blob), name: f.name };
      });

      setDownloads(files);
      setPageCount(data.total_pages ?? null);
      setStatus("done");
    } catch (e: unknown) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(null);
    setStatus("idle");
    setDownloads([]);
    setError(null);
    setRangeInput("");
    setEveryN(1);
  };

  const modeBtn = (m: SplitMode, label: string) => (
    <button
      onClick={() => { setMode(m); setError(null); }}
      style={{
        flex: 1, padding: "10px 0", fontSize: "14px", fontWeight: 600,
        borderRadius: "10px", border: "none", cursor: "pointer",
        background: mode === m ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#18181b",
        color: mode === m ? "#fff" : "#71717a",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#09090b" }}>
      <Navbar />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "120px 24px 80px" }}>

      {/* Back to Home */}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <div style={{
            width: "64px", height: "64px", borderRadius: "18px",
            background: "#FEF3C7", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 20px",
          }}>
            <Scissors style={{ width: "28px", height: "28px", color: "#D97706" }} />
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
            color: "#fafafa", margin: "0 0 12px",
          }}>
            Split PDF
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Extract pages or split your PDF into multiple files.
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
                border: `2px dashed ${isDragActive ? "#6366f1" : "#27272a"}`,
                borderRadius: "20px",
                padding: "56px 32px",
                textAlign: "center",
                cursor: "pointer",
                background: isDragActive ? "rgba(99,102,241,0.05)" : "#111113",
                transition: "all 0.2s",
                marginBottom: "32px",
              }}
            >
              <input {...getInputProps()} />
              <Upload style={{ width: "36px", height: "36px", color: isDragActive ? "#6366f1" : "#3f3f46", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: "16px", color: isDragActive ? "#6366f1" : "#71717a", margin: 0 }}>
                {isDragActive ? "Drop your PDF here" : "Drag & drop a PDF, or click to browse"}
              </p>
            </div>
          </motion.div>
        )}

        {/* File card + options */}
        <AnimatePresence>
          {file && status !== "done" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* File row */}
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "#111113", border: "1px solid #27272a",
                borderRadius: "14px", padding: "14px 16px", marginBottom: "24px",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "#1c1c1f", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <FileText style={{ width: "18px", height: "18px", color: "#6366f1" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: "14px", fontWeight: 500, color: "#fafafa",
                    margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{file.name}</p>
                  <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
                    {formatSize(file.size)}{pageCount ? ` · ${pageCount} pages` : ""}
                  </p>
                </div>
                <button onClick={handleReset} style={{
                  width: "28px", height: "28px", borderRadius: "6px",
                  background: "transparent", border: "1px solid #27272a",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <X style={{ width: "12px", height: "12px", color: "#a1a1aa" }} />
                </button>
              </div>

              {/* Split mode selector */}
              <p style={{ fontSize: "13px", color: "#71717a", marginBottom: "10px", fontWeight: 500 }}>
                SPLIT MODE
              </p>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {modeBtn("all", "Extract All Pages")}
                {modeBtn("range", "Page Ranges")}
                {modeBtn("every", "Every N Pages")}
              </div>

              {/* Mode-specific inputs */}
              {mode === "range" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  style={{ marginBottom: "20px" }}
                >
                  <input
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="e.g. 1-3, 5, 7-9"
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "14px",
                      background: "#111113", border: "1px solid #27272a",
                      borderRadius: "12px", color: "#fafafa", outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{
                    marginTop: "10px", padding: "12px 14px",
                    background: "#111113", border: "1px solid #27272a",
                    borderRadius: "10px",
                    }}>
                    <p style={{ fontSize: "12px", color: "#71717a", margin: "0 0 6px", fontWeight: 600 }}>
                        HOW TO USE
                    </p>
                    <p style={{ fontSize: "12px", color: "#52525b", margin: "0 0 4px" }}>
                        <span style={{ color: "#a1a1aa" }}>1-3</span> → pages 1, 2, 3 into one PDF
                    </p>
                    <p style={{ fontSize: "12px", color: "#52525b", margin: "0 0 4px" }}>
                        <span style={{ color: "#a1a1aa" }}>1, 3</span> → page 1 and page 3 as separate PDFs
                    </p>
                    <p style={{ fontSize: "12px", color: "#52525b", margin: "0 0 4px" }}>
                        <span style={{ color: "#a1a1aa" }}>1+3</span> → pages 1 and 3 combined into one PDF
                    </p>
                    <p style={{ fontSize: "12px", color: "#52525b", margin: 0 }}>
                        <span style={{ color: "#a1a1aa" }}>1-2, 4+6</span> → two PDFs: pages 1–2, and pages 4 & 6 combined
                    </p>
                    </div>
                </motion.div>
              )}

              {mode === "every" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}
                >
                  <span style={{ fontSize: "14px", color: "#a1a1aa" }}>Split every</span>
                  <input
                    type="number"
                    min={1}
                    value={everyN}
                    onChange={(e) => setEveryN(Math.max(1, Number(e.target.value)))}
                    style={{
                      width: "80px", padding: "10px 12px", fontSize: "14px",
                      background: "#111113", border: "1px solid #27272a",
                      borderRadius: "10px", color: "#fafafa", outline: "none", textAlign: "center",
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#a1a1aa" }}>page(s)</span>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  padding: "12px 16px", background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px",
                  fontSize: "14px", color: "#f87171", marginBottom: "16px",
                }}>
                  {error}
                </div>
              )}

              {/* Split button */}
              <button
                onClick={handleSplit}
                disabled={status === "splitting"}
                style={{
                  width: "100%", padding: "16px",
                  background: status === "splitting"
                    ? "#27272a"
                    : "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#fff", fontSize: "16px", fontWeight: 600,
                  borderRadius: "14px", border: "none",
                  cursor: status === "splitting" ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                  boxShadow: status === "splitting" ? "none" : "0 0 32px rgba(245,158,11,0.25)",
                  transition: "all 0.2s",
                }}
              >
                {status === "splitting" ? (
                  <>
                    <Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} />
                    Splitting PDF...
                  </>
                ) : (
                  <>
                    <Scissors style={{ width: "18px", height: "18px" }} />
                    Split PDF
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download results */}
        <AnimatePresence>
          {status === "done" && downloads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: "16px", padding: "28px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <CheckCircle style={{
                  width: "36px", height: "36px",
                  color: "#10b981", margin: "0 auto 10px", display: "block",
                }} />
                <p style={{ fontSize: "18px", fontWeight: 600, color: "#fafafa", margin: "0 0 4px" }}>
                  Split into {downloads.length} file{downloads.length > 1 ? "s" : ""}!
                </p>
                <p style={{ fontSize: "14px", color: "#71717a", margin: 0 }}>
                  Click each file to download.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {downloads.map((d, i) => (
                  <a
                    key={i}
                    href={d.url}
                    download={d.name}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px",
                      background: "#111113", border: "1px solid #27272a",
                      borderRadius: "12px", textDecoration: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <FileText style={{ width: "16px", height: "16px", color: "#6366f1" }} />
                      <span style={{ fontSize: "14px", color: "#fafafa" }}>{d.name}</span>
                    </div>
                    <Download style={{ width: "14px", height: "14px", color: "#71717a" }} />
                  </a>
                ))}
              </div>

              <button
                onClick={handleReset}
                style={{
                  width: "100%", padding: "12px",
                  background: "transparent", color: "#a1a1aa",
                  fontSize: "14px", fontWeight: 600,
                  borderRadius: "12px", border: "1px solid #27272a", cursor: "pointer",
                }}
              >
                Split Another PDF
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}