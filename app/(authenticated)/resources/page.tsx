"use client";

import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Upload, Search, FileText, X, User, Mail, Calendar, Eye, BookOpen, Trash2 } from "lucide-react";
import API_URL from "../../api/api_url";
import { toast } from "sonner";

interface Resource {
    id: number;
    topic: string;
    description: string;
    authorName: string;
    authorEmail: string;
    date: string;
    views: number;
    fileName: string;
    fileUrl: string;
}

export default function ResourcesPage() {
    const { user, loading } = useUser();
    const [file, setFile] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Form State
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [authorEmail, setAuthorEmail] = useState("");

    const [resources, setResources] = useState<Resource[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoadingResources, setIsLoadingResources] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await fetch(`${API_URL}/api/resources`);
            if (response.ok) {
                const data = await response.json();
                setResources(data);
            } else {
                console.error("Failed to fetch resources");
            }
        } catch (error) {
            console.error("Error fetching resources:", error);
        } finally {
            setIsLoadingResources(false);
        }
    };

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
                    setResources([newResource, ...resources]);

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

    const handleDeleteResource = async (resourceId: number) => {
        if (!user?.email) return;

        // Use a custom toast for confirmation or just proceed with window.confirm for critical actions
        // For better UX, we can keep confirm or use a custom dialog. 
        // The user asked for toast in all screen, but confirm is a browser dialog.
        // Let's keep confirm for safety but use toast for result.
        if (confirm("Are you sure you want to delete this resource?")) {
            try {
                const response = await fetch(`${API_URL}/api/resources/${resourceId}?userEmail=${user.email}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    setResources(resources.filter(r => r.id !== resourceId));
                    toast.success("Resource deleted successfully.");
                } else {
                    const data = await response.json();
                    toast.error(data.error || "Failed to delete resource.");
                }
            } catch (error) {
                console.error("Error deleting resource:", error);
                toast.error("An error occurred.");
            }
        }
    };

    const handleReadPdf = async (resource: Resource) => {
        // Increment view count
        try {
            await fetch(`${API_URL}/api/resources/${resource.id}/view`, {
                method: "PUT"
            });

            // Update local state to reflect view count change immediately
            setResources(resources.map(r =>
                r.id === resource.id ? { ...r, views: r.views + 1 } : r
            ));
        } catch (error) {
            console.error("Error updating view count:", error);
        }

        // Open PDF
        window.open(resource.fileUrl, "_blank");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    const filteredResources = resources.filter(res =>
        res.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 space-y-10 font-sans">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            Knowledge <span className="text-green-600">Hub</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg">
                            Share, discover, and learn from a community of researchers.
                        </p>
                    </div>
                    {user && (
                        <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Welcome back,</p>
                                <p className="text-xs text-gray-500">{user.name}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto mb-12">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-4 bg-white border-0 rounded-2xl text-gray-900 shadow-lg ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 transition-all duration-200"
                        placeholder="Search for topics, authors, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section (Left Column) */}
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

                    {/* Resources List (Right Column) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Latest Resources</h2>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {filteredResources.length} Results
                            </span>
                        </div>

                        {isLoadingResources ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                            </div>
                        ) : (
                            <AnimatePresence>
                                {filteredResources.map((resource) => (
                                    <motion.div
                                        key={resource.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 hover:text-green-600 cursor-pointer transition-colors">
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
                                                <div className="p-3 bg-red-50 rounded-xl">
                                                    <FileText className="w-8 h-8 text-red-500" />
                                                </div>
                                                <button
                                                    onClick={() => handleReadPdf(resource)}
                                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors group"
                                                >
                                                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    Read PDF
                                                </button>
                                                {user?.email === resource.authorEmail && (
                                                    <button
                                                        onClick={() => handleDeleteResource(resource.id)}
                                                        className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}

                        {!isLoadingResources && filteredResources.length === 0 && (
                            <div className="text-center py-12">
                                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
                                <p className="text-gray-500">Try adjusting your search or upload a new resource.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
