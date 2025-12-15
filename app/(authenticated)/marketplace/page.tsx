"use client";

import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function MarketplacePage() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
                <p className="text-gray-600 mb-6">
                    Explore and purchase courses
                </p>
                {user && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-green-800">
                            Welcome, <span className="font-semibold">{user.name}</span>! (User ID: {user.id})
                        </p>
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6"
            >
                <p className="text-gray-600">Marketplace features coming soon...</p>
            </motion.div>
        </div>
    );
}
