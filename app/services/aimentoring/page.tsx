"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Send, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AIMentoring() {
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/aimentoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.map((m) => ({
            role: m.role,
            parts: [{ text: m.text }],
          })),
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full shadow-md">
              <Brain className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            AI-Powered Mentoring
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Harness the power of AI to receive personalized mentorship insights,
            skill growth tracking, and actionable feedback.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setOpenChat(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all"
            >
              Start Mentoring
            </button>
          </div>
        </motion.div>

        {openChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-10 right-10 w-96 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white flex justify-between items-center px-4 py-3">
              <span className="font-semibold">AI Mentor</span>
              <X
                className="cursor-pointer"
                onClick={() => setOpenChat(false)}
              />
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-blue-100 ml-auto text-right"
                      : "bg-gray-100 text-left"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="text-gray-400 text-sm">AI is thinking...</div>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-gray-200 p-3 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask your mentor..."
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
}
