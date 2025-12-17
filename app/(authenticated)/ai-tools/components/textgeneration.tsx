"use client";

import React, { useState, useEffect, useRef } from "react";
import { imageToText } from "@/app/api/aiToolsApi";
import {
    Loader2,
    UploadCloud,
    ClipboardCopy,
    FileText,
    CheckCircle2,
    Trash2,
    Share2,
    ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function TextGeneration() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const dropRef = useRef<HTMLLabelElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are supported");
            return;
        }
        setImage(file);
        setResult("");
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) {
                        handleFile(file);
                        toast.success("Image pasted from clipboard");
                        break;
                    }
                }
            }
        };
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, []);

    const handleExtractText = async () => {
        if (!image || !preview) {
            toast.error("Please upload, drop, or paste an image");
            return;
        }
        setLoading(true);
        try {
            const base64 = preview.split(",")[1];
            const data = await imageToText(base64, { extract: "all", format: "markdown" });
            setResult(data.text || "No text found in image.");
            toast.success("Text extracted successfully!");
        } catch (error: any) {
            if (error.response?.status === 429) {
                toast.error("Daily quota exceeded. Try again later.");
            } else {
                toast.error("Image to text failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        toast.success("Text copied to clipboard");
    };

    const clearAll = () => {
        setImage(null);
        setPreview(null);
        setResult("");
        toast("Cleared all inputs");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100 px-4 py-12">
            <div className="w-full max-w-4xl rounded-3xl border bg-white shadow-2xl p-8 space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold text-gray-800">📄 Image to Text Converter</h1>
                    <p className="text-gray-500 text-lg">
                        Easily extract text from any image. Upload, drag & drop, or paste from clipboard.
                    </p>
                </div>

                {/* Upload / Drop Zone */}
                <label
                    ref={dropRef}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all
          ${dragActive ? "border-blue-500 bg-blue-50 shadow-lg" : "hover:border-blue-400 hover:bg-gray-50"}
        `}
                >
                    <UploadCloud className="w-12 h-12 text-gray-400" />
                    <span className="text-gray-500 text-center text-sm sm:text-base">
                        Click, drag & drop, or paste an image to get started
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {/* Preview */}
                {preview && (
                    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full max-h-96 object-contain bg-gray-50 transition-transform hover:scale-105"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleExtractText}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-blue-600 text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-60"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? "Extracting..." : "Extract Text"}
                    </button>
                    <button
                        onClick={clearAll}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-gray-300 text-gray-600 py-3 font-medium hover:bg-gray-100 transition"
                    >
                        <Trash2 className="w-5 h-5" /> Clear All
                    </button>
                </div>

                {/* Result */}
                {result && (
                    <div className="rounded-2xl border bg-gray-50 p-6 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-700 font-semibold">
                                <FileText className="w-6 h-6" /> Extracted Text
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={copyToClipboard}
                                    className="text-gray-500 hover:text-blue-600 transition"
                                    title="Copy to clipboard"
                                >
                                    <ClipboardCopy className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="prose max-w-full overflow-x-auto break-words">
                            <ReactMarkdown>{result}</ReactMarkdown>
                        </div>

                        <div className="flex items-center gap-2 text-green-600 font-medium">
                            <CheckCircle2 className="w-5 h-5" /> Text extraction complete
                        </div>
                    </div>
                )}

                {/* Tips Section */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl flex items-start gap-3">
                    <ImageIcon className="w-6 h-6 text-blue-500 mt-1" />
                    <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Tip:</strong> Use high-quality images for best results.</p>
                        <p><strong>Shortcut:</strong> Press <code>Ctrl+V</code> to paste an image from clipboard.</p>
                        <p><strong>Pro Tip:</strong> You can extract multiple lines, tables, or even code snippets.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
