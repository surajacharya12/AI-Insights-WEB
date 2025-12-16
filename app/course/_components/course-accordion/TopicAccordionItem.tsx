"use client";

import React from "react";
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "../../../../components/ui/accordion";
import {
    PlayCircle,
    ChevronRight,
    Check,
    Circle,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Topic } from "./types";
import MarkdownContent from "./MarkdownContent";
import VideoSection from "./VideoSection";

interface TopicAccordionItemProps {
    topic: Topic;
    chapterIndex: number;
    topicIndex: number;
    isCompleted: boolean;
    onToggleComplete: (chapterIndex: number, topicIndex: number) => void;
    isSaving: boolean;
    isEnrolled: boolean;
}

export default function TopicAccordionItem({
    topic,
    chapterIndex,
    topicIndex,
    isCompleted,
    onToggleComplete,
    isSaving,
    isEnrolled,
}: TopicAccordionItemProps) {
    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onToggleComplete(chapterIndex, topicIndex);
    };

    return (
        <div className="flex items-stretch gap-3">
            {/* Checkbox for completion - OUTSIDE AccordionItem to avoid nested button */}
            {isEnrolled && (
                <div className="flex items-center pt-4">
                    <button
                        onClick={handleCheckboxClick}
                        disabled={isSaving}
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isCompleted
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md'
                                : 'bg-gray-100 hover:bg-indigo-100 text-gray-400 hover:text-indigo-500 border border-gray-200 hover:border-indigo-300'
                            }`}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isCompleted ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Circle className="w-4 h-4" />
                        )}
                    </button>
                </div>
            )}

            <AccordionItem
                value={`topic-${chapterIndex}-${topicIndex}`}
                className={`flex-grow group/topic bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-indigo-200'
                    }`}
            >
                {/* Topic Header/Trigger */}
                <AccordionTrigger className="px-4 py-4 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300 w-full">
                    <div className="flex items-center gap-4 w-full">
                        {/* Topic Number */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${isCompleted
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gradient-to-br from-gray-50 to-gray-100 group-hover/topic:from-indigo-50 group-hover/topic:to-purple-50 border-gray-200 group-hover/topic:border-indigo-200'
                            }`}>
                            <span className={`text-sm font-bold transition-colors ${isCompleted ? 'text-green-600' : 'text-gray-500 group-hover/topic:text-indigo-600'
                                }`}>
                                {topicIndex + 1}
                            </span>
                        </div>

                        <div className="flex-grow text-left min-w-0">
                            <h4 className={`text-base font-semibold transition-colors leading-snug ${isCompleted ? 'text-green-700' : 'text-gray-800 group-hover/topic:text-indigo-700'
                                }`}>
                                {topic.topic}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {topic.youtubeVideos && topic.youtubeVideos.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                        <PlayCircle className="w-3 h-3" />
                                        {topic.youtubeVideos.length} video{topic.youtubeVideos.length > 1 ? "s" : ""}
                                    </span>
                                )}
                                {isCompleted && (
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Completed
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Status icon */}
                        <div className="hidden sm:block">
                            <ChevronRight className={`w-5 h-5 transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-400 group-hover/topic:text-indigo-500'
                                }`} />
                        </div>
                    </div>
                </AccordionTrigger>

                {/* Topic Content */}
                <AccordionContent className="px-4 pb-6 pt-4 border-t border-gray-100">
                    <div className="space-y-8">
                        {/* Mark as Complete Button (prominent CTA) */}
                        {isEnrolled && (
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {isCompleted ? "Great job! You've completed this topic." : "Done studying this topic?"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {isCompleted ? "Uncheck to mark as incomplete" : "Mark as complete to track your progress"}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleComplete(chapterIndex, topicIndex);
                                    }}
                                    disabled={isSaving}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${isCompleted
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        }`}
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : isCompleted ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Completed
                                        </>
                                    ) : (
                                        <>
                                            <Circle className="w-4 h-4" />
                                            Mark Complete
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Markdown Content */}
                        {topic.content && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="relative"
                            >
                                {/* Content wrapper with premium styling */}
                                <div className="relative p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 rounded-2xl border border-gray-100 shadow-inner">
                                    {/* Decorative element */}
                                    <div className="absolute top-0 left-6 w-16 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full -translate-y-1/2" />

                                    <MarkdownContent content={topic.content} />
                                </div>
                            </motion.div>
                        )}

                        {/* YouTube Videos Section */}
                        {topic.youtubeVideos && topic.youtubeVideos.length > 0 && (
                            <VideoSection videos={topic.youtubeVideos} />
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </div>
    );
}
