"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Book, LoaderCircle, PlayCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import API_URL from "@/app/api/api_url";

interface CourseCardProps {
    course: any;
}

export function CourseCard({ course }: CourseCardProps) {
    const [hasMounted, setHasMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!course) return null;

    const courseJson = course?.courseJson?.course;

    const onEnrollCourse = async () => {
        try {
            setLoading(true);
            // Ensure we have user context
            if (!user?.id) {
                toast.error('User not logged in');
                return;
            }
            const response = await axios.post(`${API_URL}/api/enroll`, {
                courseId: course.cid,
                userId: user.id,
            });
            if (response.status === 200) {
                toast.success('Successfully enrolled in course!');
                router.push('/dashboard');
            } else {
                toast.error('Enrollment failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to enroll. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="course-card w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-white/30 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden mx-auto">
            {/* Course Image */}
            <div className="relative w-full h-48 sm:h-56 md:h-60 lg:h-64">
                <Image
                    src={course.bannerImageURL || "https://placehold.co/600x400"}
                    alt={courseJson?.name || "Course Image"}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-t-2xl"
                    priority
                />
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    {courseJson?.name}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-3">
                    {courseJson?.description}
                </p>

                {/* Bottom row: chapters + button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                    <span className="flex items-center gap-2 text-indigo-600 font-medium text-sm sm:text-base">
                        <Book className="w-4 h-4 sm:w-5 sm:h-5" />
                        {courseJson?.noOfChapters || 0} Chapters
                    </span>

                    {hasMounted && course?.courseContent?.length ? (
                        <Button
                            onClick={onEnrollCourse}
                            disabled={loading}
                            className="flex items-center gap-2 justify-center text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
                        >
                            {loading ? (
                                <LoaderCircle className="w-5 h-5 animate-spin" />
                            ) : (
                                <PlayCircle className="w-5 h-5" />
                            )}
                            Start Learning
                        </Button>
                    ) : (
                        <Link href={`/edit-course-layout/${course?.cid}`}>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-2 justify-center text-sm sm:text-base"
                            >
                                <Settings className="w-4 h-4" />
                                Generate Course
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}