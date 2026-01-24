"use client";

import React, { useEffect, useState, useMemo } from "react";
import { EnrollCourseCard } from "./enrollcoursecard";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import API_URL from "@/app/api/api_url";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

const URL = API_URL + "/api/enroll?userId=";

interface EnrollCourseListProps {
    userId: string;
    filter?: "active" | "completed" | "all";
    header?: string;
}

export function EnrollCourseList({ userId, filter = "all", header }: EnrollCourseListProps) {
    const { enrollmentRefreshTrigger } = useUser();
    const [enrollCourses, setEnrollCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchEnrollments = async () => {
            try {
                const response = await axios.get(`${URL}${userId}`);
                setEnrollCourses(response.data);
            } catch (err) {
                console.error("Error fetching enrollments:", err);
                toast.error("Failed to fetch enrolled courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [userId, enrollmentRefreshTrigger]);

    const filteredCourses = useMemo(() => {
        if (!enrollCourses) return [];

        return enrollCourses.filter(item => {
            const course = item.courses;
            const enrollCourse = item.enrollments;

            if (!course) return false;

            const completedTopics = enrollCourse?.completedChapters || {};
            let completedCount = 0;
            if (Array.isArray(completedTopics)) {
                completedCount = completedTopics.length;
            } else if (typeof completedTopics === 'object') {
                completedCount = Object.keys(completedTopics).length;
            }

            const courseContent = course?.courseContent || [];
            let totalTopics = 0;
            if (Array.isArray(courseContent)) {
                courseContent.forEach((chapter: any) => {
                    totalTopics += chapter?.topics?.length || 0;
                });
            }

            if (totalTopics === 0) {
                totalTopics = course?.noOfChapters || courseContent.length || 1;
            }

            const progress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
            const isComplete = progress === 100;

            if (filter === "completed") return isComplete;
            if (filter === "active") return !isComplete;
            return true;
        });
    }, [enrollCourses, filter]);

    if (loading) {
        return (
            <div className="space-y-6">
                {header && (
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-48 rounded-md" />
                    </div>
                )}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (filteredCourses.length === 0) {
        if (filter === "completed") {
            return null; // Don't show the section if no completed courses
        }
        return (
            <div className="space-y-6">
                {header && (
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                            {header}
                        </h3>
                    </div>
                )}
                <p className="text-gray-500">
                    {filter === "active"
                        ? "You don't have any active courses."
                        : "You have not enrolled in any courses yet."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {header && (
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        {header}
                    </h3>
                </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-left">
                {filteredCourses.map((item, index) => (
                    <EnrollCourseCard
                        key={item.courses?.cid ?? index}
                        course={item.courses}
                        enrollCourse={item.enrollments}
                    />
                ))}
            </div>
        </div>
    );
}