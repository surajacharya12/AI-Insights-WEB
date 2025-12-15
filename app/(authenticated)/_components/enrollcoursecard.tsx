"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Book, PlayCircle } from "lucide-react";
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
    const completed = enrollCourse?.completedChapters?.length ?? 0;
    const total = course?.courseContent?.length ?? 1;
    const progress = Math.round((completed / total) * 100);

    return (
        <div className="w-full sm:max-w-sm md:max-w-md bg-white/30 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden mx-auto">
            <div className="relative w-full h-48 sm:h-56">
                <Image
                    src={course.bannerImageURL || "/placeholder.jpg"}
                    alt={courseJson?.name || "Course Image"}
                    fill
                    className="object-cover rounded-t-2xl"
                    priority
                />
            </div>

            <div className="p-5 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {courseJson?.name || "No Title"}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3">
                    {courseJson?.description || "No description available."}
                </p>

                <div className="space-y-1">
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    {mounted && <Progress value={progress} className="h-2 rounded-full" />}
                </div>

                <div className="flex items-center justify-between pt-3">
                    <span className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
                        <Book className="w-4 h-4" />
                        {total} Chapters
                    </span>

                    <Link href={`/allinsight/view-course/${course.cid ?? ""}`}>
                        <Button
                            size="sm"
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            <PlayCircle className="w-4 h-4" />
                            Continue
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
