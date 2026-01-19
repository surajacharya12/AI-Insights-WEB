"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Wand2,
  Copy,
  CheckCircle2,
  PenTool,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { checkGrammar } from "@/app/api/aiToolsApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  getAllToolSessions,
  getToolSessionsByType,
  saveToolSession,
  deleteToolSession,
  addToolResult,
  createToolSession,
  generateToolSessionTitle,
  ToolSession,
  ToolResult,
  AI_TOOLS_SESSIONS_KEY,
} from "../utils/sessionStorage";

export function GrammarTool() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [corrected, setCorrected] = useState("");
  const [sessions, setSessions] = useState<ToolSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  // Initialize sessions on mount
  useEffect(() => {
    const allSessions = getToolSessionsByType("grammar");
    setSessions(allSessions);

    if (allSessions.length > 0) {
      setCurrentSessionId(allSessions[0].id);
    } else {
      // Create initial session
      const newSession = createToolSession("grammar", "Grammar Fixes");
      saveToolSession(newSession);
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
    }

    setInitialized(true);
  }, []);

  const handleImprove = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await checkGrammar(text);
      const result = data.corrected_text || "No correction available.";
      setCorrected(result);

      // Save to session
      if (currentSessionId) {
        const session = sessions.find((s) => s.id === currentSessionId);
        if (session) {
          addToolResult(currentSessionId, "grammar", text, result);
          const updated = getToolSessionsByType("grammar");
          setSessions(updated);
        }
      }

      toast.success("Grammar fixed successfully!");
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || 30;
        const minutes = Math.floor(retryAfter / 60);
        const seconds = retryAfter % 60;
        const timeMessage =
          minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        const fallback = error.response?.data?.fallback;

        if (fallback) {
          toast.error(
            <div className="flex flex-col gap-2">
              <p>Daily quota exceeded. Retry in {timeMessage}.</p>
              <a
                href={fallback.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm"
              >
                {fallback.message}
              </a>
            </div>,
            { duration: 7000 },
          );
        } else {
          toast.error(`Daily quota exceeded. Retry in ${timeMessage}.`, {
            duration: 5000,
          });
        }
      } else {
        toast.error("Grammar check failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const recentResults = currentSession?.results || [];

  return (
    <div className="flex gap-6 w-full">
      {/* History Sidebar */}
      <div className="hidden lg:block w-56 shrink-0">
        <div className="bg-linear-to-b from-emerald-50 to-emerald-50/50 rounded-xl border border-emerald-100 p-4 max-h-150 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Fixes</h3>
          <div className="space-y-2">
            {initialized && recentResults.length > 0 ? (
              recentResults
                .slice()
                .reverse()
                .map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 rounded-lg bg-white border border-emerald-100 hover:border-emerald-300 transition cursor-pointer group"
                    onClick={() => {
                      setText(String(result.input));
                      setCorrected(String(result.output));
                    }}
                  >
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {String(result.input).substring(0, 30)}...
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-4">
                No history yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-linear-to-r from-emerald-500/10 to-teal-500/10 border-b border-gray-100 p-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <PenTool className="w-6 h-6" />
              </div>
              AI Grammar & Style Fixer
            </CardTitle>
            <CardDescription className="text-gray-500 text-base ml-11">
              Instantly correct grammar, improve flow, and polish your writing.
              (Saves last 7 days)
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 ml-1 flex justify-between">
                <span>Original Text</span>
                <span className="text-xs text-gray-400">
                  {text.length} chars
                </span>
              </label>
              <div className="relative">
                <Textarea
                  className="min-h-100 p-5 text-base resize-none border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all leading-relaxed"
                  placeholder="Paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="absolute bottom-4 right-4">
                  <Button
                    onClick={handleImprove}
                    disabled={loading || !text.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all rounded-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Fix Grammar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-2">
                <span>Polished Version</span>
                {corrected && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </label>
              <div
                className={`relative h-full min-h-100 rounded-xl border transition-all ${corrected ? "bg-emerald-50/30 border-emerald-100" : "bg-gray-50 border-gray-100"}`}
              >
                {corrected ? (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 p-5 overflow-auto">
                      <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                        {corrected}
                      </p>
                    </div>
                    <div className="p-4 border-t border-emerald-100 bg-white/50 rounded-b-xl flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200"
                        onClick={() => {
                          navigator.clipboard.writeText(corrected);
                          toast.success("Copied polished text!");
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" /> Copy Result
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Wand2 className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="max-w-xs">
                      Your polished text will appear here after clicking "Fix
                      Grammar"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
