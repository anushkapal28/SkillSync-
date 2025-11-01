"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResumeAnalyser() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume first!");
    setLoading(true);
    setAnalysis("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resumeanalyser", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.analysis) setAnalysis(data.analysis);
      else setAnalysis(data.error || "No analysis received.");
    } catch (error) {
      console.error("Upload error:", error);
      setAnalysis("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-purple-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-100 rounded-full shadow-md">
              <FileText className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Resume Analyser
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Upload your resume and let our AI analyze it for skill match,
            optimization tips, and personalized career insights.
          </p>

          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border border-purple-400 px-4 py-2 rounded-xl cursor-pointer"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Analyzing...
                </span>
              ) : (
                "Upload & Analyze"
              )}
            </button>
          </div>

          {analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-10 p-6 bg-white rounded-2xl shadow-lg text-left text-gray-700"
            >
              <h3 className="text-2xl font-semibold mb-2 text-purple-700">
                AI Analysis
              </h3>
              <p className="whitespace-pre-line leading-relaxed">{analysis}</p>
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
