// AI Tools Session Storage Utility

interface ToolResult {
  id: string;
  tool: "grammar" | "image-to-text" | "youtube" | "image-generation";
  input: string | string[]; // input can be text, URL, or file path
  output: string | object;
  createdAt: number;
  timestamp: string;
}

interface ToolSession {
  id: string;
  tool: "grammar" | "image-to-text" | "youtube" | "image-generation";
  title: string;
  results: ToolResult[];
  createdAt: number;
  expiresAt: number;
}

const AI_TOOLS_SESSIONS_KEY = "ai_tools_sessions";
const SESSION_DURATION_DAYS = 7;

export const getAllToolSessions = (): ToolSession[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(AI_TOOLS_SESSIONS_KEY);
    if (!stored) return [];

    const sessions: ToolSession[] = JSON.parse(stored);

    // Filter out expired sessions
    const validSessions = sessions.filter((session) => {
      if (session.expiresAt && Date.now() > session.expiresAt) {
        return false;
      }
      return true;
    });

    // Save back the valid sessions
    if (validSessions.length !== sessions.length) {
      localStorage.setItem(AI_TOOLS_SESSIONS_KEY, JSON.stringify(validSessions));
    }

    return validSessions;
  } catch (error) {
    console.error("Error retrieving tool sessions:", error);
    return [];
  }
};

export const getToolSessionsByType = (tool: ToolSession["tool"]): ToolSession[] => {
  const all = getAllToolSessions();
  return all.filter((session) => session.tool === tool);
};

export const saveToolSession = (session: ToolSession): void => {
  if (typeof window === "undefined") return;

  try {
    const sessions = getAllToolSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);

    if (existingIndex !== -1) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }

    localStorage.setItem(AI_TOOLS_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving tool session:", error);
  }
};

export const deleteToolSession = (sessionId: string): void => {
  if (typeof window === "undefined") return;

  try {
    const sessions = getAllToolSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem(AI_TOOLS_SESSIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting tool session:", error);
  }
};

export const addToolResult = (
  sessionId: string,
  tool: ToolSession["tool"],
  input: string | string[],
  output: string | object
): ToolResult => {
  const result: ToolResult = {
    id: `${tool}-${Date.now()}`,
    tool,
    input,
    output,
    createdAt: Date.now(),
    timestamp: new Date().toISOString(),
  };

  const sessions = getAllToolSessions();
  const session = sessions.find((s) => s.id === sessionId);

  if (session) {
    session.results.push(result);
    saveToolSession(session);
  }

  return result;
};

export const deleteToolResult = (sessionId: string, resultId: string): void => {
  const sessions = getAllToolSessions();
  const session = sessions.find((s) => s.id === sessionId);

  if (session) {
    session.results = session.results.filter((r) => r.id !== resultId);
    saveToolSession(session);
  }
};

export const createToolSession = (tool: ToolSession["tool"], title: string): ToolSession => {
  return {
    id: `${tool}-${Date.now()}`,
    tool,
    title,
    results: [],
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  };
};

export const generateToolSessionTitle = (tool: ToolSession["tool"], input: string | string[]): string => {
  const toolNames = {
    grammar: "Grammar Fix",
    "image-to-text": "Image to Text",
    youtube: "YouTube Summary",
    "image-generation": "Image Generation",
  };

  const toolName = toolNames[tool];
  
  if (Array.isArray(input)) {
    return `${toolName} - ${input[0]?.substring(0, 30) || "New"}...`;
  }
  
  return `${toolName} - ${input.substring(0, 50)}${input.length > 50 ? "..." : ""}`;
};

export type { ToolResult, ToolSession };
export { AI_TOOLS_SESSIONS_KEY, SESSION_DURATION_DAYS };
