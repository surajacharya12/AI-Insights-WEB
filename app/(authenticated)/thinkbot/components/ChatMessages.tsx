"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "../utils/sessionStorage";

interface ChatMessagesProps {
  messages: ChatMessage[];
  botTyping: boolean;
  userName?: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages,
  botTyping,
  userName,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-3 pb-2">
      <AnimatePresence initial={false}>
        {messages.length === 0 && !botTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl">
              <Bot className="w-8 h-8 animate-bounce" />
            </div>
            <p className="text-gray-500 mt-2 text-center">
              Say hi to ThinkBot 🤖
            </p>
          </motion.div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-end ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Bot Avatar */}
            {msg.sender === "bot" && (
              <div className="mr-2 shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`max-w-[80%] px-4 py-2 rounded-xl wrap-break-word shadow-md ${
                msg.sender === "user"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-linear-to-r from-green-100 to-green-200 text-gray-900 rounded-bl-none"
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
            </div>

            {/* User Avatar */}
            {msg.sender === "user" && (
              <div className="ml-2 shrink-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 shadow">
                  {userName?.charAt(0).toUpperCase() || "U"}
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
            <div className="mr-2 shrink-0">
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
  );
}
