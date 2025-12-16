"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Book, PlayCircle, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface EnrollCourseCardProps {
    course: any;
    enrollCourse: any;
}

export function EnrollCourseCard({ course, enrollCourse }: EnrollCourseCardProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!course) return null;

    const courseJson = course?.courseJson?.course;

    // Calculate progress based on completed topics (new format: { "chapterIndex-topicIndex": true })
    const completedTopics = enrollCourse?.completedChapters || {};

    // Handle both old format (array) and new format (object)
    let completedCount = 0;
    if (Array.isArray(completedTopics)) {
        completedCount = completedTopics.length;
    } else if (typeof completedTopics === 'object') {
        completedCount = Object.keys(completedTopics).length;
    }

    // Calculate total topics across all chapters
    const courseContent = course?.courseContent || [];
    let totalTopics = 0;
    if (Array.isArray(courseContent)) {
        courseContent.forEach((chapter: any) => {
            totalTopics += chapter?.topics?.length || 0;
        });
    }

    // Fallback: if totalTopics is 0, use chapter count as estimate
    if (totalTopics === 0) {
        totalTopics = course?.noOfChapters || courseContent.length || 1;
    }

    const progress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
    const isComplete = progress === 100;

    return (
        <div className={`w-full sm:max-w-sm md:max-w-md bg-white/30 backdrop-blur-lg rounded-2xl border shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden mx-auto ${isComplete ? 'border-green-300 ring-2 ring-green-200' : 'border-gray-200'
            }`}>
            <div className="relative w-full h-48 sm:h-56">
                <Image
                    src={course.bannerImageURL || "/placeholder.jpg"}
                    alt={courseJson?.name || "Course Image"}
                    fill
                    className="object-cover rounded-t-2xl"
                    priority
                />
                {/* Progress overlay badge */}
                <div className="absolute top-3 right-3">
                    {isComplete ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                        </span>
                    ) : progress > 0 ? (
                        <span className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                            {progress}% Done
                        </span>
                    ) : (
                        <span className="px-3 py-1.5 bg-gray-800/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                            Not Started
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {courseJson?.name || "No Title"}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                    {courseJson?.description || "No description available."}
                </p>

                {/* Progress Section */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-500" />
                            {completedCount} of {totalTopics} topics
                        </span>
                        <span className={`font-bold ${isComplete ? 'text-green-600' : 'text-indigo-600'}`}>
                            {progress}%
                        </span>
                    </div>
                    {mounted && (
                        <Progress
                            value={progress}
                            className={`h-2.5 rounded-full ${isComplete ? '[&>div]:bg-green-500' : ''}`}
                        />
                    )}
                </div>

                <div className="flex items-center justify-between pt-3">
                    <span className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
                        <Book className="w-4 h-4" />
                        {courseContent.length || course?.noOfChapters || 0} Chapters
                    </span>

                    <Link href={`/course/${course.cid ?? ""}`}>
                        <Button
                            size="sm"
                            className={`flex items-center gap-2 text-white ${isComplete
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            <PlayCircle className="w-4 h-4" />
                            {isComplete ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
