"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import {
    ArrowRight,
    Loader2,
    BookOpen,
    Layers,
    Video,
    BarChart,
    Tag,
    Sparkles
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import { generateCourseLayout } from "../api/courseApi";
import { toast } from "sonner";

interface AddNewCourseDialogProps {
    children: React.ReactNode;
}

export function AddNewCourseDialog({ children }: AddNewCourseDialogProps) {
    const router = useRouter();
    const { user, loading: userLoading } = useUser();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        courseId: "",
        includeVideo: false,
        chapters: "",
        level: "",
        category: "",
    });

    const [loading, setLoading] = useState(false);

    const onHandleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();



        if (
            !formData.name ||
            !formData.description ||
            !formData.chapters ||
            !formData.level ||
            !formData.category
        ) {
            toast.error("Please fill out all required fields.");
            return;
        }

        const chaptersNumber = Number(formData.chapters);
        if (isNaN(chaptersNumber) || chaptersNumber <= 0) {
            toast.error("Please enter a valid number of chapters.");
            return;
        }

        if (chaptersNumber > 6) {
            toast.error("Maximum 6 chapters are allowed.");
            return;
        }

        onGenerate();
    };

    const onGenerate = async () => {
        try {
            setLoading(true);

            if (!user?.email) {
                toast.error("User not found. Please login.");
                return;
            }

            const courseId = uuidv4();

            await generateCourseLayout({
                email: user.email,
                courseId,
                name: formData.name,
                description: formData.description,
                category: formData.category,
                level: formData.level,
                includeVideo: formData.includeVideo,
                noOfChapters: Number(formData.chapters),
            });

            toast.success("Course layout generated successfully!");
            router.push("/edit-course-layout/" + courseId);
        } catch (error: any) {
            const msg =
                error?.response?.data?.error ||
                error.message ||
                "Failed to generate course layout";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <>{children}</>;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] md:max-h-[85vh] flex flex-col rounded-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-xl p-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50" />

                <DialogHeader className="p-8 pb-4 flex-shrink-0 border-b border-gray-100/50">
                    <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-xl shadow-inner">
                            <Sparkles className="w-6 h-6 text-indigo-600" />
                        </div>
                        Create New Course
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-lg mt-2">
                        Use AI to generate a comprehensive course structure in seconds.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 pt-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 transition-colors">
                    {userLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                            <p className="text-gray-500">Verifying user...</p>
                        </div>
                    ) : user ? (
                        <form className="space-y-6" onSubmit={onSubmit}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wider">Creator</p>
                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Course Name */}
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-gray-400" /> Course Name
                                    </label>
                                    <Input
                                        placeholder="e.g. Advanced React Patterns"
                                        value={formData.name}
                                        onChange={(e) => onHandleInputChange("name", e.target.value)}
                                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 h-12 text-base transition-all hover:border-indigo-300"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-gray-400" /> Description
                                    </label>
                                    <Textarea
                                        placeholder="What will students learn in this course?"
                                        value={formData.description}
                                        onChange={(e) => onHandleInputChange("description", e.target.value)}
                                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 min-h-[100px] resize-none transition-all hover:border-indigo-300"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-gray-400" /> Category
                                    </label>
                                    <Input
                                        placeholder="e.g. Programming"
                                        value={formData.category}
                                        onChange={(e) => onHandleInputChange("category", e.target.value)}
                                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 h-11 transition-all hover:border-indigo-300"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Level */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <BarChart className="w-4 h-4 text-gray-400" /> Difficulty Level
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="level"
                                            value={formData.level}
                                            onChange={(e) => onHandleInputChange("level", e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all hover:border-indigo-300 h-11"
                                            disabled={loading}
                                        >
                                            <option value="" disabled>Select level</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                        <div className="absolute right-3 top-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Chapters */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between gap-2">
                                        <span className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-gray-400" /> No. of Chapters
                                        </span>
                                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">MAX 6</span>
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 5 (Max 6)"
                                        value={formData.chapters}
                                        onChange={(e) => onHandleInputChange("chapters", e.target.value)}
                                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 h-11 transition-all hover:border-indigo-300"
                                        disabled={loading}
                                        min={1}
                                        max={6}
                                    />
                                </div>

                                {/* Include Video */}
                                <div className="space-y-2 flex flex-col justify-end pb-1">
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.includeVideo ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                                            {formData.includeVideo && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.includeVideo}
                                            onChange={(e) => onHandleInputChange("includeVideo", e.target.checked)}
                                            disabled={loading}
                                        />
                                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2 group-hover:text-gray-900">
                                            <Video className="w-4 h-4 text-indigo-500" /> Include Video Content
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-white font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Generating Course Structure...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Generate Course Layout</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔒</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Authentication Required</h3>
                            <p className="text-gray-500 mt-2 mb-6 max-w-xs mx-auto">Please log in to your account to start creating amazing AI courses.</p>
                            <button
                                onClick={() => router.push('/sign-in')}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                            >
                                Sign In
                            </button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}