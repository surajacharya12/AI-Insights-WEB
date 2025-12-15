"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, FileText, Upload, Bot, User } from "lucide-react";

export default function ChatPdfPage() {
    const [messages, setMessages] = useState([
        { id: 1, role: "assistant", content: "Upload a PDF and ask me anything about it." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // mock AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: "This is a sample answer based on the uploaded PDF content.",
                },
            ]);
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                    <FileText className="text-green-600" />
                    <h2 className="font-bold text-lg">Chat with PDF</h2>
                </div>

                <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 justify-center border-2 border-dashed border-green-300 rounded-xl p-4 text-green-700 hover:bg-green-50 transition"
                >
                    <Upload className="w-5 h-5" /> Upload PDF
                </button>
                <input ref={fileRef} type="file" accept="application/pdf" hidden />

                <div className="mt-auto text-xs text-gray-400">
                    Supported: PDF • Max 10MB
                </div>
            </aside>

            {/* Main Chat */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h1 className="font-semibold text-gray-800">PDF Assistant</h1>
                    <span className="text-sm text-green-600">AI Ready</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-green-600" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow ${msg.role === "user"
                                        ? "bg-green-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 rounded-bl-none"
                                        }`}
                                >
                                    {msg.content}
                                </div>

                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> AI is thinking…
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="border-t bg-white p-4">
                    <div className="flex items-center gap-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask something about the PDF…"
                            className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-3 transition"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
