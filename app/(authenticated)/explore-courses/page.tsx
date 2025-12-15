"use client";

import { motion } from "framer-motion";
import CourseList from "../_components/CourseList";

export default function ExploreCoursesPage() {
    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Courses</h1>
                <p className="text-gray-600 mb-6">
                    Browse our comprehensive course catalog.
                </p>

                <CourseList mode="all" />
            </motion.div>
        </div>
    );
}
