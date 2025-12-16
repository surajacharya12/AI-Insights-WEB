"use client";

import React, { useEffect, useState } from "react";
import { MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddNewCourseDialog } from "../../components/AddNewCourseDialog";
import { CourseCard } from "./coursecard";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";
import API_URL from "@/app/api/api_url";
import axios from "axios";

interface CourseListProps {
    mode?: "user" | "all";
}

export default function CourseList({ mode = "user" }: CourseListProps) {
    const { user } = useUser();
    const [courseList, setCourseList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                let url = `${API_URL}/api/get-courses`;

                if (mode === "user") {
                    if (user?.id) {
                        url += `?userId=${user.id}`;
                    } else {
                        // If user mode but no user ID, wait or return
                        return;
                    }
                } else {
                    // All courses
                    url += `?courseId=0`;
                }

                const response = await axios.get(url);
                setCourseList(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error("Failed to fetch courses.");
            } finally {
                setLoading(false);
            }
        };

        if (mode === "all" || (mode === "user" && user)) {
            fetchCourses();
        }
    }, [user, mode]);

    if (loading) {
        return (
            <div className="text-center py-12 px-4 sm:px-8 bg-gray-50 min-h-[50vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            {courseList?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-2xl shadow-xl transition-all duration-300 border-4 border-gray-200">
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white mb-6 shadow-md">
                        <MonitorSmartphone className="w-12 h-12" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-medium text-gray-700 mb-4">
                        {mode === "user"
                            ? "Looks like you haven't created any courses yet."
                            : "No courses found."}
                    </h2>
                    {mode === "user" && (
                        <AddNewCourseDialog>
                            <Button className="mt-2 px-6 py-2 text-sm sm:text-base font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                                + Create your first course
                            </Button>
                        </AddNewCourseDialog>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
                    {courseList.map((course, index) => (
                        <CourseCard course={course} key={index} />
                    ))}
                </div>
            )}
        </div>
    );
}