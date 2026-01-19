"use client";

import { motion } from "framer-motion";
import {
  Loader2,
  Trash2,
  MessageCircle,
  FileText,
  ScanText,
  Youtube,
  Wand2,
} from "lucide-react";
import { ToolSession } from "../utils/sessionStorage";

interface ToolHistorySidebarProps {
  sessions: ToolSession[];
  currentSessionId: string;
  initialized: boolean;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
  tool: "grammar" | "image-to-text" | "youtube" | "image-generation";
}

const toolIcons = {
  grammar: <FileText className="w-4 h-4" />,
  "image-to-text": <ScanText className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  "image-generation": <Wand2 className="w-4 h-4" />,
};

const toolColors = {
  grammar: "emerald",
  "image-to-text": "blue",
  youtube: "red",
  "image-generation": "purple",
};

export default function ToolHistorySidebar({
  sessions,
  currentSessionId,
  initialized,
  onSelectSession,
  onDeleteSession,
  onNewSession,
  tool,
}: ToolHistorySidebarProps) {
  const color = toolColors[tool];
  const bgColor =
    color === "emerald"
      ? "bg-emerald-50"
      : color === "blue"
        ? "bg-blue-50"
        : color === "red"
          ? "bg-red-50"
          : "bg-purple-50";

  const borderColor =
    color === "emerald"
      ? "border-emerald-200"
      : color === "blue"
        ? "border-blue-200"
        : color === "red"
          ? "border-red-200"
          : "border-purple-200";

  const hoverColor =
    color === "emerald"
      ? "hover:bg-emerald-100"
      : color === "blue"
        ? "hover:bg-blue-100"
        : color === "red"
          ? "hover:bg-red-100"
          : "hover:bg-purple-100";

  return (
    <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className={`p-4 border-b ${borderColor} flex items-center justify-between`}
      >
        <h2 className="text-sm font-bold text-gray-900">History</h2>
        <button
          onClick={onNewSession}
          className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded transition"
          title="New session"
        >
          New
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
        {!initialized ? (
          <div className="text-center py-8">
            <Loader2 className="w-5 h-5 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-xs text-gray-500">Loading...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No history yet</p>
          </div>
        ) : (
          sessions.map((session) => (
            <motion.button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              whileHover={{ x: 2 }}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-xs flex items-center justify-between group ${
                currentSessionId === session.id
                  ? `${bgColor} border border-${color}-300`
                  : `${hoverColor}`
              }`}
            >
              <div className="flex-1 min-w-0 flex items-center gap-2">
                {toolIcons[tool]}
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {session.title}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {session.results.length} result
                    {session.results.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700 shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
