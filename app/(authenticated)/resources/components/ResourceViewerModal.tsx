"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, X } from "lucide-react";
import { Resource } from "../types";
import { downloadPdf } from "../utils";

interface ResourceViewerModalProps {
    resource: Resource | null;
    onClose: () => void;
}

export default function ResourceViewerModal({ resource, onClose }: ResourceViewerModalProps) {
    return (
        <AnimatePresence>
            {resource && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-8"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl w-full h-full max-w-6xl flex flex-col overflow-hidden shadow-2xl"
                    >
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{resource.topic}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-1">
                                        by {resource.authorName}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => downloadPdf(resource)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    <Download className="w-4 h-4" /> Download
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-100 relative">
                            <iframe
                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(resource.fileUrl)}&embedded=true`}
                                className="w-full h-full border-none"
                                title={resource.topic}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
