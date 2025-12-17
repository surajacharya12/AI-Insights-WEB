"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, Scale } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Scale className="w-6 h-6 text-purple-600" />
                        <span>Terms of Service</span>
                    </div>
                    <Link href="/signup">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Signup
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-block">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Last updated: December 17, 2025
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">1</div>
                            Acceptance of Terms
                        </h2>
                        <p className="mb-4">
                            By accessing and using AI Insight ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">2</div>
                            AI-Generated Content
                        </h2>
                        <p className="mb-4">
                            Our Service utilizes artificial intelligence to generate educational content, quizzes, and other materials. While we strive for accuracy, you acknowledge that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>AI-generated content may occasionally contain errors or inaccuracies.</li>
                            <li>You should verify critical information from authoritative sources.</li>
                            <li>The Service is provided for educational and informational purposes only.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">3</div>
                            User Accounts
                        </h2>
                        <p className="mb-4">
                            To access certain features, you must create an account. You agree to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Provide accurate and complete information.</li>
                            <li>Maintain the security of your account credentials.</li>
                            <li>Promptly notify us of any unauthorized use of your account.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">4</div>
                            Intellectual Property
                        </h2>
                        <p className="mb-4">
                            The content generated specifically for you by the Service is licensed to you for personal, non-commercial use. The underlying software, design, and AI models remain the exclusive property of AI Insight.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">5</div>
                            Limitation of Liability
                        </h2>
                        <p className="mb-4">
                            In no event shall AI Insight be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses resulting from the use of or inability to use the service.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
                    &copy; 2025 AI Insight. All rights reserved.
                </div>
            </main>
        </div>
    );
}
