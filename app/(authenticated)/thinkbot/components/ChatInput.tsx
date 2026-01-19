"use client";

import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatInput({
  input,
  onInputChange,
  onSend,
  disabled = false,
}: ChatInputProps) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Type a message..."
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none px-4 py-3 rounded-2xl border border-gray-300 disabled:opacity-50
             focus:outline-none focus:ring-2 focus:ring-green-500
             focus:border-green-500 transition shadow-sm
             wrap-break-word whitespace-pre-wrap"
      />

      <button
        onClick={onSend}
        disabled={disabled}
        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-3 rounded-2xl transition shadow-md hover:scale-105"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
