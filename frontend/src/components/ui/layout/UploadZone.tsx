"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Image, Music, Film } from "lucide-react";

const formats = ["PDF", "DOCX", "JPG", "PNG", "WEBP", "MP3", "MP4", "WAV", "TXT", "M4A"];

const formatIcons: Record<string, typeof FileText> = {
  PDF: FileText, DOCX: FileText, TXT: FileText,
  JPG: Image, PNG: Image, WEBP: Image,
  MP3: Music, WAV: Music, M4A: Music,
  MP4: Film,
};

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState<string | null>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setDroppedFile(file.name);
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className="relative rounded-2xl cursor-pointer overflow-hidden transition-all duration-300"
        style={{
          background: isDragging ? "rgba(124,58,237,0.06)" : "rgba(20,12,36,0.6)",
          border: isDragging
            ? "1.5px dashed rgba(124,58,237,0.7)"
            : "1.5px dashed rgba(124,58,237,0.2)",
          boxShadow: isDragging ? "0 0 40px rgba(124,58,237,0.15)" : "none",
        }}
      >
        {/* Top radial fill */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.06), transparent 60%)",
          }}
        />

        <div className="relative flex flex-col items-center py-10 px-6 text-center">
          {/* Upload icon */}
          <motion.div
            animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <Upload className="w-6 h-6" style={{ color: "#A855F7" }} />
          </motion.div>

          {droppedFile ? (
            <>
              <h3 className="text-base font-semibold mb-1" style={{ color: "#F0E6FF" }}>
                {droppedFile}
              </h3>
              <p className="text-sm" style={{ color: "#9D7EC9" }}>
                Select a tool below to process this file
              </p>
            </>
          ) : (
            <>
              <h3 className="text-base font-semibold mb-1" style={{ color: "#E9D5FF" }}>
                {isDragging ? "Drop it here" : "Drop any file here"}
              </h3>
              <p className="text-sm" style={{ color: "#5B4080" }}>
                or click to browse from your device
              </p>
            </>
          )}

          {/* Format pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {formats.map((fmt) => {
              const Icon = formatIcons[fmt] ?? FileText;
              return (
                <span
                  key={fmt}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{
                    background: "rgba(20,12,36,0.9)",
                    border: "1px solid rgba(45,20,80,1)",
                    color: "#5B4080",
                  }}
                >
                  <Icon className="w-3 h-3" />
                  {fmt}
                </span>
              );
            })}
          </div>

          {/* Max size note */}
          <p className="mt-3 text-[11px]" style={{ color: "#3A2860" }}>
            Max file size: 50MB · All files deleted immediately after processing
          </p>
        </div>
      </motion.div>
    </section>
  );
}

