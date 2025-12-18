"use client";

import React, { useState, useEffect } from "react";
import { Video, PlayCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { YouTubeVideo } from "./types";

interface VideoSectionProps {
    videos: YouTubeVideo[];
}



export default function VideoSection({ videos }: VideoSectionProps) {
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
    const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 3;

    useEffect(() => {
        if (!selectedVideo && videos.length) {
            setSelectedVideo(videos[0]);
        }
    }, [videos, selectedVideo]);

    if (!videos || videos.length === 0) return null;

    const totalPages = Math.ceil(videos.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const visibleVideos = videos.slice(startIndex, startIndex + PAGE_SIZE);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        // Scroll to the top of the video grid/header if needed
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5"
        >
            {/* ================= Header ================= */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-red-500 to-pink-600 p-2.5 shadow-lg shadow-red-200">
                        <Video className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900">Video Resources</h4>
                        <p className="text-sm text-gray-500">
                            Watch and learn from curated content
                        </p>
                    </div>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-600">
                    {videos.length} {videos.length === 1 ? "video" : "videos"}
                </span>
            </div>

            {/* ================= Featured Video ================= */}
            <div className="shrink-0">
                <AnimatePresence mode="wait" initial={false}>
                    {selectedVideo && (
                        <motion.section
                            key={selectedVideo.videoId}
                            initial={{ opacity: 0, y: 12, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.985 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                            <div className="relative rounded-2xl">
                                <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur" />

                                <div className="relative overflow-hidden rounded-2xl bg-black shadow-xl">
                                    <div className="aspect-video">
                                        <iframe
                                            className="absolute inset-0 h-full w-full"
                                            src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=${isAutoplayEnabled ? 1 : 0}&rel=0`}
                                            title={selectedVideo.title}
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="mt-4 flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                                    <PlayCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-gray-900">
                                        {selectedVideo.title
                                            .replace(/&#39;/g, "'")
                                            .replace(/&amp;/g, "&")}
                                    </p>
                                    <p className="mt-0.5 text-sm text-gray-500">Now playing</p>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>

            {/* ================= Video Grid ================= */}
            <div className="relative">
                <motion.div
                    layout
                    transition={{ layout: { duration: 0.3, ease: "easeOut" } }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {visibleVideos.map((video, vIndex) => (
                        <motion.button
                            key={video.videoId}
                            onClick={() => {
                                setSelectedVideo(video);
                                setIsAutoplayEnabled(true);
                            }}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: vIndex * 0.05 }}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`group relative overflow-hidden rounded-xl bg-white text-left transition-all duration-300
                ${selectedVideo?.videoId === video.videoId
                                    ? "ring-2 ring-indigo-500 ring-offset-2 shadow-xl"
                                    : "border border-gray-100 shadow-md hover:border-indigo-200 hover:shadow-xl"
                                }`}
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video overflow-hidden bg-gray-100">
                                <img
                                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                    alt={video.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300
                    ${selectedVideo?.videoId === video.videoId
                                                ? "scale-100 bg-indigo-600"
                                                : "scale-90 bg-black/50 opacity-0 backdrop-blur-sm group-hover:scale-100 group-hover:opacity-100"
                                            }`}
                                    >
                                        <PlayCircle className="h-7 w-7 text-white fill-white/30" />
                                    </div>
                                </div>

                                {selectedVideo?.videoId === video.videoId && (
                                    <div className="absolute left-3 top-3">
                                        <span className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                                            </span>
                                            Playing
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div className="p-3">
                                <p className="line-clamp-2 text-sm font-medium text-gray-800 transition-colors group-hover:text-indigo-600">
                                    {video.title
                                        .replace(/&#39;/g, "'")
                                        .replace(/&amp;/g, "&")}
                                </p>
                            </div>
                        </motion.button>
                    ))}
                </motion.div>
            </div>

            {/* ================= Pagination ================= */}
            {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 pt-8">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-gray-200"
                        >
                            <ChevronDown className="h-5 w-5 rotate-90" />
                        </button>

                        <div className="flex items-center gap-1.5 px-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-all duration-300
                                        ${currentPage === page
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-gray-200"
                        >
                            <ChevronDown className="h-5 w-5 -rotate-90" />
                        </button>
                    </div>

                    <p className="text-xs font-medium text-gray-400">
                        Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, videos.length)} of {videos.length} videos
                    </p>
                </div>
            )}
        </motion.div>
    );
}
