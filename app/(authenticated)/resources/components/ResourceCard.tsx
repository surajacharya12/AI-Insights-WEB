"use client";
import { motion } from "framer-motion";
import { Calendar, Mail, Eye, FileText, Trash2, Download } from "lucide-react";
import { Resource } from "../types";
import { downloadPdf } from "../utils";

interface ResourceCardProps {
    resource: Resource;
    userEmail?: string;
    onView: (resource: Resource) => void;
    onDelete: (id: number) => void;
}

export default function ResourceCard({ resource, userEmail, onView, onDelete }: ResourceCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
        >
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                        <h3
                            className="text-xl font-bold text-gray-900 line-clamp-1 hover:text-green-600 cursor-pointer transition-colors"
                            onClick={() => onView(resource)}
                        >
                            {resource.topic}
                        </h3>
                        <span className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 whitespace-nowrap ml-2">
                            <Calendar className="w-3 h-3 mr-1" /> {resource.date}
                        </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {resource.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                {resource.authorName.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-700">{resource.authorName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="text-xs">{resource.authorEmail}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-xs">{resource.views} views</span>
                        </div>
                    </div>
                </div>

                <div className="flex md:flex-col items-center justify-center gap-3 min-w-[140px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <div className="p-3 bg-red-50 rounded-xl hidden md:block">
                        <FileText className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="flex flex-row md:flex-col gap-2 w-full">
                        <button
                            onClick={() => onView(resource)}
                            className="flex-1 w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors group"
                        >
                            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            View
                        </button>
                        <button
                            onClick={() => downloadPdf(resource)}
                            className="flex-1 w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors group shadow-sm"
                        >
                            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Download
                        </button>
                    </div>
                    {userEmail === resource.authorEmail && (
                        <button
                            onClick={() => onDelete(resource.id)}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
