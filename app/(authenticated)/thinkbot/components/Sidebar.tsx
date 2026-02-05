"use client";

import { motion } from "framer-motion";
import { Loader2, X, Plus, Trash2, MessageCircle } from "lucide-react";
import { ChatSession } from "../utils/sessionStorage";

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  initialized: boolean;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClearAll: () => void;
}

export default function Sidebar({
  sessions,
  currentSessionId,
  initialized,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAll,
}: Omit<SidebarProps, "sidebarOpen" | "onCloseSidebar">) {
  return (
    <div className="hidden md:flex w-64 bg-white shadow-2xl flex-col border-r border-gray-200 overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-green-900">Chat History</h2>
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="m-3 flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition shadow-md"
      >
        <Plus className="w-5 h-5" />
        <span>New Chat</span>
      </button>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        {!initialized ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-sm text-gray-500">Loading chats...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No chats yet</p>
          </div>
        ) : (
          sessions.map((session) => (
            <motion.div
              key={session.id}
              onClick={() => {
                onSelectSession(session.id);
              }}
              whileHover={{ x: 4 }}
              className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between group cursor-pointer ${currentSessionId === session.id
                  ? "bg-green-100 border-l-4 border-green-600"
                  : "hover:bg-gray-100"
                }`}
            >
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm truncate ${currentSessionId === session.id
                      ? "font-bold text-green-900"
                      : "text-gray-700"
                    }`}
                >
                  {session.title}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition text-red-600 hover:text-red-700 p-1 rounded-md hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Clear All Button */}
      {sessions.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onClearAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
}
