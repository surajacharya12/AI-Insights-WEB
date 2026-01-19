"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { getThinkBotResponse } from "../../api/thinkbotApi";
import Sidebar from "./components/Sidebar";
import ChatMessages from "./components/ChatMessages";
import WelcomeBanner from "./components/WelcomeBanner";
import ChatInput from "./components/ChatInput";
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
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Initialize from storage on mount
  useEffect(() => {
    const savedSessions = getAllSessions();
    setSessions(savedSessions);

    if (savedSessions.length > 0) {
      setCurrentSessionId(savedSessions[0].id);
      const maxId = savedSessions[0].messages.reduce((max, msg) => {
        const idNum = parseInt(msg.id.split("-")[1] || "0");
        return Math.max(max, idNum);
      }, 0);
      messageIdCounter.current = maxId;
    } else {
      // Create a new session if none exist
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
      };
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
    }

    setInitialized(true);
  }, []);

  // Save current session whenever messages change
  useEffect(() => {
    if (initialized && currentSessionId) {
      const session = sessions.find((s) => s.id === currentSessionId);
      if (session) {
        const updatedSession: ChatSession = {
          ...session,
          messages,
          title: generateSessionTitle(messages),
        };
        saveSession(updatedSession);
        setSessions((prev) =>
          prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
        );
      }
    }
  }, [messages, initialized, currentSessionId]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, botTyping]);

  const handleSend = async () => {
    if (!input.trim() || !currentSession) return;

    const userMessage: ChatMessage = {
      id: `user-${++messageIdCounter.current}`,
      sender: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setInput("");
    setBotTyping(true);

    try {
      const data = await getThinkBotResponse(input);

      let botContent = "I'm sorry, I couldn't process that.";
      if (data.success && data.data) {
        if (data.data.answer) {
          botContent = data.data.answer;
        } else if (data.data.title && data.data.points) {
          botContent = `### ${data.data.title}\n\n`;
          if (Array.isArray(data.data.points)) {
            botContent += data.data.points
              .map((p: string) => `- ${p}`)
              .join("\n");
          }
        }
      }

      const botMessage: ChatMessage = {
        id: `bot-${++messageIdCounter.current}`,
        sender: "bot",
        content: botContent,
        timestamp: new Date().toISOString(),
      };
      updatedMessages.push(botMessage);
    } catch (error: any) {
      let errorMsg = "Sorry, something went wrong. Please try again later.";

      if (error && error.error) {
        errorMsg = error.error;
      }

      if (error && error.details) {
        try {
          const detailsObj =
            typeof error.details === "string"
              ? JSON.parse(error.details)
              : error.details;
          if (detailsObj?.error?.message) {
            errorMsg = detailsObj.error.message;
          }
        } catch (e) {
          if (typeof error.details === "string" && error.details.length < 200) {
            errorMsg += `: ${error.details}`;
          }
        }
      }

      const errorMessage: ChatMessage = {
        id: `bot-error-${++messageIdCounter.current}`,
        sender: "bot",
        content: errorMsg,
        timestamp: new Date().toISOString(),
      };
      updatedMessages.push(errorMessage);
    } finally {
      // Update session with new messages
      const updatedSession: ChatSession = {
        ...currentSession,
        messages: updatedMessages,
        title: generateSessionTitle(updatedMessages),
      };
      saveSession(updatedSession);
      setSessions((prev) =>
        prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
      );
      setBotTyping(false);
    }
  };

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

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      const maxId = session.messages.reduce((max, msg) => {
        const idNum = parseInt(msg.id.split("-")[1] || "0");
        return Math.max(max, idNum);
      }, 0);
      messageIdCounter.current = maxId;
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    if (currentSessionId === sessionId) {
      if (sessions.length > 1) {
        const nextSession = sessions.find((s) => s.id !== sessionId);
        if (nextSession) {
          handleSelectSession(nextSession.id);
        }
      } else {
        handleNewChat();
      }
    }
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the chat history? This action cannot be undone.",
      )
    ) {
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
      {/* Chat History Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        initialized={initialized}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearHistory}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-10 overflow-hidden relative">
        <WelcomeBanner userName={user?.name} />

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-3xl shadow-2xl p-4 flex flex-col overflow-hidden relative">
          {/* Chat Messages */}
          <ChatMessages
            messages={messages}
            botTyping={botTyping}
            userName={user?.name}
            messagesEndRef={messagesEndRef}
          />

          {/* Chat Input */}
          <ChatInput
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            disabled={botTyping}
          />
        </div>
      </div>
    </div>
  );
}
