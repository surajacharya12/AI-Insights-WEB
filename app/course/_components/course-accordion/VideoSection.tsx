"use client";

import React, { useState } from "react";
import { Video, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { YouTubeVideo } from "./types";

interface VideoSectionProps {
    videos: YouTubeVideo[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

    if (!videos || videos.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5"
        >
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg shadow-red-200">
                        <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900">Video Resources</h4>
                        <p className="text-sm text-gray-500">Watch and learn from curated content</p>
                    </div>
                </div>
                <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-semibold text-gray-600">
                    {videos.length} {videos.length === 1 ? "video" : "videos"}
                </span>
            </div>

            {/* Featured Video Player */}
            <AnimatePresence mode="wait">
                {selectedVideo && (
                    <motion.div
                        key={selectedVideo.videoId}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                    >
                        {/* Video container with glow */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-200/50">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20" />
                            <div className="relative bg-black rounded-2xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                                    title={selectedVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex items-start gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <PlayCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {selectedVideo.title.replace(/&#39;/g, "'").replace(/&amp;/g, "&")}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Now playing</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video, vIndex) => (
                    <motion.button
                        key={vIndex}
                        onClick={() => setSelectedVideo(video)}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: vIndex * 0.05 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group/card relative bg-white rounded-xl overflow-hidden text-left transition-all duration-300 ${selectedVideo?.videoId === video.videoId
                                ? "ring-2 ring-indigo-500 ring-offset-2 shadow-xl"
                                : "shadow-md hover:shadow-xl border border-gray-100 hover:border-indigo-200"
                            }`}
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden bg-gray-100">
                            <img
                                src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${selectedVideo?.videoId === video.videoId
                                        ? "bg-indigo-600 scale-100"
                                        : "bg-black/50 backdrop-blur-sm scale-90 opacity-0 group-hover/card:opacity-100 group-hover/card:scale-100"
                                    }`}>
                                    <PlayCircle className="w-7 h-7 text-white fill-white/30" />
                                </div>
                            </div>

                            {/* Playing indicator */}
                            {selectedVideo?.videoId === video.videoId && (
                                <div className="absolute top-3 left-3">
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                                        </span>
                                        Playing
                                    </span>
                                </div>
                            )}

                            {/* Duration placeholder */}
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                                Video
                            </div>
                        </div>

                        {/* Title */}
                        <div className="p-3">
                            <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover/card:text-indigo-600 transition-colors">
                                {video.title.replace(/&#39;/g, "'").replace(/&amp;/g, "&")}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
