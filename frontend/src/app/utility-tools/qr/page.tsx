"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import { ArrowLeft, QrCode, Download, Upload, RefreshCw } from "lucide-react";
import { API_URL } from "@/lib/api";
export default function QRGeneratorPage() {
  const [text, setText] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(300);
  const [format, setFormat] = useState<"png" | "svg">("png");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [result, setResult] = useState<{ file: string; mime: string; ext: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setLogoName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setLogo(base64);
    };
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"] },
    multiple: false,
  });

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/qr/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          fg_color: fgColor,
          bg_color: bgColor,
          size,
          format,
          logo_base64: logo,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Generation failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
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
    a.download = `qrcode.${result.ext}`;
    a.click();
  };

  const handleReset = () => {
    setText("");
    setFgColor("#000000");
    setBgColor("#ffffff");
    setSize(300);
    setFormat("png");
    setLogo(null);
    setLogoName("");
    setResult(null);
    setError(null);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "#111113", border: "1px solid #27272a",
    borderRadius: "10px", color: "#e4e4e7",
    fontSize: "14px", outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: "13px", color: "#71717a",
    display: "block", marginBottom: "6px",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 24px" }}>

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
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", boxShadow: "0 0 32px rgba(139,92,246,0.3)",
          }}>
            <QrCode style={{ width: "28px", height: "28px", color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fafafa", margin: "0 0 12px" }}>
            QR Code Generator
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Generate custom QR codes with colors, logo, and multiple formats.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

          {/* Left — Controls */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Text input */}
            <div>
              <label style={labelStyle}>URL or Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com"
                rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>

            {/* Colors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Foreground Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                    style={{ width: "36px", height: "36px", border: "none", borderRadius: "8px", cursor: "pointer", background: "none" }} />
                  <input value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                    style={{ ...inputStyle, width: "auto", flex: 1 }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Background Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                    style={{ width: "36px", height: "36px", border: "none", borderRadius: "8px", cursor: "pointer", background: "none" }} />
                  <input value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                    style={{ ...inputStyle, width: "auto", flex: 1 }} />
                </div>
              </div>
            </div>

            {/* Size */}
            <div>
              <label style={labelStyle}>Size: {size}px</label>
              <input
                type="range" min={100} max={1000} step={50}
                value={size} onChange={(e) => setSize(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#8b5cf6" }}
              />
            </div>

            {/* Format */}
            <div>
              <label style={labelStyle}>Format</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["png", "svg"] as const).map((f) => (
                  <button key={f} onClick={() => setFormat(f)} style={{
                    flex: 1, padding: "8px",
                    borderRadius: "8px", border: "1px solid",
                    borderColor: format === f ? "#8b5cf6" : "#27272a",
                    background: format === f ? "rgba(139,92,246,0.15)" : "transparent",
                    color: format === f ? "#8b5cf6" : "#71717a",
                    fontSize: "13px", fontWeight: 500, cursor: "pointer",
                  }}>
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo upload */}
            <div>
              <label style={labelStyle}>Logo (optional)</label>
              <div {...getRootProps()} style={{
                border: `2px dashed ${isDragActive ? "#8b5cf6" : "#27272a"}`,
                borderRadius: "12px", padding: "20px",
                textAlign: "center", cursor: "pointer",
                background: isDragActive ? "rgba(139,92,246,0.05)" : "#111113",
                transition: "all 0.2s",
              }}>
                <input {...getInputProps()} />
                <Upload style={{ width: "20px", height: "20px", color: "#3f3f46", margin: "0 auto 8px", display: "block" }} />
                <p style={{ fontSize: "13px", color: "#71717a", margin: 0 }}>
                  {logoName || "Drop logo here"}
                </p>
              </div>
              {logo && (
                <button onClick={() => { setLogo(null); setLogoName(""); }}
                  style={{ marginTop: "6px", fontSize: "12px", color: "#71717a", background: "none", border: "none", cursor: "pointer" }}>
                  Remove logo
                </button>
              )}
            </div>

            {/* Generate button */}
            {error && (
              <div style={{
                padding: "12px 16px", background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px",
                fontSize: "14px", color: "#f87171",
              }}>
                {error}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              style={{
                width: "100%", padding: "14px",
                background: loading || !text.trim() ? "#27272a" : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                color: "#fff", fontSize: "15px", fontWeight: 600,
                borderRadius: "12px", border: "none",
                cursor: loading || !text.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: loading || !text.trim() ? "none" : "0 0 24px rgba(139,92,246,0.25)",
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <><RefreshCw style={{ width: "16px", height: "16px" }} className="animate-spin" /> Generating...</>
              ) : (
                <><QrCode style={{ width: "16px", height: "16px" }} /> Generate QR Code</>
              )}
            </button>

          </motion.div>

          {/* Right — Preview */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{
              background: "#111113", border: "1px solid #27272a",
              borderRadius: "20px", padding: "24px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: "400px", gap: "20px",
            }}>

            {!result && !loading && (
              <div style={{ textAlign: "center" }}>
                <QrCode style={{ width: "64px", height: "64px", color: "#27272a", margin: "0 auto 16px", display: "block" }} />
                <p style={{ fontSize: "14px", color: "#3f3f46", margin: 0 }}>Your QR code will appear here</p>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: "center" }}>
                <RefreshCw style={{ width: "32px", height: "32px", color: "#8b5cf6", margin: "0 auto 12px", display: "block" }} className="animate-spin" />
                <p style={{ fontSize: "14px", color: "#71717a", margin: 0 }}>Generating...</p>
              </div>
            )}

            {result && (
              <>
                <div style={{
                  borderRadius: "16px", overflow: "hidden",
                  border: "1px solid #27272a", background: "#fff", padding: "12px",
                }}>
                  <img
                    src={`data:${result.mime};base64,${result.file}`}
                    alt="QR Code"
                    style={{ width: "220px", height: "220px", display: "block" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                  <button onClick={handleDownload} style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    padding: "10px",
                    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                    color: "#fff", fontSize: "14px", fontWeight: 600,
                    borderRadius: "10px", border: "none", cursor: "pointer",
                    boxShadow: "0 0 20px rgba(139,92,246,0.25)",
                  }}>
                    <Download style={{ width: "16px", height: "16px" }} /> Download {result.ext.toUpperCase()}
                  </button>
                  <button onClick={handleReset} style={{
                    padding: "10px 16px",
                    background: "transparent", color: "#71717a",
                    border: "1px solid #27272a", borderRadius: "10px",
                    fontSize: "14px", cursor: "pointer",
                  }}>
                    Reset
                  </button>
                </div>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </main>
  );
}
