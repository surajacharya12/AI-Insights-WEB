"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Shield className="w-6 h-6 text-pink-600" />
                        <span>Privacy Policy</span>
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
                    <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent inline-block">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Last updated: December 17, 2025
                    </p>

                    <p className="mb-8 text-lg leading-relaxed">
                        At AI Insight, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use our platform.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">1</div>
                            Information We Collect
                        </h2>
                        <p className="mb-4">We collect information you provide directly to us:</p>
                        <ul className="grid md:grid-cols-2 gap-4 mt-4">
                            <li className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <strong className="block text-gray-900 dark:text-white mb-1">Account Information</strong>
                                Your name, email address, and password when you register.
                            </li>
                            <li className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <strong className="block text-gray-900 dark:text-white mb-1">Usage Data</strong>
                                Information about how you access and use the Service, including courses generated and quizzes taken.
                            </li>
                            <li className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <strong className="block text-gray-900 dark:text-white mb-1">User Content</strong>
                                Topic inputs, PDF uploads, and other materials you submit for processing.
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">2</div>
                            How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>To provide, operate, and maintain our Service.</li>
                            <li>To improve, personalize, and expand our Service.</li>
                            <li>To generate personalized educational content using AI providers.</li>
                            <li>To communicate with you, including for customer service, updates, and other information related to the Service.</li>
                            <li>To find and prevent fraud.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">3</div>
                            Data Sharing and Third Parties
                        </h2>
                        <p className="mb-4">
                            We may share your information with third-party service providers to help us provide our Service, such as:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li><strong>AI Providers:</strong> We send your topic inputs and text content to AI models (like Google Gemini or OpenRouter) to generate course materials.</li>
                            <li><strong>Cloud Storage:</strong> Services used to store user uploads and data (e.g., Cloudinary, Database providers).</li>
                            <li><strong>Analytics:</strong> Tools to help us understand how our Service is used.</li>
                        </ul>
                        <p className="text-sm text-gray-500 italic mt-2">
                            We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">4</div>
                            Security
                        </h2>
                        <p className="mb-4">
                            We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">5</div>
                            Your Rights
                        </h2>
                        <p className="mb-4">
                            You have the right to access, update, or delete the information we have on you. If you wish to exercise these rights, please contact us.
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
