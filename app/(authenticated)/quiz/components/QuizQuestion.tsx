"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, Timer, Award } from "lucide-react";

interface Question {
    question: string;
    options: string[];
    answer: string;
}

interface QuizQuestionProps {
    question: Question;
    currentQuestionIndex: number;
    totalQuestions: number;
    topic?: string;
    selectedOption: string | null;
    setSelectedOption: (option: string) => void;
    showAnswer: boolean;
    handleSubmitAnswer: () => void;
    handleNextQuestion: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
    question,
    currentQuestionIndex,
    totalQuestions,
    topic = "Quiz",
    selectedOption,
    setSelectedOption,
    showAnswer,
    handleSubmitAnswer,
    handleNextQuestion,
}) => {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl" />

            <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/50">
                {/* Header with Progress */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 px-4 py-2 rounded-full">
                                <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                    Question {currentQuestionIndex + 1}/{totalQuestions}
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/50 px-4 py-2 rounded-full"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{topic}</span>
                        </motion.div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 rounded-full blur-sm"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Question */}
                <motion.div
                    key={`question-${currentQuestionIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-relaxed">
                        {question.question}
                    </h3>
                </motion.div>

                {/* Options */}
                <div className="space-y-4 mb-8">
                    {question.options.map((option, index) => {
                        const isSelected = selectedOption === option;
                        const isCorrect = option === question.answer;
                        const showCorrect = showAnswer && isCorrect;
                        const showWrong = showAnswer && isSelected && !isCorrect;

                        return (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.08 }}
                                whileHover={!showAnswer ? { scale: 1.02, x: 8 } : {}}
                                whileTap={!showAnswer ? { scale: 0.98 } : {}}
                                onClick={() => !showAnswer && setSelectedOption(option)}
                                disabled={showAnswer}
                                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${showCorrect
                                        ? "border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg shadow-green-500/20"
                                        : showWrong
                                            ? "border-red-500 bg-red-50 dark:bg-red-900/30 shadow-lg shadow-red-500/20"
                                            : isSelected
                                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg shadow-indigo-500/20"
                                                : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    } ${showAnswer ? "cursor-default" : "cursor-pointer"}`}
                            >
                                <div className="flex items-center gap-4">
                                    <motion.span
                                        animate={showCorrect ? { scale: [1, 1.2, 1] } : showWrong ? { x: [0, -5, 5, -5, 0] } : {}}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-base transition-all ${showCorrect
                                                ? "bg-green-500 text-white"
                                                : showWrong
                                                    ? "bg-red-500 text-white"
                                                    : isSelected
                                                        ? "bg-indigo-500 text-white"
                                                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                            }`}
                                    >
                                        {String.fromCharCode(65 + index)}
                                    </motion.span>
                                    <span className="flex-1 text-lg font-medium">{option}</span>
                                    <AnimatePresence>
                                        {showCorrect && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <CheckCircle2 className="w-7 h-7 text-green-500" />
                                            </motion.div>
                                        )}
                                        {showWrong && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: 180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <XCircle className="w-7 h-7 text-red-500" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                    <AnimatePresence mode="wait">
                        {!showAnswer ? (
                            <motion.button
                                key="submit"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -10px rgba(99, 102, 241, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmitAnswer}
                                disabled={!selectedOption}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Check Answer
                            </motion.button>
                        ) : (
                            <motion.button
                                key="next"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.05, x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextQuestion}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-500/30 flex items-center gap-3"
                            >
                                {currentQuestionIndex === totalQuestions - 1 ? (
                                    <>
                                        <Award className="w-5 h-5" />
                                        See Results
                                    </>
                                ) : (
                                    <>
                                        Next Question
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default QuizQuestion;
