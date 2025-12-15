"use client";

import React from "react";
import { motion } from "framer-motion";
import { History, BrainCircuit, TrendingUp, Calendar, Trophy, Flame } from "lucide-react";

interface QuizHistoryItem {
    id: number;
    topic: string;
    score: number;
    totalQuestions: number;
    date: string;
}

interface QuizHistoryProps {
    history: QuizHistoryItem[];
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ history }) => {
    const getScoreColor = (score: number, total: number) => {
        const pct = (score / total) * 100;
        if (pct >= 80) return "text-green-500";
        if (pct >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBg = (score: number, total: number) => {
        const pct = (score / total) * 100;
        if (pct >= 80) return "bg-green-500";
        if (pct >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    const totalQuizzes = history.length;
    const avgScore = history.length > 0
        ? Math.round(history.reduce((acc, h) => acc + (h.score / h.totalQuestions) * 100, 0) / history.length)
        : 0;
    const perfectScores = history.filter(h => h.score === h.totalQuestions).length;

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-1"
        >
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/50 sticky top-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
                        <History className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Quiz History</h3>
                </div>

                {/* Stats */}
                {history.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-3 gap-3 mb-6"
                    >
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-3 rounded-xl text-center">
                            <Flame className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
                            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{totalQuizzes}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-3 rounded-xl text-center">
                            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-500" />
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">{avgScore}%</p>
                            <p className="text-xs text-muted-foreground">Avg</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 p-3 rounded-xl text-center">
                            <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{perfectScores}</p>
                            <p className="text-xs text-muted-foreground">Perfect</p>
                        </div>
                    </motion.div>
                )}

                {/* History List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                    {history.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity
                                }}
                                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center"
                            >
                                <BrainCircuit className="w-10 h-10 text-slate-400" />
                            </motion.div>
                            <p className="text-muted-foreground font-medium">
                                No quizzes taken yet
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Start your first quiz!
                            </p>
                        </motion.div>
                    ) : (
                        history.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-semibold text-sm line-clamp-1 flex-1 pr-2" title={item.topic}>
                                        {item.topic}
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {item.date}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.score / item.totalQuestions) * 100}%` }}
                                            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                                            className={`h-full rounded-full ${getScoreBg(item.score, item.totalQuestions)}`}
                                        />
                                    </div>
                                    <span className={`font-bold text-sm min-w-[45px] text-right ${getScoreColor(item.score, item.totalQuestions)}`}>
                                        {item.score}/{item.totalQuestions}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default QuizHistory;
