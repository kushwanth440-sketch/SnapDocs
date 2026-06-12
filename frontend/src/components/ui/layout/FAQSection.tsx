"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Are my files safe and private?",
    answer:
      "Absolutely. Your files are processed in temporary memory and deleted immediately after you download the result. We never store, share, or analyze your files. No file history is kept whatsoever.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account needed. Just upload your file, choose your settings, and download the result. No signup, no email, no password — ever.",
  },
  {
    question: "What is the maximum file size I can upload?",
    answer:
      "Currently we support files up to 50MB per upload. For larger files, we recommend compressing them first or splitting them into smaller parts using our free tools.",
  },
  {
    question: "Which file formats are supported?",
    answer:
      "We support PDF, DOCX, TXT, JPG, PNG, WEBP, MP3, WAV, M4A, and MP4. More formats are being added regularly based on user feedback.",
  },
  {
    question: "How long does processing take?",
    answer:
      "Most files are processed in under 2 seconds. Larger files or complex operations like OCR and audio transcription may take slightly longer depending on file size.",
  },
  {
    question: "Is SnapDocs completely free to use?",
    answer:
      "Yes! All core tools are completely free with no hidden charges. We may introduce a premium tier for advanced features in the future, but essential tools will always remain free.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes. SnapDocs is fully responsive and optimized for mobile, tablet, and desktop. Convert files directly from your phone browser — no app install needed.",
  },
  {
    question: "What happens if my conversion fails?",
    answer:
      "You'll see a clear error message explaining what went wrong. Your original file is never modified. You can try again or reach out to our support team.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">

      {/* Background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "700px",
          height: "400px",
          background: "rgba(99,102,241,0.04)",
          borderRadius: "50%",
          filter: "blur(120px)",
        }}
      />

      <div
  style={{
    maxWidth: "56rem",
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    position: "relative",
  }}
>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
            style={{
              background: "rgba(99,102,241,0.1)",
              color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p
            className="text-lg sm:text-xl leading-relaxed"
            style={{ color: "#a1a1aa" }}
          >
            Everything you need to know about SnapDocs.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              style={{
                background: "#18181b",
                border: `1px solid ${openIndex === index ? "rgba(99,102,241,0.5)" : "#27272a"}`,
                borderRadius: "16px",
                overflow: "hidden",
                transition: "border-color 0.3s",
                position: "relative",
              }}
            >
              {/* Top glow line when open */}
              {openIndex === index && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background:
                      "linear-gradient(90deg, #6366f1, #8b5cf6)",
                  }}
                />
              )}

              {/* Question Button */}
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "24px 28px",
                  textAlign: "left",
                  gap: "16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: 500,
                    color: openIndex === index ? "#fafafa" : "#a1a1aa",
                    transition: "color 0.2s",
                    lineHeight: 1.5,
                  }}
                >
                  {faq.question}
                </span>

                {/* Plus/Minus Button */}
                <div
                  style={{
                    flexShrink: 0,
                    width: "32px",
                    height: "32px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      openIndex === index
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "#27272a",
                    transition: "background 0.3s",
                  }}
                >
                  {openIndex === index ? (
                    <Minus
                      style={{ width: "15px", height: "15px", color: "#fff" }}
                    />
                  ) : (
                    <Plus
                      style={{
                        width: "15px",
                        height: "15px",
                        color: "#71717a",
                      }}
                    />
                  )}
                </div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div
                      style={{
                        padding: "0 28px 28px 28px",
                      }}
                    >
                      <div
                        style={{
                          height: "1px",
                          background: "#27272a",
                          marginBottom: "20px",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "15px",
                          color: "#a1a1aa",
                          lineHeight: "1.8",
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            marginTop: "24px",
            textAlign: "center",
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "20px",
            padding: "40px 32px",
          }}
        >
          <p
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#fafafa",
              marginBottom: "8px",
            }}
          >
            Still have questions?
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#71717a",
              marginBottom: "24px",
            }}
          >
            Can't find the answer you're looking for? Reach out to our
            team.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 24px rgba(99,102,241,0.3)",
            }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
