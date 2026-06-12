"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/ui/layout/Navbar";
import Link from "next/link";
import { Maximize2, Upload, Loader2, CheckCircle, Download, ArrowLeft } from "lucide-react";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Status = "idle" | "resizing" | "done" | "error";

const presets: Record<string, { label: string; w: number; h: number }[]> = {
  Social: [
    { label: "Instagram Post", w: 1080, h: 1080 },
    { label: "Facebook Cover", w: 820, h: 312 },
    { label: "Twitter Post", w: 1024, h: 512 },
  ],
  Print: [
    { label: "A4", w: 2480, h: 3508 },
    { label: "Letter", w: 2550, h: 3300 },
  ],
  Web: [
    { label: "Small", w: 640, h: 360 },
    { label: "Medium", w: 1280, h: 720 },
    { label: "Large", w: 1920, h: 1080 },
  ],
};

export default function ResizeImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [activePlatform, setActivePlatform] = useState<keyof typeof presets>("Social");
  const [status, setStatus] = useState<Status>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("resized.png");
  const [resultDims, setResultDims] = useState<{ w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setStatus("idle");
    setDownloadUrl(null);
    setError(null);

    const url = URL.createObjectURL(f);
    setPreview(url);

    const img = new window.Image();
    img.onload = () => {
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = url;
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: false,
  });

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspect && originalDims) {
      setHeight(Math.round(val / (originalDims.w / originalDims.h)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspect && originalDims) {
      setWidth(Math.round(val * (originalDims.w / originalDims.h)));
    }
  };

  const handleResize = async () => {
    if (!file) return;
    setStatus("resizing");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("width", String(width));
      formData.append("height", String(height));
      formData.append("maintain_aspect", String(maintainAspect));

      const response = await fetch("http://localhost:8000/api/image/resize-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Resize failed");
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
      setResultDims({ w: data.width, h: data.height });
      setStatus("done");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setOriginalDims(null);
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
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", boxShadow: "0 0 32px rgba(245,158,11,0.3)",
          }}>
            <Maximize2 style={{ width: "28px", height: "28px", color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fafafa", margin: "0 0 12px" }}>
            Resize Image
          </h1>
          <p style={{ fontSize: "16px", color: "#71717a", margin: 0 }}>
            Set exact dimensions or scale proportionally.
          </p>
        </motion.div>

        {/* Dropzone */}
        {!file && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
                    {originalDims && <span style={{ fontSize: "13px", color: "#71717a" }}>{originalDims.w} × {originalDims.h}</span>}
                    <button onClick={handleReset} style={{ fontSize: "13px", color: "#71717a", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                  </div>
                </div>
              )}

              {/* Presets */}
<div style={{ marginBottom: "16px" }}>
  <p style={{ fontSize: "12px", color: "#71717a", fontWeight: 600, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Presets</p>
  
  {/* Platform tabs */}
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
    {Object.keys(presets).map((platform) => (
      <button
        key={platform}
        onClick={() => setActivePlatform(platform)}
        style={{
          padding: "6px 14px",
          background: activePlatform === platform ? "#f59e0b" : "#18181b",
          color: activePlatform === platform ? "#000" : "#a1a1aa",
          border: "1px solid",
          borderColor: activePlatform === platform ? "#f59e0b" : "#27272a",
          borderRadius: "8px", fontSize: "13px", fontWeight: 500,
          cursor: "pointer", transition: "all 0.15s",
        }}
      >
        {platform}
      </button>
    ))}
  </div>

  {/* Size options for selected platform */}
  {activePlatform && (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {presets[activePlatform].map((size) => (
        <button
          key={size.label}
          onClick={() => { setWidth(size.w); setHeight(size.h); setMaintainAspect(false); }}
          style={{
            padding: "6px 12px",
            background: width === size.w && height === size.h ? "#18181b" : "#18181b",
            color: width === size.w && height === size.h ? "#f59e0b" : "#a1a1aa",
            border: "1px solid",
            borderColor: width === size.w && height === size.h ? "#f59e0b" : "#27272a",
            borderRadius: "8px", fontSize: "12px", fontWeight: 500,
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          {size.label} <span style={{ opacity: 0.6 }}>{size.w}×{size.h}</span>
        </button>
      ))}
    </div>
  )}
</div>
                {/* Maintain aspect ratio toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    onClick={() => setMaintainAspect(!maintainAspect)}
                    style={{
                      width: "40px", height: "22px", borderRadius: "11px",
                      background: maintainAspect ? "#f59e0b" : "#27272a",
                      cursor: "pointer", position: "relative", transition: "background 0.2s",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: "3px",
                      left: maintainAspect ? "21px" : "3px",
                      width: "16px", height: "16px", borderRadius: "50%",
                      background: "#fff", transition: "left 0.2s",
                    }} />
                  </div>
                  <span style={{ fontSize: "13px", color: "#a1a1aa" }}>Maintain aspect ratio</span>
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
                onClick={handleResize}
                disabled={status === "resizing"}
                style={{
                  width: "100%", padding: "16px",
                  background: status === "resizing" ? "#27272a" : "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#fff", fontSize: "16px", fontWeight: 600,
                  borderRadius: "14px", border: "none",
                  cursor: status === "resizing" ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  boxShadow: status === "resizing" ? "none" : "0 0 32px rgba(245,158,11,0.25)",
                  transition: "all 0.2s",
                }}
              >
                {status === "resizing" ? (
                  <><Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} /> Resizing...</>
                ) : (
                  <><Maximize2 style={{ width: "18px", height: "18px" }} /> Resize Image</>
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
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.25)",
                borderRadius: "16px", padding: "32px", textAlign: "center",
              }}
            >
              <CheckCircle style={{ width: "44px", height: "44px", color: "#f59e0b", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: "20px", fontWeight: 700, color: "#fafafa", margin: "0 0 8px" }}>Image Resized!</p>
              {resultDims && (
                <p style={{ fontSize: "14px", color: "#71717a", margin: "0 0 8px" }}>
                  New dimensions: {resultDims.w} × {resultDims.h}
                </p>
              )}

              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #27272a", marginBottom: "24px", marginTop: "20px" }}>
                <img src={downloadUrl} alt="resized" style={{ width: "100%", maxHeight: "300px", objectFit: "contain", display: "block" }} />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={downloadUrl}
                  download={downloadName}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "12px 28px",
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
                  Resize Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}