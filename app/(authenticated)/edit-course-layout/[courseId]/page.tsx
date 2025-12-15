'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, notFound } from 'next/navigation'; // <-- Import notFound here
import { CourseInfo } from '../../_components/courseinfo';
import { ChapterTopicList } from '../../_components/chapterTopicList';
import { toast } from 'sonner';
import API_URL from '@/app/api/api_url';
interface Course {
    id: string;
    name: string;
}

export default function EditCoursePage() {
    const params = useParams();
    const courseId = params.courseId as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courseId) {
            setLoading(false);
            return;
        }

        const fetchCourse = async () => {
            try {

                const result = await axios.get<Course>(`${API_URL}/api/get-courses?courseId=${courseId}`);

                if (!result.data) {

                    toast.error("Course not found.");
                    throw new Error("Course not found");
                }

                setCourse(result.data);
            } catch (error) {
                console.error("Error fetching course:", error);


                notFound();

                toast.error("Failed to load course details.");
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
            <CourseInfo course={course} viewcourse={false} />
            <ChapterTopicList course={course} />
        </div>
    );
}