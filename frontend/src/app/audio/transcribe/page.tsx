"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import { Mic, Upload, Loader2, CheckCircle, ArrowLeft, Copy, Check } from "lucide-react";
import { API_URL } from "@/lib/api";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Status = "idle" | "transcribing" | "done" | "error";

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setStatus("idle");
    setText("");
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [".mp3", ".wav", ".m4a", ".ogg", ".flac"] },
    multiple: false,
  });

  const handleTranscribe = async () => {
    if (!file) return;
    setStatus("transcribing");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/audio/transcribe`, {
        
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Transcription failed");
      }

      const data = await response.json();
      setText(data.text || "No speech detected.");
      setLanguage(data.language || "");
      setStatus("done");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setStatus("error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.split(".")[0]}_transcript.txt`;
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setText("");
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
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", boxShadow: "0 0 32px rgba(99,102,241,0.3)",
          }}>
            <Mic style={{ width: "28px", height: "28px", color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fafafa", margin: "0 0 12px" }}>
            Audio to Text
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Transcribe any audio file to text instantly.
          </p>
        </motion.div>

        {!file && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div {...getRootProps()} style={{
              border: `2px dashed ${isDragActive ? "#6366f1" : "#27272a"}`,
              borderRadius: "20px", padding: "56px 32px",
              textAlign: "center", cursor: "pointer",
              background: isDragActive ? "rgba(99,102,241,0.05)" : "#111113",
              transition: "all 0.2s", marginBottom: "32px",
            }}>
              <input {...getInputProps()} />
              <Upload style={{ width: "36px", height: "36px", color: isDragActive ? "#6366f1" : "#3f3f46", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: "16px", color: isDragActive ? "#6366f1" : "#71717a", margin: "0 0 8px" }}>
                {isDragActive ? "Drop your audio here" : "Drag & drop an audio file, or click to browse"}
              </p>
              <p style={{ fontSize: "13px", color: "#3f3f46", margin: 0 }}>MP3, WAV, M4A, OGG, FLAC supported</p>
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
                  <Mic style={{ width: "18px", height: "18px", color: "#6366f1" }} />
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
                    onClick={handleTranscribe}
                    disabled={status === "transcribing"}
                    style={{
                      width: "100%", padding: "16px",
                      background: status === "transcribing" ? "#27272a" : "linear-gradient(135deg, #6366f1, #4f46e5)",
                      color: "#fff", fontSize: "16px", fontWeight: 600,
                      borderRadius: "14px", border: "none",
                      cursor: status === "transcribing" ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      boxShadow: status === "transcribing" ? "none" : "0 0 32px rgba(99,102,241,0.25)",
                      transition: "all 0.2s",
                    }}
                  >
                    {status === "transcribing" ? (
                      <><Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} /> Transcribing...</>
                    ) : (
                      <><Mic style={{ width: "18px", height: "18px" }} /> Transcribe Audio</>
                    )}
                  </button>
                </>
              )}

              <AnimatePresence>
                {status === "done" && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: "24px" }}>
                    <div style={{
                      background: "rgba(99,102,241,0.06)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: "16px", padding: "24px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <CheckCircle style={{ width: "20px", height: "20px", color: "#6366f1" }} />
                          <span style={{ fontSize: "15px", fontWeight: 600, color: "#fafafa" }}>Transcript</span>
                          {language && (
                            <span style={{ fontSize: "12px", color: "#71717a", background: "#18181b", padding: "2px 8px", borderRadius: "6px", border: "1px solid #27272a" }}>
                              {language.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={handleCopy} style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "7px 14px", background: "#18181b",
                            border: "1px solid #27272a", borderRadius: "8px",
                            color: "#a1a1aa", fontSize: "13px", cursor: "pointer",
                          }}>
                            {copied ? <><Check style={{ width: "14px", height: "14px", color: "#10b981" }} /> Copied!</> : <><Copy style={{ width: "14px", height: "14px" }} /> Copy</>}
                          </button>
                          <button onClick={handleDownload} style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "7px 14px", background: "#18181b",
                            border: "1px solid #27272a", borderRadius: "8px",
                            color: "#a1a1aa", fontSize: "13px", cursor: "pointer",
                          }}>
                            Download .txt
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{
                          width: "100%", minHeight: "240px",
                          background: "#111113", border: "1px solid #27272a",
                          borderRadius: "10px", padding: "14px",
                          color: "#e4e4e7", fontSize: "14px", lineHeight: 1.7,
                          resize: "vertical", fontFamily: "monospace",
                          boxSizing: "border-box", outline: "none",
                        }}
                      />

                      <button onClick={handleReset} style={{
                        marginTop: "16px", padding: "10px 20px",
                        background: "transparent", color: "#71717a",
                        border: "1px solid #27272a", borderRadius: "10px",
                        fontSize: "14px", cursor: "pointer",
                      }}>
                        Transcribe Another
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
