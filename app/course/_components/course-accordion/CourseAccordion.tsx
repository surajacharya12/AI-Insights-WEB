"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Accordion } from "../../../../components/ui/accordion";
import {
    Video,
    FileText,
    BookOpen,
    Sparkles,
    GraduationCap,
    CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import API_URL from "../../../api/api_url";
import { CourseAccordionProps, Chapter, getGradient } from "./types";
import ChapterAccordionItem from "./ChapterAccordionItem";

export default function CourseAccordion({
    chapters,
    courseId,
    userId,
    isEnrolled = false
}: CourseAccordionProps) {
    const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const [savingTopic, setSavingTopic] = useState<string | null>(null);

    const totalTopics = chapters.reduce((acc, ch) => acc + (ch.topics?.length || 0), 0);
    const totalVideos = chapters.reduce(
        (acc, ch) =>
            acc + ch.topics.reduce((tAcc, t) => tAcc + (t.youtubeVideos?.length || 0), 0),
        0
    );
    const completedCount = Object.keys(completedTopics).length;
    const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    // Fetch progress on mount
    useEffect(() => {
        if (!courseId || !userId || !isEnrolled) return;

        const fetchProgress = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_URL}/api/course-progress?userId=${userId}&courseId=${courseId}`
                );
                setCompletedTopics(response.data.completedTopics || {});
            } catch (error) {
                console.error("Error fetching progress:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [courseId, userId, isEnrolled]);

    // Toggle topic completion
    const toggleTopicComplete = useCallback(
        async (chapterIndex: number, topicIndex: number) => {
            if (!courseId || !userId || !isEnrolled) {
                toast.error("Please enroll in this course to track progress");
                return;
            }

            const topicKey = `${chapterIndex}-${topicIndex}`;
            const isCurrentlyCompleted = !!completedTopics[topicKey];

            setSavingTopic(topicKey);

            try {
                await axios.post(`${API_URL}/api/course-progress`, {
                    userId,
                    courseId,
                    chapterIndex,
                    topicIndex,
                    completed: !isCurrentlyCompleted,
                });

                setCompletedTopics((prev) => {
                    const updated = { ...prev };
                    if (isCurrentlyCompleted) {
                        delete updated[topicKey];
                    } else {
                        updated[topicKey] = true;
                    }
                    return updated;
                });

                toast.success(
                    isCurrentlyCompleted ? "Topic marked as incomplete" : "Topic completed! 🎉"
                );
            } catch (error) {
                console.error("Error updating progress:", error);
                toast.error("Failed to update progress");
            } finally {
                setSavingTopic(null);
            }
        },
        [courseId, userId, isEnrolled, completedTopics]
    );

    // Calculate chapter progress
    const getChapterProgress = (chapterIndex: number, chapter: Chapter) => {
        const topicsInChapter = chapter.topics?.length || 0;
        let completedInChapter = 0;

        chapter.topics?.forEach((_, topicIndex) => {
            if (completedTopics[`${chapterIndex}-${topicIndex}`]) {
                completedInChapter++;
            }
        });

        return { completed: completedInChapter, total: topicsInChapter };
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-2">
            {/* Premium Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative mb-10 p-8 rounded-3xl overflow-hidden"
            >
                {/* Background with animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-95" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

                {/* Floating orbs */}
                <div className="absolute top-4 right-10 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-4 left-10 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white/80 text-sm font-medium uppercase tracking-widest">
                            Course Curriculum
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                        Master Your Learning
                    </h2>

                    {/* Progress Bar (only show if enrolled) */}
                    {isEnrolled && (
                        <div className="mb-6">
                            <div className="flex justify-between text-white/90 text-sm mb-2">
                                <span>Your Progress</span>
                                <span className="font-bold">{progressPercent}% Complete</span>
                            </div>
                            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                                />
                            </div>
                            <p className="text-white/70 text-xs mt-2">
                                {completedCount} of {totalTopics} topics completed
                            </p>
                        </div>
                    )}

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <BookOpen className="w-4 h-4 text-white" />
                            <span className="text-white font-semibold">{chapters.length} Chapters</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <FileText className="w-4 h-4 text-white" />
                            <span className="text-white font-semibold">{totalTopics} Topics</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <Video className="w-4 h-4 text-white" />
                            <span className="text-white font-semibold">{totalVideos} Videos</span>
                        </div>
                        {isEnrolled && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/30 backdrop-blur-md rounded-full border border-green-400/40">
                                <CheckCircle2 className="w-4 h-4 text-green-300" />
                                <span className="text-green-100 font-semibold">{completedCount} Completed</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Chapters Accordion */}
            <Accordion type="single" collapsible className="w-full space-y-5">
                {chapters.map((chapter, chapterIndex) => {
                    const chapterProgress = getChapterProgress(chapterIndex, chapter);

                    return (
                        <motion.div
                            key={chapterIndex}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: chapterIndex * 0.08 }}
                        >
                            <ChapterAccordionItem
                                chapter={chapter}
                                chapterIndex={chapterIndex}
                                gradient={getGradient(chapterIndex)}
                                completedTopics={completedTopics}
                                onToggleComplete={toggleTopicComplete}
                                savingTopic={savingTopic}
                                isEnrolled={isEnrolled}
                                chapterProgress={chapterProgress}
                            />
                        </motion.div>
                    );
                })}
            </Accordion>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 text-center text-gray-500 text-sm"
            >
                <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>AI-Powered Course Content</span>
                </div>
            </motion.div>
        </div>
    );
}
