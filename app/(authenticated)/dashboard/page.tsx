"use client";

import React, { useState, useEffect } from "react";
import CourseList from "../_components/CourseList";
import { EnrollCourseList } from "../_components/enrollcourselist";
import WelcomeBanner from "../_components/WelcomeBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useUser } from "../../context/UserContext";
import { Loader2, Sparkles } from "lucide-react";

export default function DashboardPage() {
    const { user, loading: userLoading } = useUser();
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setDataLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">

                {/* Loader for user */}
                {/* Loader for user */}
                {userLoading && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-48 rounded-md" />
                                <Skeleton className="h-4 w-32 rounded-md" />
                            </div>
                        </div>
                        <Skeleton className="h-64 w-full rounded-3xl" />
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-48 rounded-md" />
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Dashboard welcome */}
                {!userLoading && user && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                Dashboard <Sparkles className="w-5 h-5 text-yellow-500" />
                            </h2>
                            <p className="text-gray-500">
                                Welcome back,{" "}
                                <span className="font-semibold text-indigo-600">{user.name}</span>!
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Content */}
                {dataLoading ? (
                    <div className="space-y-8">
                        <Skeleton className="h-64 w-full rounded-3xl" />
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-48 rounded-md" />
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-48 rounded-md" />
                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <WelcomeBanner />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                    Continue Learning
                                </h3>
                            </div>

                            {/* Only render EnrollCourseList if user.id exists */}
                            {user?.id ? (
                                <EnrollCourseList userId={user.id} />
                            ) : (
                                <p className="text-gray-500">Loading courses...</p>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                    Your Courses
                                </h3>
                            </div>
                            <CourseList mode="user" />
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
