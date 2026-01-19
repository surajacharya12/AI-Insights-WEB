interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  expiresAt: number;
}

const SESSIONS_STORAGE_KEY = "thinkbot_chat_sessions";
const SESSION_DURATION_DAYS = 7;

export const getAllSessions = (): ChatSession[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!stored) return [];

    const sessions: ChatSession[] = JSON.parse(stored);

    // Filter out expired sessions
    const validSessions = sessions.filter((session) => {
      if (session.expiresAt && Date.now() > session.expiresAt) {
        return false;
      }
      return true;
    });

    // Save back the valid sessions
    if (validSessions.length !== sessions.length) {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(validSessions));
    }

    return validSessions;
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    return [];
  }
};

export const saveSession = (session: ChatSession): void => {
  if (typeof window === "undefined") return;

  try {
    const sessions = getAllSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);

    if (existingIndex !== -1) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }

    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

export const deleteSession = (sessionId: string): void => {
  if (typeof window === "undefined") return;

  try {
    const sessions = getAllSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting session:", error);
  }
};

export const generateSessionTitle = (messages: ChatMessage[]): string => {
  if (messages.length === 0) return "New Chat";
  const firstUserMsg = messages.find((m) => m.sender === "user");
  if (firstUserMsg) {
    return firstUserMsg.content.substring(0, 50) + (firstUserMsg.content.length > 50 ? "..." : "");
  }
  return "New Chat";
};

export type { ChatMessage, ChatSession };
export { SESSIONS_STORAGE_KEY, SESSION_DURATION_DAYS };
