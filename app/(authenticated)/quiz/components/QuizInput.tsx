"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, BookOpen, Target, Clock } from "lucide-react";

interface QuizInputProps {
    topic: string;
    setTopic: (value: string) => void;
    numQuestions: number;
    setNumQuestions: (num: number) => void;
    loading: boolean;
    generateQuiz: () => void;
}

const QuizInput: React.FC<QuizInputProps> = ({
    topic,
    setTopic,
    numQuestions,
    setNumQuestions,
    loading,
    generateQuiz,
}) => {
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden"
        >
            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />

            <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/50">
                {/* Header */}
                <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
                    <motion.div
                        className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/30"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Create Your Quiz
                        </h2>
                        <p className="text-sm text-muted-foreground">Test your knowledge on any topic</p>
                    </div>
                </motion.div>

                <div className="space-y-8">
                    {/* Topic Input */}
                    <motion.div variants={itemVariants}>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">
                            <BookOpen className="w-4 h-4 text-indigo-500" />
                            Quiz Topic
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="e.g., React Hooks, Solar System, World History..."
                                className="w-full p-5 pl-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-lg placeholder:text-slate-400"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && generateQuiz()}
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity duration-300" />
                        </div>
                    </motion.div>

                    {/* Number of Questions */}
                    <motion.div variants={itemVariants}>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300">
                            <Target className="w-4 h-4 text-purple-500" />
                            Number of Questions
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {[3, 5, 10, 15, 20].map((num, index) => (
                                <motion.button
                                    key={num}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setNumQuestions(num)}
                                    className={`relative px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${numQuestions === num
                                        ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-indigo-500/40"
                                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                                        }`}
                                >
                                    {numQuestions === num && (
                                        <motion.div
                                            layoutId="activeQuestion"
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {num}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Estimated Time */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800/50 px-4 py-3 rounded-xl"
                    >
                        <Clock className="w-4 h-4" />
                        <span>Estimated time: ~{Math.ceil(numQuestions * 0.5)} minutes</span>
                    </motion.div>

                    {/* Generate Button */}
                    <motion.div variants={itemVariants}>
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={generateQuiz}
                            disabled={!topic || loading}
                            className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 group"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.6 }}
                            />
                            <Zap className="w-6 h-6 group-hover:animate-bounce" />
                            <span>Generate Quiz</span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default QuizInput;
