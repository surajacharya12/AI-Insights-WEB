"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, Star, Sparkles, Medal, Target, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";

interface QuizResultProps {
    score: number;
    total: number;
    resetQuiz: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ score, total, resetQuiz }) => {
    const percentage = (score / total) * 100;

    React.useEffect(() => {
        if (percentage >= 60) {
            // Trigger confetti for good scores
            const duration = 2000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#6366f1', '#a855f7', '#ec4899']
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#6366f1', '#a855f7', '#ec4899']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [percentage]);

    const getScoreData = () => {
        if (percentage === 100) return {
            message: "Perfect Score!",
            emoji: "🎉",
            color: "from-yellow-400 to-orange-500",
            textColor: "text-yellow-500",
            icon: PartyPopper,
            stars: 5
        };
        if (percentage >= 80) return {
            message: "Excellent Work!",
            emoji: "🌟",
            color: "from-green-400 to-emerald-500",
            textColor: "text-green-500",
            icon: Star,
            stars: 4
        };
        if (percentage >= 60) return {
            message: "Good Job!",
            emoji: "👍",
            color: "from-blue-400 to-indigo-500",
            textColor: "text-blue-500",
            icon: Medal,
            stars: 3
        };
        if (percentage >= 40) return {
            message: "Keep Practicing!",
            emoji: "💪",
            color: "from-orange-400 to-amber-500",
            textColor: "text-orange-500",
            icon: Target,
            stars: 2
        };
        return {
            message: "Try Again!",
            emoji: "📚",
            color: "from-red-400 to-rose-500",
            textColor: "text-red-500",
            icon: RotateCcw,
            stars: 1
        };
    };

    const scoreData = getScoreData();
    const IconComponent = scoreData.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="relative overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />

            <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-10 md:p-12 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/50 text-center">
                {/* Trophy Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className={`w-28 h-28 mx-auto mb-8 bg-gradient-to-br ${scoreData.color} rounded-3xl flex items-center justify-center shadow-2xl`}
                >
                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1
                        }}
                    >
                        <Trophy className="w-14 h-14 text-white" />
                    </motion.div>
                </motion.div>

                {/* Stars */}
                <motion.div
                    className="flex justify-center gap-2 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: i < scoreData.stars ? 1 : 0.7,
                                opacity: i < scoreData.stars ? 1 : 0.3
                            }}
                            transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                        >
                            <Star
                                className={`w-8 h-8 ${i < scoreData.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                >
                    Quiz Completed!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl mb-8 flex items-center justify-center gap-2"
                >
                    <span className={`font-semibold ${scoreData.textColor}`}>{scoreData.message}</span>
                    <span className="text-3xl">{scoreData.emoji}</span>
                </motion.p>

                {/* Score Display */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
                    className="mb-10"
                >
                    <div className="inline-flex items-baseline gap-2 bg-slate-100 dark:bg-slate-800 px-10 py-6 rounded-3xl">
                        <motion.span
                            className={`text-7xl md:text-8xl font-black ${scoreData.textColor}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {score}
                        </motion.span>
                        <span className="text-4xl md:text-5xl font-bold text-slate-400">/{total}</span>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-4 text-lg text-muted-foreground"
                    >
                        You got {Math.round(percentage)}% correct
                    </motion.p>
                </motion.div>

                {/* Action Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetQuiz}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30"
                >
                    <Sparkles className="w-6 h-6" />
                    Take Another Quiz
                </motion.button>
            </div>
        </motion.div>
    );
};

export default QuizResult;
