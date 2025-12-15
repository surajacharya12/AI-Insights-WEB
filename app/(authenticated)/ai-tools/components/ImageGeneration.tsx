"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Image as ImageIcon, Download } from "lucide-react";
import { generateImage } from "@/app/api/aiToolsApi";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function ImageGeneration() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setImageUrl(null);

        try {
            const data = await generateImage(prompt);
            if (data.success) {
                if (data.output.image) {
                    // Native Gemini Image
                    const base64Image = `data:image/png;base64,${data.output.image}`;
                    setImageUrl(base64Image);
                    toast.success("Image generated successfully!");
                } else if (data.output.enhanced_prompt) {
                    // Fallback to Pollinations
                    if (data.output.is_fallback) {
                        toast.info("Quota exceeded for native image. Using free generator.");
                    }
                    const enhancedPrompt = data.output.enhanced_prompt;
                    const encodedPrompt = encodeURIComponent(enhancedPrompt);
                    const generatedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;
                    setImageUrl(generatedUrl);
                    toast.success("Image generated successfully!");
                }
            }
        } catch (error: any) {
            if (error.response?.status === 429) {
                toast.error("Quota exceeded. Please try again later.");
            } else {
                toast.error("Failed to generate prompt. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!imageUrl) return;

        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `generated-image-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Image downloaded successfully!");
        } catch (error) {
            console.error('Download failed:', error);
            toast.error("Failed to download image");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto"
        >
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-b border-gray-100 p-6">
                    <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                        <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        AI Image Generator
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-base ml-11">
                        Turn your ideas into stunning visuals using advanced AI.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 ml-1">Your Idea</label>
                        <div className="relative">
                            <Textarea
                                className="min-h-[120px] p-4 pb-14 text-base resize-none border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl transition-all"
                                placeholder="Describe your image idea (e.g., 'A futuristic city at sunset with flying cars')..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <div className="absolute bottom-3 right-3">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={loading || !prompt.trim()}
                                    className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 transition-all rounded-lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate Image
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {imageUrl && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-6"
                            >
                                {/* Generated Image Section */}
                                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-gray-50">
                                    <div className="relative aspect-square w-full max-w-2xl mx-auto">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={imageUrl}
                                            alt="Generated AI Art"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDownload}
                                            className="hover:bg-violet-50 text-violet-600 border-violet-200"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Image
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!imageUrl && !loading && (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                            <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                            <p>Enter an idea above to generate a unique AI image</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
