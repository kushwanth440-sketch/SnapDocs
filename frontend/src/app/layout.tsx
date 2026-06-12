import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SnapDocs — Convert. Compress. Extract. Instantly.",
  description:
    "Privacy-first file toolkit for PDFs, images, audio, and documents. No signup. No storage. Files deleted immediately.",
  keywords: [
    "PDF converter",
    "compress PDF",
    "image converter",
    "OCR",
    "audio transcription",
    "privacy first",
  ],
  authors: [{ name: "SnapDocs" }],
  themeColor: "#09090b",
  openGraph: {
    title: "SnapDocs — Convert. Compress. Extract. Instantly.",
    description:
      "Privacy-first tools for PDFs, images, audio, and documents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#09090b] text-[#fafafa] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
