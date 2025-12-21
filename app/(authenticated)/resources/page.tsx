"use client";

import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import API_URL from "../../api/api_url";
import { toast } from "sonner";
import { Resource } from "./types";
import ResourceCard from "./components/ResourceCard";
import UploadResourceForm from "./components/UploadResourceForm";
import ResourceViewerModal from "./components/ResourceViewerModal";

export default function ResourcesPage() {
    const { user, loading } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoadingResources, setIsLoadingResources] = useState(true);
    const [viewingResource, setViewingResource] = useState<Resource | null>(null);

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

    const handleUploadSuccess = (newResource: Resource) => {
        setResources([newResource, ...resources]);
    };

    const handleDeleteResource = async (resourceId: number) => {
        if (!user?.email) return;

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

    const handleView = async (resource: Resource) => {
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
        setViewingResource(resource);
    }

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
                    <UploadResourceForm onUploadSuccess={handleUploadSuccess} />

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
                                    <ResourceCard
                                        key={resource.id}
                                        resource={resource}
                                        userEmail={user?.email}
                                        onView={handleView}
                                        onDelete={handleDeleteResource}
                                    />
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

            <ResourceViewerModal
                resource={viewingResource}
                onClose={() => setViewingResource(null)}
            />
        </div>
    );
}
