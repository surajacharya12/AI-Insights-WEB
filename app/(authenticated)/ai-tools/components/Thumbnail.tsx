"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Sparkles, Image as ImageIcon, X,
  Download, Wand2, Type, Layout, MousePointer2
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_URL from "@/app/api/api_url";

const STYLE_PRESETS = [
  "Cinematic & Realistic",
  "Vibrant Gamer Style",
  "Minimalist Modern",
  "High Contrast Drama",
  "Bold Typography",
  "Soft Pastel Aesthetic",
];

export default function Thumbnail() {
  const [images, setImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [thumbnailText, setThumbnailText] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<{ images: string[] } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages([reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleGenerate = async () => {
    if (!prompt || images.length === 0) {
      toast.error(!prompt ? "Style prompt is required" : "Base image is required");
      return;
    }

    try {
      setLoading(true);
      const base64 = images[0];
      const blob = await (await fetch(base64)).blob();
      const file = new File([blob], "thumbnail.png", { type: blob.type });

      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("thumbnailText", thumbnailText);
      formData.append("image", file);

      const res = await axios.post(`${API_URL}/api/thumbnails/generate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      if (!res.data.success) throw new Error(res.data.error || "Generation failed");

      const outputData = res.data.output;
      if (outputData) {
        const imagesToShow: string[] = [];
        if (outputData.thumbnailUrl) imagesToShow.push(outputData.thumbnailUrl);
        if (outputData.aiBackgroundUrl) imagesToShow.push(outputData.aiBackgroundUrl);
        if (outputData.originalImageUrl) imagesToShow.push(outputData.originalImageUrl);

        setOutput({ images: imagesToShow });
        toast.success("Thumbnail generated successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <header className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-medium text-sm border border-red-100"
          >
            <Sparkles size={16} />
            AI-Powered Design Studio
          </motion.div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Pro YouTube <span className="text-red-600">Thumbnails</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Turn your snapshots into high-CTR masterpieces with Gemini-3. Just upload, describe, and dominate the feed.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white p-8 shadow-2xl shadow-gray-200/50">

          {/* Controls Panel */}
          <div className="xl:col-span-5 space-y-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Layout size={18} className="text-red-500" />
                Upload Base Image
              </label>

              <div
                onDragEnter={onDrag}
                onDragOver={onDrag}
                onDragLeave={onDrag}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer transition-all
                  ${dragActive ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-gray-300"}
                `}
              >
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFiles(e.target.files)} />
                <AnimatePresence mode="wait">
                  {images[0] ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-2"
                    >
                      <img src={images[0]} alt="Input" className="w-full h-full object-cover rounded-2xl" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setImages([]); }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload"
                      className="flex flex-col items-center text-center px-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4 border border-gray-100">
                        <Upload className="text-red-500" />
                      </div>
                      <p className="font-semibold text-gray-900">Click or drag & drop</p>
                      <p className="text-sm text-gray-500">Supports JPG, PNG up to 10MB</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Type size={18} className="text-red-500" />
                Thumbnail Heading
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={thumbnailText}
                  onChange={(e) => setThumbnailText(e.target.value)}
                  placeholder="e.g. 24 HOURS IN NYC"
                  className="w-full h-14 rounded-2xl border-gray-200 pl-12 pr-4 bg-white/50 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <MousePointer2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Wand2 size={18} className="text-red-500" />
                Describe the Vibe
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Dramatic sunset background with lens flare..."
                className="w-full rounded-2xl border-gray-200 bg-white/50 p-4 focus:ring-2 focus:ring-red-500 transition-all resize-none"
              />
              <div className="flex flex-wrap gap-2">
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setPrompt(preset)}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                      ${prompt === preset ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-600 border-gray-100 hover:border-red-200 hover:text-red-600"}
                    `}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt || images.length === 0}
              className="group relative w-full h-16 rounded-2xl bg-gray-900 text-white font-bold overflow-hidden transition-all hover:bg-black active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2 relative z-10 text-lg">
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Wand2 size={24} />
                    </motion.div>
                    Manifesting Magic...
                  </>
                ) : (
                  <>
                    Generate Masterpiece
                    <Sparkles className="group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </div>
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </div>

          {/* Preview Panel */}
          <div className="xl:col-span-7 rounded-[2rem] bg-gray-50/50 border border-gray-100 p-8 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="text-red-500" />
              Real-time Preview
            </h3>

            <div className="flex-1 flex flex-col justify-center items-center gap-8">
              {!output && !loading && (
                <div className="text-center space-y-4 max-w-sm">
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto text-gray-300">
                    <Layout size={32} />
                  </div>
                  <p className="text-gray-400 font-medium">Configure your settings to the left to see the magic happen.</p>
                </div>
              )}

              {loading && (
                <div className="w-full space-y-8">
                  <div className="aspect-video w-full rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent -translate-x-full animate-shimmer" />
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400 animate-pulse">Consulting Gemini-3 Models...</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video rounded-xl bg-gray-100/50 animate-pulse" />
                    <div className="aspect-video rounded-xl bg-gray-100/50 animate-pulse" />
                  </div>
                </div>
              )}

              {output && !loading && (
                <div className="w-full space-y-8 h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Final Composition</span>
                      <a href={output.images[0]} download className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700">
                        <Download size={14} /> Download Ultra-HD
                      </a>
                    </div>
                    <div className="group relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-red-200/50 border-4 border-white transition-transform hover:scale-[1.01]">
                      <img src={output.images[0]} alt="Result" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {output.images.slice(1).map((img, idx) => (
                      <div key={idx} className="space-y-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {idx === 0 ? "AI Enhancement" : "Original Base"}
                        </span>
                        <div className="aspect-video rounded-xl overflow-hidden border border-gray-200 bg-white group cursor-zoom-in">
                          <img src={img} alt="Process" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Gemini-3 Pro", desc: "Next-gen vision models for human-like image understanding.", icon: Wand2 },
            { title: "Canvas Compositing", desc: "Direct hardware-accelerated text & graphics blending.", icon: Layout },
            { title: "CTR Optimized", desc: "Built on high-performance YouTube thumbnail datasets.", icon: Sparkles }
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                <feature.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
