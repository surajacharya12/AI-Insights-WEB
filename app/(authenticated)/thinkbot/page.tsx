"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, Bot } from "lucide-react";
import { getThinkBotResponse } from "../../api/thinkbotApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
    id: number;
    sender: "user" | "bot";
    content: string;
    timestamp?: string;
}

export default function ThinkBotPage() {
    const { user, loading } = useUser();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [botTyping, setBotTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages, botTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const userMessage: ChatMessage = {
            id: Date.now(),
            sender: "user",
            content: input,
            timestamp,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setBotTyping(true);

        try {
            const data = await getThinkBotResponse(input);

            let botContent = "I'm sorry, I couldn't process that.";
            if (data.success && data.data) {
                if (data.data.answer) {
                    botContent = data.data.answer;
                } else if (data.data.title && data.data.points) {
                    // Convert structured JSON to Markdown
                    botContent = `### ${data.data.title}\n\n`;
                    if (Array.isArray(data.data.points)) {
                        botContent += data.data.points.map((p: string) => `- ${p}`).join("\n");
                    }
                }
            }

            const botMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: "bot",
                content: botContent,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error: any) {
            let errorMsg = "Sorry, something went wrong. Please try again later.";

            if (error && error.error) {
                errorMsg = error.error;
            }

            if (error && error.details) {
                try {
                    const detailsObj = typeof error.details === "string" ? JSON.parse(error.details) : error.details;
                    if (detailsObj?.error?.message) {
                        errorMsg = detailsObj.error.message;
                    }
                } catch (e) {
                    // If parsing fails, use the raw string if it's helpful
                    if (typeof error.details === "string" && error.details.length < 200) {
                        errorMsg += `: ${error.details}`;
                    }
                }
            }

            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: "bot",
                content: errorMsg,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setBotTyping(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen md:h-[90vh] p-4 md:p-10 bg-gradient-to-br from-green-50 to-green-100">
            {/* Advanced Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 rounded-3xl bg-white shadow-xl border-l-8 border-green-500 text-center max-w-3xl mx-auto"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-green-900">ThinkBot 🤖</h1>
                <p className="text-green-700 mt-2">AI-powered assistant to help you learn faster and smarter!</p>
                {user && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 inline-block bg-green-50 border border-green-200 rounded-xl px-4 py-2 shadow-sm"
                    >
                        <p className="text-green-800 text-sm">
                            Welcome, <span className="font-semibold">{user.name}</span>!
                        </p>
                    </motion.div>
                )}
            </motion.div>

            {/* Chat container */}
            <div className="flex-1 bg-white rounded-3xl shadow-2xl p-4 flex flex-col overflow-hidden relative">
                {/* Floating bot in middle */}
                <AnimatePresence>
                    {!messages.length && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none"
                        >
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl">
                                <Bot className="w-8 h-8 animate-bounce" />
                            </div>
                            <p className="text-gray-500 mt-2 text-center">Say hi to ThinkBot 🤖</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 overflow-y-auto space-y-3 pb-2">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {/* Bot Avatar */}
                                {msg.sender === "bot" && (
                                    <div className="mr-2 flex-shrink-0">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                                            <Bot className="w-6 h-6" />
                                        </div>
                                    </div>
                                )}

                                {/* Message bubble */}
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-xl break-words shadow-md ${msg.sender === "user"
                                        ? "bg-green-600 text-white rounded-br-none"
                                        : "bg-gradient-to-r from-green-100 to-green-200 text-gray-900 rounded-bl-none"
                                        }`}
                                >
                                    {msg.sender === "bot" ? (
                                        <div className="prose prose-sm max-w-none prose-p:text-gray-900 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-900 prose-ol:text-gray-900 prose-li:text-gray-900 prose-code:text-gray-900 prose-pre:bg-gray-100 prose-pre:text-gray-900">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p>{msg.content}</p>
                                    )}
                                    {msg.timestamp && (
                                        <span className="text-xs text-gray-500 mt-1 block text-right">{msg.timestamp}</span>
                                    )}
                                </div>

                                {/* User Avatar */}
                                {msg.sender === "user" && (
                                    <div className="ml-2 flex-shrink-0">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 shadow">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {/* Bot typing indicator */}
                        {botTyping && (
                            <motion.div
                                key="typing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-end justify-start"
                            >
                                <div className="mr-2 flex-shrink-0">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="bg-gray-100 px-4 py-2 rounded-xl rounded-bl-none shadow-sm flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="mt-3 flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition shadow-sm"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-2xl transition shadow-md hover:scale-105"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
