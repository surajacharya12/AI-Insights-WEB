"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { Loader2 } from "lucide-react";
import Sidebar from "./components/Sidebar";
import ChatMessages from "./components/ChatMessages";
import WelcomeBanner from "./components/WelcomeBanner";
import ChatInput from "./components/ChatInput";
import { getThinkBotResponse } from "../../api/thinkbotApi";
import {
  getAllSessions,
  saveSession,
  deleteSession,
  generateSessionTitle,
  ChatMessage,
  ChatSession,
  SESSIONS_STORAGE_KEY,
  SESSION_DURATION_DAYS,
} from "./utils/sessionStorage";

export default function ThinkBotPage() {
  const { user, loading } = useUser();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  /* -------------------------------- INIT -------------------------------- */

  useEffect(() => {
    const savedSessions = getAllSessions();
    setSessions(savedSessions);

    if (savedSessions.length > 0) {
      setCurrentSessionId(savedSessions[0].id);
      messageIdCounter.current = savedSessions[0].messages.length;
    } else {
      handleNewChat();
    }

    setInitialized(true);
  }, []);

  /* ---------------------------- AUTO SCROLL ---------------------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

  /* --------------------------- FIXED HANDLE SEND -------------------------- */

  const handleSend = async () => {
    if (!input.trim() || !currentSession) return;

    const userMessage: ChatMessage = {
      id: `user-${++messageIdCounter.current}`,
      sender: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    // ✅ 1. Show user message immediately (OPTIMISTIC UPDATE)
    const optimisticMessages = [...messages, userMessage];

    const optimisticSession: ChatSession = {
      ...currentSession,
      messages: optimisticMessages,
      title: generateSessionTitle(optimisticMessages),
    };

    setSessions((prev) =>
      prev.map((s) => (s.id === optimisticSession.id ? optimisticSession : s)),
    );
    saveSession(optimisticSession);

    setInput("");
    setBotTyping(true);

    try {
      const data = await getThinkBotResponse(userMessage.content);

      let botContent = "I'm sorry, I couldn't process that.";

      if (data?.success && data?.data) {
        if (data.data.answer) {
          botContent = data.data.answer;
        } else if (data.data.title && data.data.points) {
          botContent = `### ${data.data.title}\n\n${data.data.points
            .map((p: string) => `- ${p}`)
            .join("\n")}`;
        }
      }

      const botMessage: ChatMessage = {
        id: `bot-${++messageIdCounter.current}`,
        sender: "bot",
        content: botContent,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...optimisticMessages, botMessage];

      const finalSession: ChatSession = {
        ...currentSession,
        messages: finalMessages,
        title: generateSessionTitle(finalMessages),
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === finalSession.id ? finalSession : s)),
      );
      saveSession(finalSession);
    } catch {
      const errorMessage: ChatMessage = {
        id: `bot-error-${++messageIdCounter.current}`,
        sender: "bot",
        content: "Something went wrong. Please try again.",
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...optimisticMessages, errorMessage];

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession.id ? { ...s, messages: finalMessages } : s,
        ),
      );
    } finally {
      setBotTyping(false);
    }
  };

  /* ----------------------------- NEW CHAT ----------------------------- */

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
    };

    saveSession(newSession);
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    messageIdCounter.current = 0;
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    const session = sessions.find((s) => s.id === id);
    messageIdCounter.current = session?.messages.length || 0;
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearHistory = () => {
    if (confirm("Clear all chat history?")) {
      localStorage.removeItem(SESSIONS_STORAGE_KEY);
      setSessions([]);
      handleNewChat();
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
    <div className="flex h-screen md:h-[90vh] bg-linear-to-br from-green-50 to-green-100">
      {" "}
      {/* Chat History Sidebar */}{" "}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        initialized={initialized}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearHistory}
      />{" "}
      {/* Main Content */}{" "}
      <div className="flex-1 flex flex-col p-4 md:p-10 overflow-hidden relative">
        {" "}
        <WelcomeBanner userName={user?.name} /> {/* Chat Container */}{" "}
        <div className="flex-1 bg-white rounded-3xl shadow-2xl p-4 flex flex-col overflow-hidden relative">
          {" "}
          {/* Chat Messages */}{" "}
          <ChatMessages
            messages={messages}
            botTyping={botTyping}
            userName={user?.name}
            messagesEndRef={messagesEndRef}
          />{" "}
          {/* Chat Input */}{" "}
          <ChatInput
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            disabled={botTyping}
          />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
