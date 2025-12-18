'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, notFound } from 'next/navigation';
import { CourseInfo } from '../../_components/courseinfo';
import { ChapterTopicList } from '../../_components/chapterTopicList';
import { toast } from 'sonner';
import API_URL from '@/app/api/api_url';

export default function EditCoursePage() {
    const routeParams = useParams();
    const courseId = routeParams?.courseId as string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [course, setCourse] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courseId) {
            setLoading(false);
            return;
        }

        const fetchCourse = async () => {
            try {
                console.log(`Fetching course from: ${API_URL}/api/get-courses?courseId=${courseId}`);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const result = await axios.get<any>(`${API_URL}/api/get-courses?courseId=${courseId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    validateStatus: (status) => status < 500, // Don't throw on 4xx errors
                });

                console.log("API Response:", result);

                if (!result.data || result.status >= 400) {
                    const errorMsg = result.data?.error || "Course not found.";
                    toast.error(errorMsg);
                    throw new Error(errorMsg);
                }

                setCourse(result.data);
            } catch (error) {
                console.error("Error fetching course:", error);

                // Check if it's an axios error
                if (axios.isAxiosError(error)) {
                    console.error("Axios error details:", {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                    });

                    if (error.message.includes("JSON")) {
                        toast.error("Server returned invalid response. Please check if the backend is running.");
                    } else {
                        toast.error(error.response?.data?.error || "Failed to load course details.");
                    }
                } else {
                    toast.error("Failed to load course details.");
                }

                notFound();
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen pb-10 p-6 space-y-6">
                {/* Course Info Skeleton */}
                <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                    <div className="h-48 w-full bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
                {/* Chapter List Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg p-4 shadow-sm h-20 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (!course) {
        notFound();
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <CourseInfo course={course} />
            <ChapterTopicList course={course} />
        </div>
    );
}