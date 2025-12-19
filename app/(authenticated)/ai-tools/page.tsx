"use client";

import { useUser } from "../../context/UserContext";
import { Sparkles, Youtube, Wand2, FileText, ScanText } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageGeneration } from "./components/ImageGeneration";
import { GrammarTool } from "./components/GrammarTool";
import TextGeneration from "./components/textgeneration";
import { Skeleton } from "@/components/ui/skeleton";
import YouTubSummarizer from "./components/YouTubSummarizer";

export default function AIToolsPage() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
                    <Skeleton className="h-8 sm:h-10 w-32 sm:w-48 rounded-md" />
                    <Skeleton className="h-4 w-48 sm:w-64 rounded-md" />
                    <Skeleton className="h-[400px] sm:h-[600px] w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="mb-6 sm:mb-10 pl-1">
                    <h1 className="text-2xl sm:text-4xl font-extrabold flex items-center gap-3 sm:gap-4 tracking-tight text-gray-900">
                        <div className="p-2 sm:p-2.5 bg-gradient-to-tr from-red-600 to-rose-500 rounded-xl sm:rounded-2xl shadow-lg shadow-red-200">
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        AI Tools
                    </h1>
                    <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-lg font-medium max-w-2xl leading-relaxed">
                        Turbocharge your workflow with our advanced AI utilities.
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="image-gen" className="space-y-6 sm:space-y-8">
                    <div className="bg-white/40 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl sm:rounded-[1.8rem] border border-white/60 shadow-inner overflow-hidden">
                        <TabsList className="flex flex-row w-full h-auto bg-transparent gap-0.5 sm:gap-1 p-0 overflow-x-auto no-scrollbar scroll-smooth">
                            <TabsTrigger
                                value="image-gen"
                                className="flex-1 min-w-[120px] sm:min-w-0 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-[1.4rem] transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-red-100 font-bold text-gray-400 text-xs sm:text-base"
                            >
                                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                <span className="whitespace-nowrap italic sm:not-italic">Images</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="grammar"
                                className="flex-1 min-w-[120px] sm:min-w-0 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-[1.4rem] transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-red-100 font-bold text-gray-400 text-xs sm:text-base"
                            >
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                <span className="whitespace-nowrap italic sm:not-italic">Grammar</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="text-gen"
                                className="flex-1 min-w-[120px] sm:min-w-0 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-[1.4rem] transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-red-100 font-bold text-gray-400 text-xs sm:text-base"
                            >
                                <ScanText className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                <span className="whitespace-nowrap italic sm:not-italic">Image To Text</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="youtub-text-gen"
                                className="flex-1 min-w-[120px] sm:min-w-0 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-[1.4rem] transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-red-100 font-bold text-gray-400 text-xs sm:text-base"
                            >
                                <Youtube className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                <span className="whitespace-nowrap italic sm:not-italic">Youtube</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl sm:rounded-[3rem] border border-white/60 shadow-2xl p-4 sm:p-12 min-h-[500px] sm:min-h-[650px] transition-all duration-500">
                        <TabsContent value="image-gen" className="mt-0 focus-visible:outline-none outline-none">
                            <ImageGeneration />
                        </TabsContent>

                        <TabsContent value="grammar" className="mt-0 focus-visible:outline-none outline-none">
                            <GrammarTool />
                        </TabsContent>

                        <TabsContent value="text-gen" className="mt-0 focus-visible:outline-none outline-none">
                            <TextGeneration />
                        </TabsContent>

                        <TabsContent value="youtub-text-gen" className="mt-0 focus-visible:outline-none outline-none">
                            <YouTubSummarizer />
                        </TabsContent>
                    </div>
                </Tabs>
            </motion.div>
        </div>
    );
}
