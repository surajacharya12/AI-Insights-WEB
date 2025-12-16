"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, FileText, Upload, Bot, User, ArrowDownCircle, X, Trash2, History } from "lucide-react";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import API_URL from "@/app/api/api_url";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
}

interface PDF {
    id: number;
    fileName: string;
    uploadedAt: string;
}

export default function ChatPdfPage() {
    const { user } = useUser();
    const userEmail = user?.email || "";

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: "assistant", content: "👋 Welcome! Upload a PDF or select one from your history to start chatting." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [userPdfs, setUserPdfs] = useState<PDF[]>([]);
    const [selectedPdf, setSelectedPdf] = useState<PDF | null>(null);
    const [loadingPdfs, setLoadingPdfs] = useState(true);
    const fileRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch user's PDFs on load
    useEffect(() => {
        if (userEmail) {
            fetchUserPdfs();
        }
    }, [userEmail]);

    const fetchUserPdfs = async () => {
        try {
            setLoadingPdfs(true);
            const response = await fetch(`${API_URL}/api/chatpdf/list?userEmail=${encodeURIComponent(userEmail)}`);
            const data = await response.json();
            if (response.ok) {
                setUserPdfs(data.pdfs || []);
            }
        } catch (error) {
            console.error("Error fetching PDFs:", error);
        } finally {
            setLoadingPdfs(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("⚠️ Please upload a valid PDF file.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("⚠️ File is too large. Maximum size is 10MB.");
            return;
        }

        setUploading(true);
        toast.info(`📤 Uploading: ${file.name}`);

        try {
            const formData = new FormData();
            formData.append("pdf", file);
            formData.append("userEmail", userEmail);

            const response = await fetch(`${API_URL}/api/chatpdf/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.pdf) {
                setUserPdfs((prev) => [data.pdf, ...prev]);
                setSelectedPdf(data.pdf);
                toast.success(`✅ ${data.pdf.fileName} uploaded successfully!`);
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        role: "assistant",
                        content: `✅ **${data.pdf.fileName}** uploaded successfully!\n\nYou can now ask me any questions about this document.`,
                    },
                ]);
            } else {
                toast.error(`⚠️ ${data.message || "Failed to upload the PDF. Please try again."}`);
            }
        } catch (error) {
            console.error("Error uploading PDF:", error);
            toast.error("⚠️ Error connecting to the server. Please try again.");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const selectPdf = (pdf: PDF) => {
        setSelectedPdf(pdf);
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                role: "assistant",
                content: `📄 Now chatting with **${pdf.fileName}**\n\nAsk me anything about this document!`,
            },
        ]);
    };

    const deletePdf = async (pdf: PDF) => {
        if (!confirm(`Delete "${pdf.fileName}"?`)) return;

        try {
            const response = await fetch(`${API_URL}/api/chatpdf/delete/${pdf.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail }),
            });

            if (response.ok) {
                setUserPdfs((prev) => prev.filter((p) => p.id !== pdf.id));
                if (selectedPdf?.id === pdf.id) {
                    setSelectedPdf(null);
                }
                toast.success(`🗑️ ${pdf.fileName} has been deleted.`);
            }
        } catch (error) {
            console.error("Error deleting PDF:", error);
            toast.error("Failed to delete PDF.");
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userQuestion = input.trim();
        const userMsg: Message = { id: Date.now(), role: "user", content: userQuestion };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        if (!selectedPdf) {
            toast.warning("📄 Please select a PDF from your history or upload a new one first.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/chatpdf/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pdfId: selectedPdf.id,
                    question: userQuestion,
                    userEmail,
                }),
            });

            const data = await response.json();

            if (response.ok && data.answer) {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, role: "assistant", content: data.answer },
                ]);
            } else {
                toast.error(`⚠️ ${data.message || "Failed to get an answer. Please try again."}`);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("⚠️ Error connecting to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-green-50 to-white">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r p-6 hidden md:flex flex-col shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <FileText className="text-green-600 w-6 h-6" />
                    <h2 className="font-bold text-xl text-gray-800">Chat with PDF</h2>
                </div>

                {/* Upload Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 justify-center border-2 border-dashed border-green-300 rounded-2xl p-4 text-green-700 hover:bg-green-50 transition shadow-sm disabled:opacity-50 mb-6"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" /> Upload New PDF
                        </>
                    )}
                </motion.button>
                <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleFileChange}
                />

                {/* PDF History */}
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-600">
                    <History className="w-4 h-4" />
                    Your PDFs
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {loadingPdfs ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                    ) : userPdfs.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No PDFs uploaded yet</p>
                    ) : (
                        userPdfs.map((pdf) => (
                            <motion.div
                                key={pdf.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between group ${selectedPdf?.id === pdf.id
                                    ? "bg-green-100 border-2 border-green-400"
                                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                                    }`}
                                onClick={() => selectPdf(pdf)}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span className="text-sm truncate">{pdf.fileName}</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePdf(pdf);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="mt-4 text-xs text-gray-400">
                    Max file size: 10MB
                </div>
            </aside>

            {/* Main Chat */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
                    <div>
                        <h1 className="font-semibold text-gray-800 text-lg">PDF Assistant</h1>
                        {selectedPdf && (
                            <p className="text-xs text-green-600 truncate max-w-xs">{selectedPdf.fileName}</p>
                        )}
                    </div>
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <Sparkles className="w-4 h-4 animate-pulse" /> AI Ready
                    </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <motion.div
                                        className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shadow-inner flex-shrink-0"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <Bot className="w-5 h-5 text-green-600" />
                                    </motion.div>
                                )}

                                <motion.div
                                    className={`max-w-[70%] rounded-3xl px-5 py-3 text-sm shadow-lg ${msg.role === "user"
                                        ? "bg-green-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 rounded-bl-none"
                                        }`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-800">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </motion.div>

                                {msg.role === "user" && (
                                    <motion.div
                                        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-inner flex-shrink-0"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <User className="w-5 h-5 text-gray-600" />
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {(loading || uploading) && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> {uploading ? "Uploading PDF..." : "AI is thinking…"}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Scroll to bottom */}
                <motion.div
                    className="absolute bottom-32 right-6 cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                >
                    <ArrowDownCircle className="w-8 h-8 text-green-500 animate-bounce" />
                </motion.div>

                {/* Input */}
                <div className="border-t bg-white p-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                            placeholder={selectedPdf ? "Ask a question about the PDF…" : "Select a PDF first…"}
                            disabled={!selectedPdf || loading}
                            className="flex-1 border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm disabled:opacity-50 disabled:bg-gray-50"
                        />
                        <motion.button
                            onClick={sendMessage}
                            disabled={!selectedPdf || loading || !input.trim()}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-3 transition shadow-md disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </main>
        </div>
    );
}
