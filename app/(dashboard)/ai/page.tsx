"use client";

import React from "react";
import { Bot, Sparkles, Zap } from "lucide-react";
import { ModelCard } from "@/components/ai/ModelCard";
import { ChatInterface } from "@/components/ai/ChatInterface";

export default function AIPage() {
    return (
        <div className="h-[calc(100vh-13rem)] md:h-[calc(100vh-9rem)] rounded-t-xl bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.08),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.1),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.08),transparent_35%)] flex flex-col overflow-hidden">
            <ChatInterface>
                <div className="flex flex-col gap-8 sm:gap-10 pb-10">
                    <div className="text-center space-y-4 md:space-y-6 pt-8">
                        <div className="flex items-center justify-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-xs font-medium text-secondary-foreground flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                                Google AI Studio
                            </span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-[2.1rem] sm:text-4xl md:text-6xl font-serif font-medium tracking-tight text-foreground">
                                CourseHub{" "}
                                <span className="text-primary">AI</span>
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
                                Next-gen models to summarize, reason, and
                                co-create for your courses—built to feel calm
                                and fast on every screen.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ModelCard
                            title="Gemini 2.0 Flash"
                            status="Active"
                            description="Best for deep reasoning, multimodal context, and complex course work."
                            icon={Bot}
                            accent="from-blue-500/20 to-purple-500/20"
                        />
                        <ModelCard
                            title="Gemini 2.5 Flash"
                            status="Coming Soon"
                            description="Fast, lightweight runs for quick answers and batch tasks."
                            icon={Zap}
                            accent="from-amber-400/25 to-orange-500/25"
                            disabled
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mt-8">
                        <span className="hover:text-foreground cursor-pointer transition-colors">
                            Privacy Policy
                        </span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">
                            Terms of Service
                        </span>
                    </div>
                </div>
            </ChatInterface>
        </div>
    );
}
