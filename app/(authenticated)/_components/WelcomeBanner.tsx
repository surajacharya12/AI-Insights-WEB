"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function WelcomeBanner() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 p-8 sm:p-12 shadow-2xl">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-4 text-center md:text-left max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span>AI-Powered Learning</span>
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                            Welcome to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-100 to-amber-200 drop-shadow-sm">
                                Allinsights
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg sm:text-xl text-indigo-100 font-light leading-relaxed"
                    >
                        Unlock your potential with personalized AI courses.
                        <span className="block sm:inline"> Learn, create, and grow at your own pace.</span>
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="hidden md:block relative"
                >
                    {/* Abstract 3D-like Element or Illustration placeholder */}
                    <div className="w-64 h-64 bg-gradient-to-tr from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/10 flex items-center justify-center shadow-inner transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="text-center p-6">
                            <div className="text-5xl mb-2">🚀</div>
                            <div className="text-white font-bold text-xl">Start Creating</div>
                            <div className="text-indigo-200 text-sm mt-2">Build your first AI course today</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}