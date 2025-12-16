'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import {
    BookMarked,
    Clock,
    ChartNoAxesCombined,
    Loader2,
    PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import API_URL from '@/app/api/api_url';

export function CourseInfo({
    course = {},
    viewcourse
}: {
    course: any;
    viewcourse?: boolean;
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    let courseLayout = course?.courseJson;
    if (typeof courseLayout === 'string') {
        try {
            courseLayout = JSON.parse(courseLayout);
        } catch (e) {
            console.error(e);
        }
    }
    courseLayout = courseLayout?.course || {};

    const bannerSrc = course.bannerImageURL || 'https://placehold.co/600x400';

    /* =====================================================
       GENERATE COURSE CONTENT (YOUR METHOD)
    ===================================================== */
    const GetCourseContent = async () => {
        try {
            setLoading(true);

            const result = await axios.post(
                `${API_URL}/api/generate-course-content`,
                {
                    courseJson: courseLayout,
                    courseTitle: course?.name,
                    courseId: course?.cid,
                }
            );

            console.log('Result:', result.data);
            toast.success('Course content generated successfully!');

            setTimeout(() => {
                router.push('/dashboard/');
            }, 500);
        } catch (e: any) {
            console.error('Error:', e);
            const errorMessage =
                e.response?.data?.message || 'Failed to generate course content.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-10 px-6 md:px-10">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Text Section */}
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            {courseLayout.name || course.name}
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            {courseLayout.description || course.description}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg font-medium">
                                <Clock className="w-5 h-5" />
                                {courseLayout.duration || '2 Hours'}
                            </div>

                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg font-medium">
                                <BookMarked className="w-5 h-5" />
                                {courseLayout.noOfChapters || course.noOfChapters} Chapters
                            </div>

                            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-lg font-medium">
                                <ChartNoAxesCombined className="w-5 h-5" />
                                {courseLayout.level || course.level}
                            </div>
                        </div>
                    </div>

                    {/* Banner Section */}
                    <div className="relative w-full md:w-[500px] h-[300px] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                        <Image
                            src={bannerSrc}
                            alt="Course Banner"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-10">
                    {!viewcourse ? (
                        <button
                            onClick={GetCourseContent}
                            disabled={loading}
                            aria-busy={loading}
                            className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all
                ${loading
                                    ? 'bg-green-500 opacity-70 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                } text-white`}
                        >
                            <Loader2 className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Generating...' : 'Generate Full Course Content'}
                        </button>
                    ) : (
                        <Link
                            href={`/course/${course?.cid}`}
                            className="inline-flex px-8 py-4 rounded-xl font-bold text-lg items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white transition-all"
                        >
                            <PlayCircle className="w-5 h-5" />
                            Continue Learning
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
