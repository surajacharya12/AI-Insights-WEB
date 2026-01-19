"use client";

import { motion } from "framer-motion";

interface WelcomeBannerProps {
  userName?: string;
}

export default function WelcomeBanner({ userName }: WelcomeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-6 rounded-3xl bg-white shadow-xl border-l-8 border-green-500 text-center"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-green-900">
        ThinkBot 🤖
      </h1>
      <p className="text-green-700 mt-2">
        AI-powered assistant to help you learn faster and smarter!
      </p>
      {userName && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 inline-block bg-green-50 border border-green-200 rounded-xl px-4 py-2 shadow-sm"
        >
          <p className="text-green-800 text-sm">
            Welcome, <span className="font-semibold">{userName}</span>!
          </p>
        </motion.div>
      )}
      <p className="text-xs text-gray-500 mt-4">
        💾 Chat history is saved for 7 days
      </p>
    </motion.div>
  );
}
