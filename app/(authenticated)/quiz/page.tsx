"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api_url";
import { useUser } from "../../context/UserContext";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, Loader2 } from "lucide-react";

import QuizInput from "./components/QuizInput";
import QuizQuestion from "./components/QuizQuestion";
import QuizResult from "./components/QuizResult";
import QuizHistory from "./components/QuizHistory";

interface Question {
    question: string;
    options: string[];
    answer: string;
}

interface QuizHistoryItem {
    id: number;
    topic: string;
    score: number;
    totalQuestions: number;
    date: string;
}

const QuizPage = () => {
    const { user } = useUser();
    const [topic, setTopic] = useState("");
    const [numQuestions, setNumQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [history, setHistory] = useState<QuizHistoryItem[]>([]);
    const [saving, setSaving] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [answers, setAnswers] = useState<
        { selected: string; correct: string; isCorrect: boolean }[]
    >([]);

    useEffect(() => {
        if (user?.email) fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/generate-quiz/history/${user?.email}`);
            setHistory(res.data.history || []);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    const generateQuiz = async () => {
        if (!topic) return;
        setLoading(true);
        setQuiz([]);
        setShowResult(false);
        setScore(0);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowAnswer(false);
        setAnswers([]);

        try {
            const res = await axios.post(`${API_URL}/api/generate-quiz`, { topic, numQuestions });
            const quizData = typeof res.data.quiz === "string" ? JSON.parse(res.data.quiz) : res.data.quiz;
            setQuiz(quizData);
        } catch (error) {
            console.error("Error generating quiz:", error);
            alert("Failed to generate quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = () => {
        if (!selectedOption) return;
        const isCorrect = selectedOption === quiz[currentQuestionIndex].answer;
        if (isCorrect) setScore(score + 1);

        setAnswers([...answers, {
            selected: selectedOption,
            correct: quiz[currentQuestionIndex].answer,
            isCorrect
        }]);
        setShowAnswer(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setShowAnswer(false);
        } else finishQuiz();
    };

    const finishQuiz = async () => {
        const finalScore = answers.filter(a => a.isCorrect).length +
            (selectedOption === quiz[currentQuestionIndex].answer ? 1 : 0);
        setScore(finalScore);
        setShowResult(true);
        saveResult(finalScore);
    };

    const saveResult = async (finalScore: number) => {
        if (!user?.email) return;
        setSaving(true);
        try {
            await axios.post(`${API_URL}/api/generate-quiz/save-result`, {
                userEmail: user?.email,
                topic,
                score: finalScore,
                totalQuestions: quiz.length,
                date: new Date().toLocaleDateString(),
            });
            fetchHistory();
        } catch (error) {
            console.error("Error saving result:", error);
        } finally {
            setSaving(false);
        }
    };

    const resetQuiz = () => {
        setQuiz([]);
        setShowResult(false);
        setTopic("");
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowAnswer(false);
        setAnswers([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50 dark:from-slate-950 dark:via-indigo-950/50 dark:to-purple-950">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl shadow-indigo-500/30"
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            transition={{ type: "spring" }}
                        >
                            <BrainCircuit className="w-10 h-10 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                AI Quiz Generator
                            </h1>
                            <p className="text-muted-foreground text-lg">Challenge yourself on any topic with AI-powered quizzes</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="wait">
                            {!quiz.length && !loading && !showResult && (
                                <QuizInput
                                    topic={topic}
                                    setTopic={setTopic}
                                    numQuestions={numQuestions}
                                    setNumQuestions={setNumQuestions}
                                    loading={loading}
                                    generateQuiz={generateQuiz}
                                />
                            )}

                            {loading && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-16 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/50 text-center"
                                >
                                    <div className="relative mx-auto w-24 h-24 mb-8">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-ping opacity-20" />
                                        <div className="absolute inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse opacity-40" />
                                        <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full w-24 h-24 flex items-center justify-center shadow-xl shadow-indigo-500/40">
                                            <Loader2 className="w-12 h-12 animate-spin text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        Generating Your Quiz
                                    </h3>
                                    <p className="text-muted-foreground text-lg">
                                        Creating {numQuestions} questions about "<span className="font-semibold text-indigo-600">{topic}</span>"...
                                    </p>
                                    <div className="mt-6 flex justify-center gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-3 h-3 bg-indigo-500 rounded-full"
                                                animate={{ y: [0, -10, 0] }}
                                                transition={{
                                                    duration: 0.6,
                                                    repeat: Infinity,
                                                    delay: i * 0.15
                                                }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {quiz.length > 0 && !showResult && (
                                <QuizQuestion
                                    question={quiz[currentQuestionIndex]}
                                    currentQuestionIndex={currentQuestionIndex}
                                    totalQuestions={quiz.length}
                                    topic={topic}
                                    selectedOption={selectedOption}
                                    setSelectedOption={setSelectedOption}
                                    showAnswer={showAnswer}
                                    handleSubmitAnswer={handleSubmitAnswer}
                                    handleNextQuestion={handleNextQuestion}
                                />
                            )}

                            {showResult && (
                                <QuizResult
                                    score={score}
                                    total={quiz.length}
                                    resetQuiz={resetQuiz}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <QuizHistory history={history} />
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
