"use client";

import Link from "next/link";
import { Zap, Heart } from "lucide-react";

const footerLinks = {
  "PDF Tools": [
    { label: "Merge PDF",      href: "/pdf/merge-pdf" },
    { label: "Split PDF",      href: "/pdf/split-pdf" },
    { label: "Compress PDF",   href: "/pdf/compress-pdf" },
    { label: "PDF to Image",   href: "/pdf/pdf-to-image" },
    { label: "Image to PDF",   href: "/pdf/image-to-pdf" },
  ],
  "Document": [
    { label: "DOCX to PDF",    href: "/document/docx-to-pdf" },
    { label: "PDF to DOCX",    href: "/document/pdf-to-docx" },
    { label: "TXT to PDF",     href: "/document/txt-to-pdf" },
  ],
  "Image": [
    { label: "Compress Image", href: "/image/compress-image" },
    { label: "Resize Image",   href: "/image/resize-image" },
    { label: "OCR",            href: "/image/ocr" },
  ],
  "Audio": [
    { label: "Audio to Text",  href: "/audio/audio-to-text" },
    { label: "MP4 to MP3",     href: "/audio/mp4-to-mp3" },
    { label: "Video to Text",  href: "/audio/video-to-text" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(45,20,80,0.8)",
        background: "#0D0818",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                  boxShadow: "0 0 14px rgba(124,58,237,0.4)",
                }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-[15px] font-bold" style={{ color: "#F0E6FF" }}>
                Snap<span className="gradient-text">Docs</span>
              </span>
            </Link>

            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "#5B4080" }}
            >
              Privacy-first file toolkit. Convert, compress, and extract
              instantly. No signup. No storage. No tracking.
            </p>

            {/* Trust badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(20,12,36,0.9)",
                border: "1px solid rgba(45,20,80,1)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#A855F7",
                  boxShadow: "0 0 6px #A855F7",
                  animation: "pulse 2s infinite",
                }}
              />
              <span className="text-[11px]" style={{ color: "#5B4080" }}>
                Files deleted after processing
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                className="text-[11px] font-semibold uppercase tracking-widest mb-4"
                style={{ color: "#9D7EC9" }}
              >
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] transition-colors duration-150"
                      style={{ color: "#3A2860" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#9D7EC9")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#3A2860")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link
         href="/faq"
        className="text-[#a1a1aa] hover:text-white transition-colors text-xs"
        >
        FAQ
        </Link>
        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(45,20,80,0.6)" }}
        >
          <p className="text-[12px] flex items-center gap-1.5" style={{ color: "#3A2860" }}>
            Made with{" "}
            <Heart className="w-3 h-3" style={{ color: "#7C3AED" }} />{" "}
            by the SnapDocs team
          </p>
          <p className="text-[12px]" style={{ color: "#3A2860" }}>
            © {new Date().getFullYear()} SnapDocs. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["GitHub", "Twitter", "Privacy"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-[12px] transition-colors duration-150"
                style={{ color: "#3A2860" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9D7EC9")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#3A2860")}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

      </div>

    </footer>
  );
}
