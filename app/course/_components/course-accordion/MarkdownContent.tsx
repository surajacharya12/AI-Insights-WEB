"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

// --- Code Block Component with Copy Button ---
function CodeBlock({ language, children }: { language: string; children: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group/code my-4">
            {/* Language badge */}
            <div className="absolute top-0 left-4 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-b-lg uppercase tracking-wider z-10">
                {language || "code"}
            </div>

            {/* Copy button */}
            <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all opacity-0 group-hover/code:opacity-100 z-10"
                title="Copy code"
            >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <SyntaxHighlighter
                style={oneDark}
                language={language || "text"}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    borderRadius: "1rem",
                    padding: "2.5rem 1.5rem 1.5rem 1.5rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.7",
                }}
                codeTagProps={{
                    style: {
                        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace",
                    },
                }}
            >
                {children}
            </SyntaxHighlighter>
        </div>
    );
}

// --- Enhanced Markdown Renderer ---
export default function MarkdownContent({ content }: { content: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                // Headings
                h1: ({ children }) => (
                    <h1 className="text-3xl font-black text-gray-900 mt-8 mb-4 pb-3 border-b-2 border-indigo-200 flex items-center gap-3">
                        <span className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full" />
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-indigo-800 mt-6 mb-3 flex items-center gap-2">
                        <span className="w-1 h-5 bg-indigo-400 rounded-full" />
                        {children}
                    </h3>
                ),
                h4: ({ children }) => (
                    <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-2">{children}</h4>
                ),

                // Paragraphs
                p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-4 text-base">{children}</p>
                ),

                // Strong/Bold
                strong: ({ children }) => (
                    <strong className="font-bold text-indigo-700">{children}</strong>
                ),

                // Emphasis/Italic
                em: ({ children }) => (
                    <em className="italic text-gray-600">{children}</em>
                ),

                // Code blocks
                code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;

                    if (isInline) {
                        return (
                            <code className="px-2 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-md text-sm font-mono border border-indigo-100" {...props}>
                                {children}
                            </code>
                        );
                    }

                    return (
                        <CodeBlock language={match[1]}>
                            {String(children).replace(/\n$/, "")}
                        </CodeBlock>
                    );
                },

                // Pre (handled by code block)
                pre: ({ children }) => <>{children}</>,

                // Lists
                ul: ({ children }) => (
                    <ul className="my-4 space-y-2 ml-1">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="my-4 space-y-2 ml-1 list-decimal list-inside">{children}</ol>
                ),
                li: ({ children, ...props }) => {
                    const isOrdered = (props as any).ordered;

                    return (
                        <li className="flex items-start gap-3 text-gray-700 leading-relaxed">
                            {!isOrdered && (
                                <span className="mt-2 w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex-shrink-0" />
                            )}
                            <span className="flex-grow">{children}</span>
                        </li>
                    );
                },

                // Tables
                table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">{children}</table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">{children}</thead>
                ),
                tbody: ({ children }) => (
                    <tbody className="bg-white divide-y divide-gray-100">{children}</tbody>
                ),
                tr: ({ children }) => (
                    <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
                ),
                th: ({ children }) => (
                    <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{children}</td>
                ),

                // Blockquotes
                blockquote: ({ children }) => (
                    <blockquote className="my-6 pl-6 py-4 border-l-4 border-indigo-400 bg-gradient-to-r from-indigo-50 to-transparent rounded-r-xl italic text-gray-700">
                        {children}
                    </blockquote>
                ),

                // Horizontal rules
                hr: () => (
                    <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                ),

                // Links
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium underline decoration-indigo-300 hover:decoration-indigo-500 underline-offset-2 transition-colors"
                    >
                        {children}
                    </a>
                ),

                // Images
                img: ({ src, alt }) => (
                    <img
                        src={src}
                        alt={alt || ""}
                        className="my-6 rounded-xl shadow-lg max-w-full h-auto"
                    />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
