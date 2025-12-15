"use client";

import React, { useEffect, useState } from "react";
import { EnrollCourseCard } from "./enrollcoursecard";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import API_URL from "@/app/api/api_url";

const URL = API_URL + "/api/enroll?userId=";

interface EnrollCourseListProps {
    userId: string;
}

export function EnrollCourseList({ userId }: EnrollCourseListProps) {
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
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [userId]);

    if (loading) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                ))}
            </div>
        );
    }

    if (enrollCourses.length === 0) {
        return <p className="text-gray-500">You have not enrolled in any courses yet.</p>;
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {enrollCourses.map((item, index) => (
                <EnrollCourseCard
                    key={item.courses?.cid ?? index}
                    course={item.courses}
                    enrollCourse={item.enrollments}
                />
            ))}
        </div>
    );
}
