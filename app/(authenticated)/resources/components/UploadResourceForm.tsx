"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, User, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import API_URL from "../../../api/api_url";
import { Resource } from "../types";

interface UploadResourceFormProps {
    onUploadSuccess: (resource: Resource) => void;
}

export default function UploadResourceForm({ onUploadSuccess }: UploadResourceFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [authorEmail, setAuthorEmail] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file && topic && description && authorName && authorEmail) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("topic", topic);
            formData.append("description", description);
            formData.append("authorName", authorName);
            formData.append("authorEmail", authorEmail);
            formData.append("file", file);

            try {
                const response = await fetch(`${API_URL}/api/resources`, {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const newResource = await response.json();
                    onUploadSuccess(newResource);

                    // Reset form
                    setFile(null);
                    setTopic("");
                    setDescription("");
                    setAuthorName("");
                    setAuthorEmail("");

                    toast.success(`Resource "${topic}" uploaded successfully!`);
                } else {
                    const errorData = await response.json();
                    toast.error(`Upload failed: ${errorData.error || "Unknown error"}`);
                }
            } catch (error) {
                console.error("Error uploading resource:", error);
                toast.error("An error occurred during upload.");
            } finally {
                setIsUploading(false);
            }
        } else {
            toast.error("Please fill in all fields and select a file.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-1"
        >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 sticky top-8">
                <div className="bg-green-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Upload className="w-5 h-5" /> Share Resource
                    </h2>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic Name</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                            placeholder="e.g., Quantum Physics 101"
                            disabled={isUploading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                            placeholder="Brief summary of the content..."
                            disabled={isUploading}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                    placeholder="John Doe"
                                    disabled={isUploading}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={authorEmail}
                                    onChange={(e) => setAuthorEmail(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                    placeholder="john@example.com"
                                    disabled={isUploading}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
                        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors cursor-pointer bg-gray-50 hover:bg-green-50 group relative ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isUploading}
                            />
                            <div className="space-y-1 text-center">
                                {file ? (
                                    <div className="flex flex-col items-center">
                                        <FileText className="mx-auto h-12 w-12 text-green-600" />
                                        <p className="text-sm text-green-600 font-medium mt-2">{file.name}</p>
                                        <p className="text-xs text-gray-500">Click to change</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-green-500 transition-colors" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <span className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                                Upload a file
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02] ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                            </span>
                        ) : (
                            "Publish Resource"
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
