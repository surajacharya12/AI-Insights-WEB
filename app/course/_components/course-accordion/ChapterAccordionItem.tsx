"use client";

import React from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "../../../../components/ui/accordion";
import {
    FileText,
    PlayCircle,
    Zap,
    CheckCircle2,
} from "lucide-react";
import { Chapter } from "./types";
import TopicAccordionItem from "./TopicAccordionItem";

interface ChapterAccordionItemProps {
    chapter: Chapter;
    chapterIndex: number;
    gradient: string;
    completedTopics: Record<string, boolean>;
    onToggleComplete: (chapterIndex: number, topicIndex: number) => void;
    savingTopic: string | null;
    isEnrolled: boolean;
    chapterProgress: { completed: number; total: number };
}

export default function ChapterAccordionItem({
    chapter,
    chapterIndex,
    gradient,
    completedTopics,
    onToggleComplete,
    savingTopic,
    isEnrolled,
    chapterProgress,
}: ChapterAccordionItemProps) {
    const videoCount = chapter.topics.reduce(
        (acc, t) => acc + (t.youtubeVideos?.length || 0),
        0
    );

    const isChapterComplete = chapterProgress.completed === chapterProgress.total && chapterProgress.total > 0;

    return (
        <AccordionItem
            value={`chapter-${chapterIndex}`}
            className="group relative bg-white rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-500 overflow-hidden border border-gray-100"
        >
            {/* Gradient accent line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            {/* Chapter Header/Trigger */}
            <AccordionTrigger className="px-6 py-6 hover:bg-gray-50/80 transition-all duration-300 w-full group-hover:pl-8">
                <div className="flex items-start gap-5 w-full">
                    {/* Chapter Number Badge */}
                    <div className={`relative flex-shrink-0 w-14 h-14 ${isChapterComplete ? 'bg-gradient-to-br from-green-500 to-emerald-500' : `bg-gradient-to-br ${gradient}`} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        {isChapterComplete ? (
                            <CheckCircle2 className="w-7 h-7 text-white" />
                        ) : (
                            <span className="text-white font-black text-xl">
                                {String(chapterIndex + 1).padStart(2, "0")}
                            </span>
                        )}
                        {/* Glow effect */}
                        <div className={`absolute inset-0 ${isChapterComplete ? 'bg-gradient-to-br from-green-500 to-emerald-500' : `bg-gradient-to-br ${gradient}`} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                    </div>

                    <div className="flex-grow text-left min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                                Chapter {chapterIndex + 1}
                            </span>
                            <div className="h-px flex-grow bg-gradient-to-r from-indigo-200 to-transparent max-w-[100px]" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-700 transition-colors duration-300">
                            {chapter.chapterName}
                        </h3>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                <div className="p-1 bg-indigo-50 rounded">
                                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                </div>
                                <span className="font-medium">{chapter.topics?.length || 0} Topics</span>
                            </div>
                            {videoCount > 0 && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <div className="p-1 bg-red-50 rounded">
                                        <PlayCircle className="w-3.5 h-3.5 text-red-500" />
                                    </div>
                                    <span className="font-medium">{videoCount} Videos</span>
                                </div>
                            )}
                            {isEnrolled && (
                                <div className="flex items-center gap-1.5 text-sm">
                                    <div className={`p-1 ${isChapterComplete ? 'bg-green-50' : 'bg-gray-50'} rounded`}>
                                        <CheckCircle2 className={`w-3.5 h-3.5 ${isChapterComplete ? 'text-green-500' : 'text-gray-400'}`} />
                                    </div>
                                    <span className={`font-medium ${isChapterComplete ? 'text-green-600' : 'text-gray-500'}`}>
                                        {chapterProgress.completed}/{chapterProgress.total} Done
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="hidden md:flex flex-col items-end gap-1">
                        {isEnrolled ? (
                            isChapterComplete ? (
                                <div className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                                    <span className="text-xs font-semibold text-green-600">✓ Completed</span>
                                </div>
                            ) : (
                                <div className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full">
                                    <span className="text-xs font-semibold text-indigo-600">In Progress</span>
                                </div>
                            )
                        ) : (
                            <div className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full">
                                <span className="text-xs font-semibold text-indigo-600">Ready to Learn</span>
                            </div>
                        )}
                    </div>
                </div>
            </AccordionTrigger>

            {/* Chapter Content - Topics */}
            <AccordionContent className="px-6 pb-6 pt-2">
                <div className="ml-0 md:ml-[76px] space-y-3">
                    {/* Progress bar */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-100">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-medium text-indigo-700">
                            {chapter.topics?.length || 0} lessons in this chapter
                        </span>
                        {isEnrolled && (
                            <span className="ml-auto text-sm font-medium text-gray-500">
                                {chapterProgress.completed}/{chapterProgress.total} completed
                            </span>
                        )}
                    </div>

                    {/* Nested Topics Accordion */}
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {chapter.topics?.map((topic, topicIndex) => (
                            <TopicAccordionItem
                                key={topicIndex}
                                topic={topic}
                                chapterIndex={chapterIndex}
                                topicIndex={topicIndex}
                                isCompleted={!!completedTopics[`${chapterIndex}-${topicIndex}`]}
                                onToggleComplete={onToggleComplete}
                                isSaving={savingTopic === `${chapterIndex}-${topicIndex}`}
                                isEnrolled={isEnrolled}
                            />
                        ))}
                    </Accordion>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
