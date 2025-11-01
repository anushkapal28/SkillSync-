"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function CareerCounselling() {
  const [career, setCareer] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAskAI = async () => {
    setError("");
    setResponse("");

    if (!career.trim()) {
      setError("Please enter a career field to get guidance.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/careercounselling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career }),
      });

      const text = await res.text();
      console.log("Raw API response:", text); // helps debug any backend issues

      const data = JSON.parse(text);

      if (data.error) {
        setError(data.error);
      } else {
        setResponse(data.advice || "No advice received.");
      }
    } catch (err) {
      console.error("Error fetching Gemini advice:", err);
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-amber-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-amber-100 rounded-full shadow-md">
              <Compass className="w-10 h-10 text-amber-600" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Career Counselling
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Get AI-powered insights into your dream career with Gemini.
            Discover skills, tools, and a roadmap tailored to your ambitions.
          </p>

          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            <input
              type="text"
              placeholder="Enter your preferred career (e.g., Data Scientist)"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              className="w-80 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleAskAI}
              disabled={loading}
              className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Get Guidance"
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 italic"
            >
              Analyzing your career path... Please wait.
            </motion.div>
          )}

          {response && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-lg text-left max-w-3xl mx-auto whitespace-pre-wrap text-gray-800"
            >
              {response}
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
