"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Youtube,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Link2,
  AlertCircle,
  Zap,
  FileText,
  History,
  ShieldCheck,
  ArrowRight,
  Trash2,
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import API_URL from "@/app/api/api_url";
import {
  getAllToolSessions,
  getToolSessionsByType,
  saveToolSession,
  deleteToolSession,
  addToolResult,
  createToolSession,
  generateToolSessionTitle,
  ToolSession,
} from "../utils/sessionStorage";
import { toast } from "sonner";

interface YouTubeResult {
  id: string;
  timestamp: number;
  url: string;
  summary: string;
}

export default function YouTubSummarizer() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [sessions, setSessions] = useState<ToolSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize sessions on mount
  useEffect(() => {
    const allSessions = getToolSessionsByType("youtube");
    setSessions(allSessions);

    if (allSessions.length > 0) {
      setCurrentSessionId(allSessions[0].id);
    } else {
      // Create initial session
      const newSession = createToolSession("youtube", "YouTube Summary");
      saveToolSession(newSession);
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
    }
    setInitialized(true);
  }, []);

  const saveResultToSession = async (
    videoSummary: string,
    videoUrl: string,
  ) => {
    if (!currentSessionId) return;
    const session = sessions.find((s) => s.id === currentSessionId);
    if (session) {
      addToolResult(currentSessionId, "youtube", videoUrl, videoSummary);
      const updated = getToolSessionsByType("youtube");
      setSessions(updated);
    }
  };

  const restoreFromSession = (session: ToolSession) => {
    if (session.results && session.results.length > 0) {
      const lastResult = session.results[session.results.length - 1];
      setUrl(lastResult.input as string);
      setSummary(lastResult.output as string);
      setCurrentSessionId(session.id);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteToolSession(sessionId);
    setSessions(getToolSessionsByType("youtube"));
    if (currentSessionId === sessionId) {
      setCurrentSessionId("");
      setUrl("");
      setSummary("");
    }
  };

  const handleSummarize = async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError("");
      setSummary("");

      const res = await axios.post(`${API_URL}/api/summarize`, {
        videoUrl: url,
      });

      const summary = res.data.summary;
      setSummary(summary);

      // Save to session
      await saveResultToSession(summary, url);
      toast.success("Video summarized successfully!");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        "Unable to summarize this video. Please try another link.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const recentResults = currentSession?.results || [];

  return (
    <div className="flex gap-6 w-full">
      {/* History Sidebar */}
      <div className="hidden lg:block w-56 shrink-0">
        <div className="bg-gradient-to-b from-red-50 to-red-50/50 rounded-xl border border-red-100 p-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            Recent Summaries
          </h3>
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
                    className="p-2 rounded-lg bg-white border border-red-100 hover:border-red-300 transition cursor-pointer group relative"
                  >
                    <div
                      onClick={() => {
                        setUrl(String(result.input));
                        setSummary(String(result.output));
                      }}
                    >
                      <p className="text-xs font-medium text-gray-700 truncate pr-6">
                        {String(result.input).substring(0, 30)}...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentSessionId && currentSession) {
                          const updatedSession: ToolSession = {
                            ...currentSession,
                            results:
                              currentSession.results?.filter(
                                (r) => r.id !== result.id,
                              ) || [],
                          };
                          saveToolSession(updatedSession);
                          setSessions(getToolSessionsByType("youtube"));
                        }
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
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
      <section className="relative w-full py-4 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10">
          {/* Hero Header */}
          <header className="text-center space-y-3 sm:space-y-4 px-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100"
            >
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-nowrap">
                Powered by AI Insight
              </span>
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
            >
              YouTube{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
                Intelligence
              </span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-4"
            >
              Transform lengthy videos into structured insights in seconds. No
              more scrubbing through hours of footage.
            </motion.p>
          </header>

          {/* Main Input Component */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative group px-4 sm:px-6"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl sm:rounded-[2.5rem] blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
            <div className="relative bg-white/90 backdrop-blur-2xl border border-white/40 shadow-xl rounded-2xl sm:rounded-[2rem] p-3 sm:p-2 sm:pl-6 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full relative group">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 p-2">
                  <Link2 className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube link..."
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-5 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 font-medium text-sm sm:text-lg rounded-xl"
                />
              </div>
              <button
                onClick={handleSummarize}
                disabled={loading || !url}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gray-900 hover:bg-black text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 animate-spin text-red-500" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-rose-400" />
                    <span>Summarize</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Stats/Badges */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 px-2">
              {[
                { icon: ShieldCheck, text: "Encrypted" },
                { icon: History, text: "Saves 85% Time" },
                { icon: FileText, text: "Markdown" },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-sm font-semibold uppercase tracking-wider"
                >
                  <badge.icon className="w-3 h-3 sm:w-4 sm:h-4 text-red-400/60" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mx-4 sm:mx-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900 text-sm">
                    Extraction Error
                  </h4>
                  <p className="text-red-700 text-xs font-medium leading-relaxed">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <AnimatePresence>
            {summary && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4 sm:space-y-6 px-4 sm:px-6"
              >
                <div className="sticky top-2 sm:top-4 z-20 flex justify-between items-center bg-white/90 backdrop-blur-xl border border-gray-100 p-3 sm:p-4 rounded-xl sm:rounded-[1.5rem] shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-red-600 rounded-lg p-1.5 sm:p-2 shadow-lg shadow-red-100">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900">
                      Intelligence Report
                    </h3>
                  </div>
                  <button
                    onClick={copySummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 transition active:scale-95 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-[10px] sm:text-sm font-bold text-green-600 uppercase">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-[10px] sm:text-sm font-bold text-gray-700 uppercase">
                          Copy
                        </span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-12 shadow-xl border border-gray-50 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] pointer-events-none">
                    <Youtube className="w-48 h-48 sm:w-64 sm:h-64" />
                  </div>
                  <div className="relative prose prose-sm sm:prose-base prose-red max-w-none text-gray-700 prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-li:my-1 prose-strong:text-red-700/90 sm:prose-h3:text-2xl prose-h3:text-lg">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {summary}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="text-center pb-8">
                  <p className="text-gray-400 text-[10px] sm:text-xs font-medium italic">
                    Summaries are generated by AI and may vary in accuracy.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
