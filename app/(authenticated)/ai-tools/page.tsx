"use client";

import { useUser } from "../../context/UserContext";
import { Sparkles, Image, PenTool, Type } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageGeneration } from "./components/ImageGeneration";
import { GrammarTool } from "./components/GrammarTool";
import TextGeneration from "./components/textgeneration";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIToolsPage() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-6xl mx-auto space-y-8">
                    <Skeleton className="h-10 w-48 rounded-md" />
                    <Skeleton className="h-4 w-64 rounded-md" />
                    <Skeleton className="h-[600px] w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold flex items-center gap-2">
                        <Sparkles className="w-8 h-8" /> AI Tools
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Advanced AI-powered utilities to boost productivity
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="image-gen" className="bg-white rounded-2xl shadow p-6">
                    <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="image-gen" className="flex gap-2">
                            <Image className="w-4 h-4" /> Image Generator
                        </TabsTrigger>

                        <TabsTrigger value="grammar" className="flex gap-2">
                            <PenTool className="w-4 h-4" /> Grammar AI
                        </TabsTrigger>

                        <TabsTrigger value="text-gen" className="flex gap-2">
                            <Type className="w-4 h-4" /> Image to Text Generation
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="image-gen">
                        <ImageGeneration />
                    </TabsContent>

                    <TabsContent value="grammar">
                        <GrammarTool />
                    </TabsContent>

                    <TabsContent value="text-gen">
                        <TextGeneration />
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}
